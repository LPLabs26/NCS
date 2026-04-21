import { NextResponse } from "next/server";

import { getCronSecret, isDryRun } from "@/lib/env";
import { publishDuePosts } from "@/lib/scheduler/publishDuePosts";

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

  const results = await publishDuePosts({
    mode: "cron",
    dryRun: isDryRun(),
  });

  return NextResponse.json({
    dryRun: isDryRun(),
    processed: results.length,
    results,
  });
}

export const GET = handler;
export const POST = handler;
