import { NextResponse } from "next/server";

import { getCronSecret, isDryRun, isLiveCronEnabled } from "@/lib/env";
import { publishDuePosts } from "@/lib/scheduler/publishDuePosts";

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

  const configuredDryRun = isDryRun();
  const liveCronEnabled = isLiveCronEnabled();
  const effectiveDryRun = configuredDryRun || !liveCronEnabled;
  const results = await publishDuePosts({
    mode: "cron",
    dryRun: effectiveDryRun,
  });

  return NextResponse.json({
    dryRun: effectiveDryRun,
    configuredDryRun,
    liveCronEnabled,
    processed: results.length,
    results,
  });
}

export const GET = handler;
export const POST = handler;
