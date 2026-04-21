import { NextResponse } from "next/server";

import { getCronSecret } from "@/lib/env";
import { collectDailyMetrics } from "@/lib/scheduler/collectDailyMetrics";

function getExpectedSecret(): string | null {
  try {
    return getCronSecret();
  } catch {
    return null;
  }
}

function isAuthorized(request: Request, expected: string): boolean {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerSecret = request.headers.get("x-cron-secret");
  return bearer === expected || headerSecret === expected;
}

async function handler(request: Request) {
  const expectedSecret = getExpectedSecret();
  if (!expectedSecret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }

  if (!isAuthorized(request, expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  const results = await collectDailyMetrics();
  return NextResponse.json({
    processed: results.length,
    results,
  });
}

export const GET = handler;
export const POST = handler;
