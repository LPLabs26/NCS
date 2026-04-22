import { listAssets, listPosts } from "@/lib/data/posts";
import { isConfigured } from "@/lib/data/posts";
import { analyzePublicAssetUrl } from "@/lib/storage/urlSafety";
import { loadLocalEnvIfPresent, pluralize } from "@/scripts/_socialCli";

loadLocalEnvIfPresent();

const publishSensitiveStatuses = new Set([
  "approved",
  "scheduled",
  "publishing",
  "published",
]);

async function main() {
  if (!isConfigured()) {
    console.error(
      "Supabase service credentials are required before checking asset URLs. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.",
    );
    process.exit(1);
  }

  const [assets, posts] = await Promise.all([listAssets(), listPosts()]);
  const assetUsage = new Map<string, string[]>();

  for (const post of posts) {
    for (const assetId of post.asset_ids) {
      const list = assetUsage.get(assetId) ?? [];
      list.push(`${post.title} (${post.status})`);
      assetUsage.set(assetId, list);
    }
  }

  console.log("NCS Asset URL Check");
  console.log(`- Assets scanned: ${assets.length}`);

  let blockingAssets = 0;

  for (const asset of assets) {
    const issues = analyzePublicAssetUrl(asset.public_url).issues;
    const attachedToPublishablePosts = posts.filter(
      (post) =>
        post.asset_ids.includes(asset.id) && publishSensitiveStatuses.has(post.status),
    );

    if (
      attachedToPublishablePosts.length > 0 &&
      !asset.usage_rights_confirmed
    ) {
      issues.push("Usage rights are not confirmed for a publishable post attachment.");
    }

    if (issues.length === 0) {
      continue;
    }

    blockingAssets += 1;
    console.log(`- BLOCKER: ${asset.filename}`);
    issues.forEach((issue) => console.log(`  - ${issue}`));

    const usedBy = assetUsage.get(asset.id) ?? [];
    if (usedBy.length > 0) {
      console.log(`  - Used by: ${usedBy.join(", ")}`);
    }
  }

  if (blockingAssets === 0) {
    console.log("All stored assets look safe for Meta publishing checks.");
    return;
  }

  console.log(
    `${pluralize(blockingAssets, "asset")} currently block publishing until their public URLs or usage-rights confirmation are fixed.`,
  );
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
