import { NextResponse } from "next/server";

import {
  AccessDeniedError,
  AuthConfigurationError,
  requireSchedulerPermission,
} from "@/lib/auth";
import { smokeTestMetaConnection } from "@/lib/meta/instagram";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSchedulerPermission("read");

    const result = await smokeTestMetaConnection();
    return NextResponse.json(result, {
      status: result.ok ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Meta smoke test failed.",
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

