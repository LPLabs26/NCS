import type { PostInsert, PostRow } from "@/types/database";

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
  {
    pattern: /before\s*\/?\s*after/i,
    message: "Before-and-after content requires explicit written client consent.",
  },
  {
    pattern: /\breview\b|\btestimonial\b/i,
    message: "Identifiable client reviews require permission before reposting.",
  },
  {
    pattern: /\bbrazilian\b|\bintimate\b|\bbikini\b/i,
    message:
      "Keep intimate waxing references consent-safe and avoid revealing details.",
  },
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

const packagePostPattern = /\bpackage\b|\bb3g1\b|\bbuy\s*3\s*get\s*1\b/i;
const circadiaBrandProductPattern =
  /\bcircadia\b[\s\S]{0,80}\b(product|products|homecare|retail|routine|serum|cleanser|cream)\b|\b(product|products|homecare|retail|routine|serum|cleanser|cream)\b[\s\S]{0,80}\bcircadia\b/i;

type PostLike = Pick<PostInsert, "title" | "caption" | "pillar" | "cta">;

function buildContent(post: PostLike): string {
  return `${post.title ?? ""}\n${post.caption ?? ""}\n${post.pillar ?? ""}\n${post.cta ?? ""}`;
}

export function isCircadiaSpecific(post: Pick<PostLike, "title" | "caption" | "pillar">): boolean {
  return /\bcircadia\b/i.test(buildContent(post));
}

export function hasCircadiaServiceReference(
  post: Pick<PostLike, "title" | "caption">,
): boolean {
  const content = buildContent({ ...post, pillar: null, cta: null });
  return circadiaServicePatterns.some((pattern) => pattern.test(content));
}

export function hasPublicPricing(text: string | null | undefined): boolean {
  return publicPricingPattern.test(`${text ?? ""}`);
}

export function looksLikePackagePricePost(post: PostLike): boolean {
  return packagePostPattern.test(buildContent(post));
}

export function looksLikeCircadiaProductEducation(post: PostLike): boolean {
  return circadiaBrandProductPattern.test(buildContent(post));
}

export function getCaptionComplianceErrors(
  caption: string | null | undefined,
): string[] {
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

export function isCircadiaPostWithPublicPricing(
  post: Pick<PostRow, "title" | "caption" | "pillar" | "hide_public_product_pricing">,
): boolean {
  return Boolean(
    (post.hide_public_product_pricing || isCircadiaSpecific(post)) &&
      hasPublicPricing(post.caption),
  );
}
