import { parse } from "csv-parse/sync";

import { appTimezone } from "@/lib/env";
import { buildSeedPosts, seedTemplates } from "@/lib/content/seed";
import { applyOwnerSafeDefaultsToPayload } from "@/lib/content/safety";
import type { ContentTemplateInsert, PostInsert } from "@/types/database";

export interface ParsedContentCalendar {
  posts: PostInsert[];
  templates: ContentTemplateInsert[];
}

type LooseRecord = Record<string, unknown>;

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) {
    return fallback;
  }

  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeHashtags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAssetIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  return String(value ?? "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPostInsert(record: LooseRecord): PostInsert {
  return {
    title: String(record.title ?? "Untitled Post"),
    platform: String(record.platform ?? "instagram"),
    format: String(record.format ?? "image") as PostInsert["format"],
    pillar: record.pillar ? String(record.pillar) : null,
    status: (record.status ? String(record.status) : "draft") as PostInsert["status"],
    caption: record.caption ? String(record.caption) : null,
    hashtags: normalizeHashtags(record.hashtags),
    cta: record.cta ? String(record.cta) : null,
    scheduled_at: record.scheduled_at ? String(record.scheduled_at) : null,
    timezone: String(record.timezone ?? appTimezone()),
    asset_ids: normalizeAssetIds(record.asset_ids),
    owner_approved: normalizeBoolean(record.owner_approved, false),
    requires_price_verification: normalizeBoolean(
      record.requires_price_verification,
      false,
    ),
    price_verified: normalizeBoolean(record.price_verified, false),
    requires_owner_service_confirmation: normalizeBoolean(
      record.requires_owner_service_confirmation,
      false,
    ),
    owner_service_confirmed: normalizeBoolean(record.owner_service_confirmed, false),
    requires_brand_asset_rights: normalizeBoolean(record.requires_brand_asset_rights, false),
    hide_public_product_pricing: normalizeBoolean(record.hide_public_product_pricing, false),
    error: null,
  };
}

function toTemplateInsert(record: LooseRecord): ContentTemplateInsert {
  return {
    service: String(record.service ?? "General"),
    pillar: String(record.pillar ?? "education"),
    hook: String(record.hook ?? ""),
    caption_template: String(record.caption_template ?? ""),
    cta: record.cta ? String(record.cta) : null,
    hashtags: normalizeHashtags(record.hashtags),
  };
}

export function buildSeedCalendarPayload(baseDate = new Date()): ParsedContentCalendar {
  return applyOwnerSafeDefaultsToPayload({
    posts: buildSeedPosts(baseDate),
    templates: seedTemplates,
  });
}

export function parseContentCalendar(
  source: string,
  filename = "calendar.json",
): ParsedContentCalendar {
  if (filename.endsWith(".csv")) {
    const rows = parse(source, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as LooseRecord[];

    return {
      posts: rows.map(toPostInsert),
      templates: [],
    };
  }

  const parsed = JSON.parse(source) as LooseRecord[] | ParsedContentCalendar | LooseRecord;

  if (Array.isArray(parsed)) {
    return {
      posts: parsed.map(toPostInsert),
      templates: [],
    };
  }

  if ("posts" in parsed || "templates" in parsed) {
    const posts = Array.isArray(parsed.posts)
      ? (parsed.posts as LooseRecord[]).map(toPostInsert)
      : [];
    const templates = Array.isArray(parsed.templates)
      ? (parsed.templates as LooseRecord[]).map(toTemplateInsert)
      : [];

    return { posts, templates };
  }

  return {
    posts: [toPostInsert(parsed)],
    templates: [],
  };
}
