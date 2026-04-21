import { NextResponse } from "next/server";

import {
  AccessDeniedError,
  AuthConfigurationError,
  requireSchedulerPermission,
} from "@/lib/auth";
import { importContentCalendar } from "@/lib/data/posts";
import { buildSeedCalendarPayload, parseContentCalendar } from "@/lib/content/import";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireSchedulerPermission("edit");

    const formData = await request.formData();
    const file = formData.get("file");
    const raw = String(formData.get("raw") ?? "");
    const filenameInput = String(formData.get("filename") ?? "calendar.json");
    const shouldSeed = formData.get("seed") === "true";

    const payload = shouldSeed
      ? buildSeedCalendarPayload()
      : file instanceof File
        ? parseContentCalendar(await file.text(), file.name)
        : parseContentCalendar(raw, filenameInput);

    await importContentCalendar(payload);

    return NextResponse.json({
      imported: payload.posts.length,
      templates: payload.templates.length,
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
