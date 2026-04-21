import assert from "node:assert/strict";
import test from "node:test";

import {
  createPublishDuePosts,
  type PublishDependencies,
} from "@/lib/scheduler/publishDuePosts";
import type { AssetRow, PostRow } from "@/types/database";

function buildPost(overrides: Partial<PostRow> = {}): PostRow {
  return {
    id: "post-1",
    title: "Hydrafacial Reel",
    platform: "instagram",
    format: "image",
    pillar: "Hydrafacial authority",
    status: "approved",
    caption: "Designed to support glow and hydration. Results vary.",
    hashtags: ["#FresnoHydrafacial"],
    cta: "Book Hydrafacial.",
    scheduled_at: "2026-04-20T16:00:00.000Z",
    timezone: "America/Los_Angeles",
    asset_ids: ["asset-1"],
    meta_container_id: null,
    meta_media_id: null,
    permalink: null,
    error: null,
    owner_approved: true,
    price_verified: false,
    requires_price_verification: false,
    created_at: "2026-04-20T00:00:00.000Z",
    updated_at: "2026-04-20T00:00:00.000Z",
    ...overrides,
  };
}

function buildAsset(overrides: Partial<AssetRow> = {}): AssetRow {
  return {
    id: "asset-1",
    filename: "hydrafacial.jpg",
    type: "image",
    storage_url: "s3://bucket/hydrafacial.jpg",
    public_url: "https://assets.example.com/hydrafacial.jpg",
    aspect_ratio: "1:1",
    duration_sec: null,
    width: 1080,
    height: 1080,
    file_size_bytes: 1_000_000,
    alt_text: "Hydrafacial treatment room",
    checksum: "abc123",
    usage_rights_confirmed: true,
    created_at: "2026-04-20T00:00:00.000Z",
    ...overrides,
  };
}

function createDeps(post: PostRow, assets: AssetRow[] = []) {
  const calls = {
    createImageContainer: 0,
    publishContainer: 0,
    smokeTestMetaConnection: 0,
    markPostFailed: 0,
  };

  const deps: PublishDependencies = {
    getAssetsByIds: async () => assets,
    getDueApprovedPosts: async () => [post],
    getPostById: async () => post,
    hasLivePublishedPosts: async () => false,
    markPostFailed: async () => {
      calls.markPostFailed += 1;
    },
    markPostPublished: async () => undefined,
    markPostPublishing: async () => undefined,
    updatePostContainerId: async () => undefined,
    smokeTestMetaConnection: async () => {
      calls.smokeTestMetaConnection += 1;
      return {
        configured: true,
        ok: true,
        accountId: "17890000000000000",
        username: "ncs.aesthetics",
        details: [],
        errors: [],
      };
    },
    createImageContainer: async () => {
      calls.createImageContainer += 1;
      return { id: "container-1" };
    },
    createCarouselContainer: async () => ({ id: "container-1" }),
    createReelContainer: async () => ({ id: "container-1" }),
    createStoryContainer: async () => ({ id: "container-1" }),
    createVideoCarouselItemContainer: async () => ({ id: "container-1" }),
    getContainerStatus: async () => ({ status_code: "FINISHED" }),
    publishContainer: async () => {
      calls.publishContainer += 1;
      return { id: "media-1" };
    },
    getMediaFields: async () => ({
      id: "media-1",
      permalink: "https://instagram.com/p/media-1",
    }),
  };

  return {
    calls,
    run: createPublishDuePosts(deps),
  };
}

test("publishDuePosts skips non-approved posts", async () => {
  const post = buildPost({ status: "draft" });
  const { run } = createDeps(post, [buildAsset()]);

  const [result] = await run({
    postId: post.id,
    mode: "manual",
    dryRun: true,
  });

  assert.equal(result.status, "skipped");
  assert.match(result.message, /Only approved or scheduled posts can be published/);
});

test("publishDuePosts skips posts missing assets", async () => {
  const post = buildPost({ asset_ids: [] });
  const { run } = createDeps(post, []);

  const [result] = await run({
    postId: post.id,
    mode: "manual",
    dryRun: true,
  });

  assert.equal(result.status, "skipped");
  assert.match(result.message, /Post is missing required media/);
});

test("publishDuePosts skips posts without owner approval", async () => {
  const post = buildPost({ owner_approved: false });
  const { run } = createDeps(post, [buildAsset()]);

  const [result] = await run({
    postId: post.id,
    mode: "manual",
    dryRun: true,
  });

  assert.equal(result.status, "skipped");
  assert.match(result.message, /Owner approval is required/);
});

test("publishDuePosts skips assets without usage rights confirmation", async () => {
  const post = buildPost();
  const { run } = createDeps(post, [buildAsset({ usage_rights_confirmed: false })]);

  const [result] = await run({
    postId: post.id,
    mode: "manual",
    dryRun: true,
  });

  assert.equal(result.status, "skipped");
  assert.match(result.message, /Usage rights are not confirmed/i);
});

test("publishDuePosts skips price-sensitive posts until price is verified", async () => {
  const post = buildPost({
    requires_price_verification: true,
    price_verified: false,
  });
  const { run } = createDeps(post, [buildAsset()]);

  const [result] = await run({
    postId: post.id,
    mode: "manual",
    dryRun: true,
  });

  assert.equal(result.status, "skipped");
  assert.match(result.message, /Price verification is still required/);
});

test("DRY_RUN validates but does not call Meta publish endpoints", async () => {
  const post = buildPost();
  const { run, calls } = createDeps(post, [buildAsset()]);

  const [result] = await run({
    postId: post.id,
    mode: "manual",
    dryRun: true,
  });

  assert.equal(result.status, "dry_run");
  assert.equal(calls.smokeTestMetaConnection, 0);
  assert.equal(calls.createImageContainer, 0);
  assert.equal(calls.publishContainer, 0);
  assert.equal(calls.markPostFailed, 0);
});
