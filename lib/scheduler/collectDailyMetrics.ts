import { getMediaInsights } from "@/lib/meta/instagram";
import { insertMetricRow, listPublishedPostsForMetrics } from "@/lib/data/posts";

export async function collectDailyMetrics(limit = 100) {
  const posts = await listPublishedPostsForMetrics(limit);
  const results: Array<{ postId: string; status: "collected" | "skipped"; message: string }> = [];

  for (const post of posts) {
    if (!post.meta_media_id) {
      results.push({
        postId: post.id,
        status: "skipped",
        message: "No Meta media id present.",
      });
      continue;
    }

    try {
      const insights = await getMediaInsights(post.meta_media_id);
      await insertMetricRow({
        post_id: post.id,
        collected_at: new Date().toISOString(),
        reach: insights.reach,
        impressions: insights.impressions,
        views: insights.views,
        likes: insights.likes,
        comments: insights.comments,
        saves: insights.saves,
        shares: insights.shares,
        profile_visits: insights.profile_visits,
        website_taps: insights.website_taps,
      });
      results.push({
        postId: post.id,
        status: "collected",
        message: "Metrics saved.",
      });
    } catch (error) {
      results.push({
        postId: post.id,
        status: "skipped",
        message: error instanceof Error ? error.message : "Unknown metrics error.",
      });
    }
  }

  return results;
}
