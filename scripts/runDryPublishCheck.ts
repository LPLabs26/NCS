import { getAssetsByIds, getDuePostsForReview, hasLivePublishedPosts, isConfigured } from "@/lib/data/posts";
import { isDryRun, isLiveCronEnabled } from "@/lib/env";
import { smokeTestMetaConnection } from "@/lib/meta/instagram";
import { getPostPublishBlockers } from "@/lib/scheduler/validation";
import { pluralize } from "@/scripts/_socialCli";

function categorizeBlocker(message: string) {
  if (/asset|media|https|url|rights/i.test(message)) {
    return "asset";
  }
  if (/owner approval|approved|scheduled/i.test(message)) {
    return "approval";
  }
  if (/price/i.test(message)) {
    return "price";
  }
  if (/circadia|service confirmation|brand/i.test(message)) {
    return "circadia";
  }
  return "other";
}

async function main() {
  const allowCronCheck = process.argv.includes("--allow-cron-check");

  if (!isConfigured()) {
    console.error(
      "Supabase service credentials are required for a dry-run publish check. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.",
    );
    process.exit(1);
  }

  if (!isDryRun()) {
    console.error(
      "Refusing to run because DRY_RUN=false. Set DRY_RUN=true before using npm run social:dry-run.",
    );
    process.exit(1);
  }

  if (isLiveCronEnabled() && !allowCronCheck) {
    console.error(
      "Refusing to run while LIVE_CRON_ENABLED=true. Pass --allow-cron-check only if you intentionally want to audit dry-run behavior with cron enabled.",
    );
    process.exit(1);
  }

  const [duePosts, metaStatus, hasLivePosts] = await Promise.all([
    getDuePostsForReview(new Date()),
    smokeTestMetaConnection(),
    hasLivePublishedPosts(),
  ]);

  const reasonCounts = new Map<string, number>();
  const categoryCounts = {
    asset: 0,
    approval: 0,
    price: 0,
    circadia: 0,
    other: 0,
  };

  let eligibleCount = 0;
  let skippedCount = 0;

  console.log("NCS Social Scheduler Dry-Run Publish Check");
  console.log(`- Due posts found: ${duePosts.length}`);
  console.log(`- DRY_RUN: true`);
  console.log(`- LIVE_CRON_ENABLED: ${isLiveCronEnabled() ? "true" : "false"}`);
  console.log(`- Existing live published posts: ${hasLivePosts ? "yes" : "no"}`);

  if (!metaStatus.ok) {
    console.log("- Meta config issues:");
    for (const error of metaStatus.errors) {
      console.log(`  - ${error}`);
    }
  } else {
    console.log("- Meta config: PASS");
  }

  if (duePosts.length === 0) {
    console.log("DRY RUN COMPLETE — NO POSTS WERE PUBLISHED");
    return;
  }

  for (const post of duePosts) {
    const assets = await getAssetsByIds(post.asset_ids);
    const blockers = getPostPublishBlockers(post, assets);

    if (blockers.length === 0) {
      eligibleCount += 1;
      console.log(`- WOULD PASS: ${post.title}`);
      continue;
    }

    skippedCount += 1;
    console.log(`- SKIP: ${post.title}`);
    for (const blocker of blockers) {
      console.log(`  - ${blocker}`);
      reasonCounts.set(blocker, (reasonCounts.get(blocker) ?? 0) + 1);
      categoryCounts[categorizeBlocker(blocker)] += 1;
    }
  }

  console.log(`- Skipped: ${skippedCount}`);
  console.log(`- Eligible in dry run: ${eligibleCount}`);
  console.log(`- Asset issues: ${categoryCounts.asset}`);
  console.log(`- Approval issues: ${categoryCounts.approval}`);
  console.log(`- Price verification issues: ${categoryCounts.price}`);
  console.log(
    `- Circadia service/asset confirmation issues: ${categoryCounts.circadia}`,
  );
  console.log(`- Other issues: ${categoryCounts.other}`);

  if (reasonCounts.size > 0) {
    console.log("- Top skip reasons:");
    [...reasonCounts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .forEach(([reason, count]) => {
        console.log(`  - ${pluralize(count, "post")} blocked by: ${reason}`);
      });
  }

  console.log("DRY RUN COMPLETE — NO POSTS WERE PUBLISHED");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
