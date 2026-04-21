import { NextResponse } from "next/server";

import {
  AccessDeniedError,
  AuthConfigurationError,
  requireSchedulerPermission,
} from "@/lib/auth";
import { importContentCalendar } from "@/lib/data/posts";
import { buildSeedCalendarPayload, parseContentCalendar } from "@/lib/content/import";
import { sanitizeImportedPayloadForRole } from "@/lib/postRoleSafety";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const access = await requireSchedulerPermission("edit");

    const formData = await request.formData();
    const file = formData.get("file");
    const raw = String(formData.get("raw") ?? "");
    const filenameInput = String(formData.get("filename") ?? "calendar.json");
    const shouldSeed = formData.get("seed") === "true";

    const rawPayload = shouldSeed
      ? buildSeedCalendarPayload()
      : file instanceof File
        ? parseContentCalendar(await file.text(), file.name)
        : parseContentCalendar(raw, filenameInput);
    const payload = sanitizeImportedPayloadForRole(access.role, rawPayload);

    await importContentCalendar({
      posts: payload.posts,
      templates: payload.templates,
    });

    return NextResponse.json({
      imported: payload.posts.length,
      templates: payload.templates.length,
      sanitized: payload.sanitizedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Import failed.",
      },
      {
        status:
          error instanceof AccessDeniedError
            ? 403
            : error instanceof AuthConfigurationError
              ? 503
              : 500,
      },
    );
  }
}
