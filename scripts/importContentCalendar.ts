import { parseArgs } from "node:util";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { buildSeedCalendarPayload, parseContentCalendar } from "@/lib/content/import";
import {
  applyOwnerSafeDefaultsToPayload,
  summarizePostsByPillar,
} from "@/lib/content/safety";
import { importContentCalendar, isConfigured } from "@/lib/data/posts";
import { loadLocalEnvIfPresent } from "@/scripts/_socialCli";

loadLocalEnvIfPresent();

async function main() {
  if (!isConfigured()) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before importing.",
    );
  }

  console.warn(
    "Warning: scripts/importContentCalendar.ts uses service-role credentials and should only be run by a trusted owner/admin operator.",
  );

  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      seed: { type: "boolean", default: false },
      safe: { type: "boolean", default: false },
    },
  });

  const inputPath = positionals[0];

  const rawPayload = values.seed
    ? buildSeedCalendarPayload()
    : inputPath
      ? parseContentCalendar(await readFile(resolve(inputPath), "utf8"), inputPath)
      : buildSeedCalendarPayload();
  const payload = values.safe ? applyOwnerSafeDefaultsToPayload(rawPayload) : rawPayload;

  await importContentCalendar(payload);
  const summary = summarizePostsByPillar(payload.posts);

  console.log(`Imported ${payload.posts.length} posts and ${payload.templates.length} templates.`);
  if (values.safe) {
    console.log("Safe import mode kept posts as drafts with owner approval off.");
  }
  console.log("Posts by pillar:");
  summary.forEach((item) => {
    console.log(`- ${item.pillar}: ${item.count}`);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
