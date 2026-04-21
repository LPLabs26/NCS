import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { buildSeedCalendarPayload, parseContentCalendar } from "@/lib/content/import";
import { importContentCalendar, isConfigured } from "@/lib/data/posts";

async function main() {
  if (!isConfigured()) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before importing.",
    );
  }

  const inputPath = process.argv[2];

  const payload = inputPath
    ? parseContentCalendar(await readFile(resolve(inputPath), "utf8"), inputPath)
    : buildSeedCalendarPayload();

  await importContentCalendar(payload);
  console.log(
    `Imported ${payload.posts.length} posts and ${payload.templates.length} templates.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
