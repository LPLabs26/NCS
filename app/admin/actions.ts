"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSchedulerPermission } from "@/lib/auth";
import { importContentCalendar } from "@/lib/data/posts";
import { buildSeedCalendarPayload, parseContentCalendar } from "@/lib/content/import";
import { isDryRun, hasSupabaseBrowserEnv } from "@/lib/env";
import { duplicatePost, getPostById, savePost } from "@/lib/data/posts";
import {
  isPublishSensitivePostInput,
  sanitizeImportedPayloadForRole,
} from "@/lib/postRoleSafety";
import { fromLocalDateTimeInput, parseList } from "@/lib/utils";
import { publishDuePosts } from "@/lib/scheduler/publishDuePosts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostStatus } from "@/types/database";

function normalizeEditableStatus(
  value: string,
  scheduledAt: string | null,
  ownerApproved: boolean,
): PostStatus {
  if (value === "needs_asset") {
    return "needs_asset";
  }

  if (value === "approved") {
    if (scheduledAt && ownerApproved) {
      return "scheduled";
    }
    return "approved";
  }

  if (value === "scheduled") {
    return scheduledAt && ownerApproved ? "scheduled" : "approved";
  }

  return "draft";
}

export async function savePostAction(formData: FormData) {
  await requireSchedulerPermission("edit");

  const id = String(formData.get("id") ?? "");
  const timezone = String(formData.get("timezone") ?? "America/Los_Angeles");
  const scheduledAt = fromLocalDateTimeInput(
    String(formData.get("scheduled_at") ?? ""),
    timezone,
  );
  const ownerApproved = formData.get("owner_approved") === "true";
  const requiresPriceVerification = formData.get("requires_price_verification") === "true";
  const priceVerified = formData.get("price_verified") === "true";
  const requiresOwnerServiceConfirmation =
    formData.get("requires_owner_service_confirmation") === "true";
  const ownerServiceConfirmed = formData.get("owner_service_confirmed") === "true";
  const requiresBrandAssetRights = formData.get("requires_brand_asset_rights") === "true";
  const hidePublicProductPricing =
    formData.get("hide_public_product_pricing") === "true";
  const requestedStatus = normalizeEditableStatus(
    String(formData.get("status") ?? "draft"),
    scheduledAt,
    ownerApproved,
  );

  if (
    isPublishSensitivePostInput({
      status: requestedStatus,
      owner_approved: ownerApproved,
      price_verified: priceVerified,
      owner_service_confirmed: ownerServiceConfirmed,
    })
  ) {
    await requireSchedulerPermission("publish");
  }

  const post = await savePost({
    id: id && id !== "new" ? id : undefined,
    title: String(formData.get("title") ?? "Untitled Post"),
    platform: "instagram",
    format: String(formData.get("format") ?? "image") as "image" | "reel" | "carousel" | "story",
    pillar: String(formData.get("pillar") ?? "") || null,
    status: requestedStatus,
    caption: String(formData.get("caption") ?? "") || null,
    hashtags: parseList(String(formData.get("hashtags") ?? "")),
    cta: String(formData.get("cta") ?? "") || null,
    scheduled_at: scheduledAt,
    timezone,
    asset_ids: formData.getAll("asset_ids").map(String),
    owner_approved: ownerApproved,
    requires_price_verification: requiresPriceVerification,
    price_verified: requiresPriceVerification ? priceVerified : false,
    requires_owner_service_confirmation: requiresOwnerServiceConfirmation,
    owner_service_confirmed: ownerServiceConfirmed,
    requires_brand_asset_rights: requiresBrandAssetRights,
    hide_public_product_pricing: hidePublicProductPricing,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect(`/admin/posts/${post.id}?saved=1`);
}

export async function duplicatePostAction(formData: FormData) {
  await requireSchedulerPermission("edit");
  const id = String(formData.get("id") ?? "");
  const duplicated = await duplicatePost(id);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect(`/admin/posts/${duplicated.id}?duplicated=1`);
}

export async function publishNowAction(formData: FormData) {
  await requireSchedulerPermission("publish");
  const id = String(formData.get("id") ?? "");
  const post = await getPostById(id);

  if (!post) {
    redirect("/admin/posts?error=missing-post");
  }

  const [result] = await publishDuePosts({
    postId: id,
    mode: "manual",
    dryRun: isDryRun(),
    firstLivePublishConfirmed: formData.get("confirm_first_live_publish") === "true",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  const params = new URLSearchParams({
    publish: result?.status ?? "skipped",
  });
  if (result?.message) {
    params.set("publish_message", result.message);
  }
  redirect(`/admin/posts/${id}?${params.toString()}`);
}

export async function seedCalendarAction() {
  await requireSchedulerPermission("edit");
  await importContentCalendar(buildSeedCalendarPayload());
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect("/admin/import?seeded=1");
}

export async function importRawCalendarAction(formData: FormData) {
  const access = await requireSchedulerPermission("edit");
  const raw = String(formData.get("raw") ?? "");
  const filename = String(formData.get("filename") ?? "calendar.json");
  const payload = sanitizeImportedPayloadForRole(
    access.role,
    parseContentCalendar(raw, filename),
  );
  await importContentCalendar({
    posts: payload.posts,
    templates: payload.templates,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  const params = new URLSearchParams({
    imported: "1",
  });
  if (payload.sanitizedCount > 0) {
    params.set("sanitized", String(payload.sanitizedCount));
  }
  redirect(`/admin/import?${params.toString()}`);
}

export async function signOutAction() {
  if (!hasSupabaseBrowserEnv()) {
    redirect("/admin");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
