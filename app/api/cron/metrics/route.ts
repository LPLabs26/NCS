import { NextResponse } from "next/server";

import { getCronSecret } from "@/lib/env";
import { collectDailyMetrics } from "@/lib/scheduler/collectDailyMetrics";

function isAuthorized(request: Request): boolean {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerSecret = request.headers.get("x-cron-secret");
  const expected = getCronSecret();
  return bearer === expected || headerSecret === expected;
}

async function handler(request: Request) {
  if (!isAuthorized(request)) {
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
