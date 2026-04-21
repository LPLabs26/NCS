import { validateAssetsForPost } from "@/lib/storage/media";
import type { AssetRow, PostRow } from "@/types/database";

const blockedCaptionPhrases = [
  "cures acne",
  "guaranteed",
  "permanent",
  "medical treatment",
  "fixes",
  "removes all",
  "pain-free guaranteed",
] as const;

const consentReminderPatterns = [
  { pattern: /before\s*\/?\s*after/i, message: "Before-and-after content requires explicit written client consent." },
  { pattern: /\breview\b|\btestimonial\b/i, message: "Identifiable client reviews require permission before reposting." },
  { pattern: /\bbrazilian\b|\bintimate\b|\bbikini\b/i, message: "Keep intimate waxing references consent-safe and avoid revealing details." },
] as const;

const circadiaServicePatterns = [
  /\bswitch\b/i,
  /\boxygen\s*rx\b/i,
  /\bmandeliclear\b/i,
  /\bdermafrost\b/i,
  /\bcalming facial\b/i,
] as const;

const publicPricingPattern =
  /(?:\$+\s*\d+(?:\.\d{2})?|\b\d+(?:\.\d{2})?\s*(?:usd|dollars?)\b)/i;

function isCircadiaSpecific(post: Pick<PostRow, "title" | "caption" | "pillar">): boolean {
  const content = `${post.title ?? ""}\n${post.caption ?? ""}\n${post.pillar ?? ""}`;
  return /\bcircadia\b/i.test(content);
}

function hasCircadiaServiceReference(post: Pick<PostRow, "title" | "caption">): boolean {
  const content = `${post.title ?? ""}\n${post.caption ?? ""}`;
  return circadiaServicePatterns.some((pattern) => pattern.test(content));
}

function hasPublicCircadiaPricing(caption: string | null | undefined): boolean {
  return publicPricingPattern.test(`${caption ?? ""}`);
}

export function getCaptionComplianceErrors(caption: string | null | undefined): string[] {
  const content = `${caption ?? ""}`.toLowerCase();
  return blockedCaptionPhrases
    .filter((phrase) => content.includes(phrase))
    .map((phrase) => `Caption contains blocked compliance language: "${phrase}".`);
}

export function getConsentWarnings(
  title: string | null | undefined,
  caption: string | null | undefined,
): string[] {
  const content = `${title ?? ""}\n${caption ?? ""}`;
  return consentReminderPatterns
    .filter(({ pattern }) => pattern.test(content))
    .map(({ message }) => message);
}

export function getPostWarnings(post: PostRow, assets: AssetRow[]): string[] {
  const warnings: string[] = [];

  if (post.asset_ids.length === 0) {
    warnings.push("Post is missing required media.");
  }
  if (!post.owner_approved) {
    warnings.push("Post is not owner-approved yet.");
  }
  if (post.requires_price_verification && !post.price_verified) {
    warnings.push("Price verification is still required before this post can publish.");
  }
  if (post.requires_owner_service_confirmation && !post.owner_service_confirmed) {
    warnings.push("Owner service confirmation is still required before this post can publish.");
  }
  if (post.requires_brand_asset_rights && post.asset_ids.length === 0) {
    warnings.push("Circadia brand assets require approved rights-confirmed media before publishing.");
  }
  if (
    post.requires_brand_asset_rights &&
    assets.some((asset) => !asset.usage_rights_confirmed)
  ) {
    warnings.push("Circadia brand assets need confirmed usage rights before publishing.");
  }
  if (assets.some((asset) => !asset.usage_rights_confirmed)) {
    warnings.push("One or more assets are missing usage-rights confirmation.");
  }
  if (assets.some((asset) => !asset.public_url || !asset.public_url.startsWith("https://"))) {
    warnings.push("One or more assets do not have a public HTTPS URL.");
  }
  if (hasCircadiaServiceReference(post) && !post.owner_service_confirmed) {
    warnings.push("Specific Circadia services need owner confirmation before they can be promoted.");
  }
  if (
    (post.hide_public_product_pricing || isCircadiaSpecific(post)) &&
    hasPublicCircadiaPricing(post.caption)
  ) {
    warnings.push("Do not show public Circadia retail pricing in captions.");
  }

  return [
    ...warnings,
    ...getCaptionComplianceErrors(post.caption),
    ...getConsentWarnings(post.title, post.caption),
  ];
}

export function getPostPublishBlockers(post: PostRow, assets: AssetRow[]): string[] {
  const blockers: string[] = [];

  if (!["approved", "scheduled"].includes(post.status)) {
    blockers.push("Only approved or scheduled posts can be published.");
  }
  if (!post.owner_approved) {
    blockers.push("Owner approval is required before publishing.");
  }
  if (post.requires_price_verification && !post.price_verified) {
    blockers.push("Price verification is still required before publishing.");
  }
  if (post.requires_owner_service_confirmation && !post.owner_service_confirmed) {
    blockers.push("Owner service confirmation is required before publishing this post.");
  }
  if (hasCircadiaServiceReference(post) && !post.owner_service_confirmed) {
    blockers.push(
      "Specific Circadia services require owner confirmation before they can be promoted.",
    );
  }
  if (
    (post.hide_public_product_pricing || isCircadiaSpecific(post)) &&
    hasPublicCircadiaPricing(post.caption)
  ) {
    blockers.push("Do not publish public Circadia retail pricing.");
  }

  blockers.push(...getCaptionComplianceErrors(post.caption));
  blockers.push(...validateAssetsForPost(post, assets));

  return blockers;
}
