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
  smokeTestMetaConnection,
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
import { getPostPublishBlockers } from "@/lib/scheduler/validation";
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

export interface PublishDependencies {
  getAssetsByIds: typeof getAssetsByIds;
  getDueApprovedPosts: typeof getDueApprovedPosts;
  getPostById: typeof getPostById;
  hasLivePublishedPosts: typeof hasLivePublishedPosts;
  markPostFailed: typeof markPostFailed;
  markPostPublished: typeof markPostPublished;
  markPostPublishing: typeof markPostPublishing;
  updatePostContainerId: typeof updatePostContainerId;
  smokeTestMetaConnection: typeof smokeTestMetaConnection;
  createImageContainer: typeof createImageContainer;
  createCarouselContainer: typeof createCarouselContainer;
  createReelContainer: typeof createReelContainer;
  createStoryContainer: typeof createStoryContainer;
  createVideoCarouselItemContainer: typeof createVideoCarouselItemContainer;
  getContainerStatus: typeof getContainerStatus;
  publishContainer: typeof publishContainer;
  getMediaFields: typeof getMediaFields;
}

export interface PublishDuePostsOptions {
  now?: Date;
  dryRun?: boolean;
  mode?: "cron" | "manual";
  postId?: string;
  logger?: Pick<Console, "info" | "warn" | "error">;
  firstLivePublishConfirmed?: boolean;
  dependencies?: PublishDependencies;
}

const defaultDependencies: PublishDependencies = {
  getAssetsByIds,
  getDueApprovedPosts,
  getPostById,
  hasLivePublishedPosts,
  markPostFailed,
  markPostPublished,
  markPostPublishing,
  updatePostContainerId,
  smokeTestMetaConnection,
  createImageContainer,
  createCarouselContainer,
  createReelContainer,
  createStoryContainer,
  createVideoCarouselItemContainer,
  getContainerStatus,
  publishContainer,
  getMediaFields,
};

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

function friendlyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown publishing error.";
}

async function pollUntilFinished(
  containerId: string,
  dependencies: PublishDependencies,
) {
  let lastStatus = "IN_PROGRESS";

  for (const delayMs of STATUS_BACKOFF_MS) {
    const status = await dependencies.getContainerStatus(containerId);
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

async function createPublishingContainer(
  post: PostRow,
  assets: AssetRow[],
  dependencies: PublishDependencies,
) {
  const caption = buildMetaCaption({
    caption: post.caption,
    cta: post.cta,
    hashtags: post.hashtags,
  });

  if (post.format === "image") {
    const asset = assets[0];
    return dependencies.createImageContainer({
      imageUrl: asset.public_url,
      caption,
      altText: asset.alt_text,
    });
  }

  if (post.format === "reel") {
    const asset = assets[0];
    return dependencies.createReelContainer({
      videoUrl: asset.public_url,
      caption,
      coverUrl: null,
      shareToFeed: true,
    });
  }

  if (post.format === "story") {
    const asset = assets[0];
    return dependencies.createStoryContainer({
      imageUrl: asset.type === "image" ? asset.public_url : undefined,
      videoUrl: asset.type === "video" ? asset.public_url : undefined,
    });
  }

  const childIds: string[] = [];
  for (const asset of assets) {
    if (asset.type === "image") {
      const child = await dependencies.createImageContainer({
        imageUrl: asset.public_url,
        altText: asset.alt_text,
        isCarouselItem: true,
      });
      childIds.push(child.id);
      continue;
    }

    const child = await dependencies.createVideoCarouselItemContainer({
      videoUrl: asset.public_url,
    });
    await pollUntilFinished(child.id, dependencies);
    childIds.push(child.id);
  }

  return dependencies.createCarouselContainer({
    children: childIds,
    caption,
  });
}

async function publishApprovedPost(
  post: PostRow,
  assets: AssetRow[],
  dependencies: PublishDependencies,
) {
  const container = await createPublishingContainer(post, assets, dependencies);
  await dependencies.updatePostContainerId(post.id, container.id);
  await pollUntilFinished(container.id, dependencies);
  const published = await dependencies.publishContainer(container.id);
  const media = await dependencies.getMediaFields(published.id);

  return {
    containerId: container.id,
    mediaId: published.id,
    permalink: media.permalink ?? null,
  };
}

export function createPublishDuePosts(dependencies = defaultDependencies) {
  return async function runPublishDuePosts(
    options: PublishDuePostsOptions = {},
  ): Promise<PublishRunResult[]> {
    const logger = options.logger ?? console;
    const dryRun = options.dryRun ?? isDryRun();
    const now = options.now ?? new Date();
    const mode = options.mode ?? "cron";
    const runtimeDependencies = options.dependencies ?? dependencies;
    const posts = options.postId
      ? ([await runtimeDependencies.getPostById(options.postId)].filter(Boolean) as PostRow[])
      : await runtimeDependencies.getDueApprovedPosts(now);

    if (posts.length === 0) {
      return [];
    }

    const livePublishingRequested = !dryRun;
    const hasLivePosts = await runtimeDependencies.hasLivePublishedPosts();

    if (livePublishingRequested && mode === "cron" && !hasLivePosts) {
      return posts.map((post) => ({
        postId: post.id,
        title: post.title,
        status: "skipped",
        message:
          "First live publish is gated. Use the manual publish button after the owner approves the first real post.",
      }));
    }

    if (
      livePublishingRequested &&
      mode === "manual" &&
      !hasLivePosts &&
      !options.firstLivePublishConfirmed
    ) {
      return posts.map((post) => ({
        postId: post.id,
        title: post.title,
        status: "skipped",
        message:
          "First live publish requires an explicit manual confirmation before anything can go out.",
      }));
    }

    if (livePublishingRequested) {
      const metaStatus = await runtimeDependencies.smokeTestMetaConnection();
      if (!metaStatus.ok) {
        const message = metaStatus.errors.join(" ");
        return posts.map((post) => ({
          postId: post.id,
          title: post.title,
          status: "skipped",
          message,
        }));
      }
    }

    const results: PublishRunResult[] = [];

    for (const post of posts) {
      const assets = await runtimeDependencies.getAssetsByIds(post.asset_ids);
      const validationErrors = getPostPublishBlockers(post, assets);

      if (validationErrors.length > 0) {
        results.push({
          postId: post.id,
          title: post.title,
          status: "skipped",
          message: validationErrors.join(" "),
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
        await runtimeDependencies.markPostPublishing(post.id);
        const published = await retry(
          `Publishing post ${post.id}`,
          () => publishApprovedPost(post, assets, runtimeDependencies),
          logger,
        );
        await runtimeDependencies.markPostPublished(post.id, published);
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
        await runtimeDependencies.markPostFailed(post.id, message);
        results.push({
          postId: post.id,
          title: post.title,
          status: "failed",
          message,
        });
      }
    }

    return results;
  };
}

export const publishDuePosts = createPublishDuePosts();
