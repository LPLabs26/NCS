import {
  buildMetaCaption,
  createCarouselContainer,
  createImageContainer,
  createReelContainer,
  createStoryContainer,
  createVideoCarouselItemContainer,
  getContainerStatus,
  getMediaFields,
  publishContainer,
} from "@/lib/meta/instagram";
import {
  getAssetsByIds,
  getDueApprovedPosts,
  getPostById,
  hasLivePublishedPosts,
  markPostFailed,
  markPostPublished,
  markPostPublishing,
  updatePostContainerId,
} from "@/lib/data/posts";
import { isDryRun } from "@/lib/env";
import { validateAssetsForPost } from "@/lib/storage/media";
import type { AssetRow, PostRow } from "@/types/database";

const STATUS_BACKOFF_MS = [5_000, 10_000, 20_000, 40_000, 60_000];

export interface PublishRunResult {
  postId: string;
  title: string;
  status: "published" | "dry_run" | "failed" | "skipped";
  message: string;
  mediaId?: string;
  permalink?: string | null;
}

export interface PublishDuePostsOptions {
  now?: Date;
  dryRun?: boolean;
  mode?: "cron" | "manual";
  postId?: string;
  logger?: Pick<Console, "info" | "warn" | "error">;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry<T>(
  label: string,
  operation: () => Promise<T>,
  logger: Pick<Console, "warn">,
  attempts = 3,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        logger.warn(`${label} failed on attempt ${attempt}. Retrying...`);
        await sleep(1_000 * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError;
}

async function pollUntilFinished(containerId: string) {
  let lastStatus = "IN_PROGRESS";

  for (const delayMs of STATUS_BACKOFF_MS) {
    const status = await getContainerStatus(containerId);
    lastStatus = status.status_code;

    if (status.status_code === "FINISHED" || status.status_code === "PUBLISHED") {
      return status;
    }

    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(
        `Container ${containerId} is not publishable. Meta returned ${status.status_code}.`,
      );
    }

    await sleep(delayMs);
  }

  throw new Error(
    `Container ${containerId} did not finish processing in time. Last status: ${lastStatus}.`,
  );
}

async function createPublishingContainer(post: PostRow, assets: AssetRow[]) {
  const caption = buildMetaCaption({
    caption: post.caption,
    cta: post.cta,
    hashtags: post.hashtags,
  });

  if (post.format === "image") {
    const asset = assets[0];
    return createImageContainer({
      imageUrl: asset.public_url,
      caption,
      altText: asset.alt_text,
    });
  }

  if (post.format === "reel") {
    const asset = assets[0];
    return createReelContainer({
      videoUrl: asset.public_url,
      caption,
      coverUrl: null,
      shareToFeed: true,
    });
  }

  if (post.format === "story") {
    const asset = assets[0];
    return createStoryContainer({
      imageUrl: asset.type === "image" ? asset.public_url : undefined,
      videoUrl: asset.type === "video" ? asset.public_url : undefined,
    });
  }

  const childIds: string[] = [];
  for (const asset of assets) {
    if (asset.type === "image") {
      const child = await createImageContainer({
        imageUrl: asset.public_url,
        altText: asset.alt_text,
        isCarouselItem: true,
      });
      childIds.push(child.id);
      continue;
    }

    const child = await createVideoCarouselItemContainer({
      videoUrl: asset.public_url,
    });
    await pollUntilFinished(child.id);
    childIds.push(child.id);
  }

  return createCarouselContainer({
    children: childIds,
    caption,
  });
}

async function publishApprovedPost(post: PostRow, assets: AssetRow[]) {
  const container = await createPublishingContainer(post, assets);
  await updatePostContainerId(post.id, container.id);
  await pollUntilFinished(container.id);
  const published = await publishContainer(container.id);
  const media = await getMediaFields(published.id);

  return {
    containerId: container.id,
    mediaId: published.id,
    permalink: media.permalink ?? null,
  };
}

function friendlyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown publishing error.";
}

export async function publishDuePosts(
  options: PublishDuePostsOptions = {},
): Promise<PublishRunResult[]> {
  const logger = options.logger ?? console;
  const dryRun = options.dryRun ?? isDryRun();
  const now = options.now ?? new Date();
  const mode = options.mode ?? "cron";
  const posts = options.postId
    ? [await getPostById(options.postId)].filter(Boolean) as PostRow[]
    : await getDueApprovedPosts(now);

  if (posts.length === 0) {
    return [];
  }

  if (!dryRun && mode === "cron" && !(await hasLivePublishedPosts())) {
    return posts.map((post) => ({
      postId: post.id,
      title: post.title,
      status: "skipped",
      message:
        "First live publish is gated. Use the manual publish button after the owner approves the first real post.",
    }));
  }

  const results: PublishRunResult[] = [];

  for (const post of posts) {
    const assets = await getAssetsByIds(post.asset_ids);
    const validationErrors = validateAssetsForPost(post, assets);

    if (validationErrors.length > 0) {
      const message = validationErrors.join(" ");
      await markPostFailed(post.id, message);
      results.push({
        postId: post.id,
        title: post.title,
        status: "failed",
        message,
      });
      continue;
    }

    if (dryRun) {
      logger.info(
        `[DRY_RUN] Would publish "${post.title}" as ${post.format} using assets: ${assets
          .map((asset) => asset.filename)
          .join(", ")}`,
      );
      results.push({
        postId: post.id,
        title: post.title,
        status: "dry_run",
        message: "Dry run enabled. No Instagram publish call was made.",
      });
      continue;
    }

    try {
      await markPostPublishing(post.id);
      const published = await retry(
        `Publishing post ${post.id}`,
        () => publishApprovedPost(post, assets),
        logger,
      );
      await markPostPublished(post.id, published);
      results.push({
        postId: post.id,
        title: post.title,
        status: "published",
        message: "Published successfully.",
        mediaId: published.mediaId,
        permalink: published.permalink,
      });
    } catch (error) {
      const message = friendlyError(error);
      logger.error(`Failed to publish ${post.id}: ${message}`);
      await markPostFailed(post.id, message);
      results.push({
        postId: post.id,
        title: post.title,
        status: "failed",
        message,
      });
    }
  }

  return results;
}
