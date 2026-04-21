import assert from "node:assert/strict";
import test from "node:test";

import {
  canRoleSavePostInput,
  sanitizeImportedPayloadForRole,
} from "@/lib/postRoleSafety";
import type { PostInsert } from "@/types/database";

function buildPostInsert(overrides: Partial<PostInsert> = {}): PostInsert {
  return {
    title: "Role safety post",
    platform: "instagram",
    format: "image",
    pillar: "Proof and personality",
    status: "draft",
    caption: "Draft caption",
    hashtags: ["#NCSAesthetics"],
    cta: "Book consult.",
    scheduled_at: "2026-04-25T16:00:00.000Z",
    timezone: "America/Los_Angeles",
    asset_ids: [],
    owner_approved: false,
    requires_price_verification: false,
    price_verified: false,
    error: null,
    ...overrides,
  };
}

test("editor cannot owner-approve through save helper", () => {
  assert.equal(
    canRoleSavePostInput(
      "editor",
      buildPostInsert({
        owner_approved: true,
      }),
    ),
    false,
  );
});

test("editor cannot price-verify through save helper", () => {
  assert.equal(
    canRoleSavePostInput(
      "editor",
      buildPostInsert({
        price_verified: true,
      }),
    ),
    false,
  );
});

test("editor cannot save approved or scheduled publishable posts", () => {
  assert.equal(
    canRoleSavePostInput(
      "editor",
      buildPostInsert({
        status: "approved",
      }),
    ),
    false,
  );
  assert.equal(
    canRoleSavePostInput(
      "editor",
      buildPostInsert({
        status: "scheduled",
      }),
    ),
    false,
  );
});

test("editor imports are sanitized back to safe draft state", () => {
  const payload = sanitizeImportedPayloadForRole("editor", {
    posts: [
      buildPostInsert({
        status: "scheduled",
        owner_approved: true,
        price_verified: true,
      }),
    ],
    templates: [],
  });

  assert.equal(payload.sanitizedCount, 1);
  assert.equal(payload.posts[0].status, "draft");
  assert.equal(payload.posts[0].owner_approved, false);
  assert.equal(payload.posts[0].price_verified, false);
});

test("owner/admin can still approve and schedule posts", () => {
  const sensitivePost = buildPostInsert({
    status: "scheduled",
    owner_approved: true,
    price_verified: true,
  });

  assert.equal(canRoleSavePostInput("owner", sensitivePost), true);
  assert.equal(canRoleSavePostInput("admin", sensitivePost), true);
});
