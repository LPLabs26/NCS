import type { ContentTemplateInsert, PostInsert } from "@/types/database";
import {
  hasCircadiaServiceReference,
  looksLikeCircadiaProductEducation,
  looksLikePackagePricePost,
} from "@/lib/content/compliance";

export const rolloutPillarOrder = [
  "Hydrafacial authority",
  "Fresno skin education",
  "Waxing comfort and prep",
  "Lashes and brows",
  "Proof and personality",
  "Offers and availability",
  "Circadia Pro Skin Systems",
] as const;

export function applyOwnerSafeDefaultsToPost(post: PostInsert): PostInsert {
  const requiresPriceVerification =
    post.requires_price_verification ?? looksLikePackagePricePost(post);
  const requiresOwnerServiceConfirmation =
    post.requires_owner_service_confirmation ?? hasCircadiaServiceReference(post);
  const requiresBrandAssetRights =
    post.requires_brand_asset_rights ?? looksLikeCircadiaProductEducation(post);
  const hidePublicProductPricing =
    post.hide_public_product_pricing ?? looksLikeCircadiaProductEducation(post);

  return {
    ...post,
    status: "draft",
    owner_approved: false,
    requires_price_verification: requiresPriceVerification,
    price_verified: false,
    requires_owner_service_confirmation: requiresOwnerServiceConfirmation,
    owner_service_confirmed: false,
    requires_brand_asset_rights: requiresBrandAssetRights,
    hide_public_product_pricing: hidePublicProductPricing,
  };
}

export function applyOwnerSafeDefaultsToPayload(payload: {
  posts: PostInsert[];
  templates?: ContentTemplateInsert[];
}) {
  return {
    posts: payload.posts.map((post) => applyOwnerSafeDefaultsToPost(post)),
    templates: payload.templates ?? [],
  };
}

export function summarizePostsByPillar(posts: Array<Pick<PostInsert, "pillar">>) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const pillar = post.pillar ?? "Unassigned";
    counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
  }

  const ordered = rolloutPillarOrder
    .map((pillar) => ({
      pillar,
      count: counts.get(pillar) ?? 0,
    }))
    .filter((item) => item.count > 0);

  const extras = [...counts.entries()]
    .filter(([pillar]) => !rolloutPillarOrder.includes(pillar as (typeof rolloutPillarOrder)[number]))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([pillar, count]) => ({
      pillar,
      count,
    }));

  return [...ordered, ...extras];
}
