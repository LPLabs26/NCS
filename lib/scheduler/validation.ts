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
  if (assets.some((asset) => !asset.usage_rights_confirmed)) {
    warnings.push("One or more assets are missing usage-rights confirmation.");
  }
  if (assets.some((asset) => !asset.public_url || !asset.public_url.startsWith("https://"))) {
    warnings.push("One or more assets do not have a public HTTPS URL.");
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

  blockers.push(...getCaptionComplianceErrors(post.caption));
  blockers.push(...validateAssetsForPost(post, assets));

  return blockers;
}
