import assert from "node:assert/strict";
import test from "node:test";

import { roleCan } from "@/lib/access";
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
    requires_owner_service_confirmation: false,
    owner_service_confirmed: false,
    requires_brand_asset_rights: false,
    hide_public_product_pricing: false,
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

test("viewer cannot edit drafts", () => {
  assert.equal(roleCan("viewer", "edit"), false);
  assert.equal(canRoleSavePostInput("viewer", buildPostInsert()), false);
});

test("editor can create and edit drafts", () => {
  assert.equal(roleCan("editor", "edit"), true);
  assert.equal(canRoleSavePostInput("editor", buildPostInsert()), true);
  assert.equal(
    canRoleSavePostInput(
      "editor",
      buildPostInsert({
        status: "needs_asset",
      }),
    ),
    true,
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

test("editor cannot service-confirm Circadia promotions through save helper", () => {
  assert.equal(
    canRoleSavePostInput(
      "editor",
      buildPostInsert({
        owner_service_confirmed: true,
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

test("editor cannot publish", () => {
  assert.equal(roleCan("editor", "publish"), false);
});

test("editor imports are sanitized back to safe draft state", () => {
  const payload = sanitizeImportedPayloadForRole("editor", {
    posts: [
      buildPostInsert({
        status: "scheduled",
        owner_approved: true,
        price_verified: true,
        owner_service_confirmed: true,
      }),
    ],
    templates: [],
  });

  assert.equal(payload.sanitizedCount, 1);
  assert.equal(payload.posts[0].status, "draft");
  assert.equal(payload.posts[0].owner_approved, false);
  assert.equal(payload.posts[0].price_verified, false);
  assert.equal(payload.posts[0].owner_service_confirmed, false);
});

test("owner/admin can still approve and schedule posts", () => {
  const sensitivePost = buildPostInsert({
    status: "scheduled",
    owner_approved: true,
    price_verified: true,
    owner_service_confirmed: true,
  });

  assert.equal(canRoleSavePostInput("owner", sensitivePost), true);
  assert.equal(canRoleSavePostInput("admin", sensitivePost), true);
  assert.equal(roleCan("owner", "publish"), true);
  assert.equal(roleCan("admin", "publish"), true);
});
