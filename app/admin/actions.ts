"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/auth";
import { importContentCalendar } from "@/lib/data/posts";
import { buildSeedCalendarPayload, parseContentCalendar } from "@/lib/content/import";
import { isDryRun, hasSupabaseBrowserEnv } from "@/lib/env";
import { duplicatePost, getPostById, savePost } from "@/lib/data/posts";
import { fromLocalDateTimeInput, parseList } from "@/lib/utils";
import { publishDuePosts } from "@/lib/scheduler/publishDuePosts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostStatus } from "@/types/database";

function normalizeEditableStatus(value: string): PostStatus {
  if (value === "approved") {
    return "approved";
  }
  if (value === "needs_asset") {
    return "needs_asset";
  }
  return "draft";
}

export async function savePostAction(formData: FormData) {
  await requireAuthenticatedUser();

  const id = String(formData.get("id") ?? "");
  const timezone = String(formData.get("timezone") ?? "America/Los_Angeles");
  const post = await savePost({
    id: id && id !== "new" ? id : undefined,
    title: String(formData.get("title") ?? "Untitled Post"),
    platform: "instagram",
    format: String(formData.get("format") ?? "image") as "image" | "reel" | "carousel" | "story",
    pillar: String(formData.get("pillar") ?? "") || null,
    status: normalizeEditableStatus(String(formData.get("status") ?? "draft")),
    caption: String(formData.get("caption") ?? "") || null,
    hashtags: parseList(String(formData.get("hashtags") ?? "")),
    cta: String(formData.get("cta") ?? "") || null,
    scheduled_at: fromLocalDateTimeInput(
      String(formData.get("scheduled_at") ?? ""),
      timezone,
    ),
    timezone,
    asset_ids: formData.getAll("asset_ids").map(String),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect(`/admin/posts/${post.id}?saved=1`);
}

export async function duplicatePostAction(formData: FormData) {
  await requireAuthenticatedUser();
  const id = String(formData.get("id") ?? "");
  const duplicated = await duplicatePost(id);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect(`/admin/posts/${duplicated.id}?duplicated=1`);
}

export async function publishNowAction(formData: FormData) {
  await requireAuthenticatedUser();
  const id = String(formData.get("id") ?? "");
  const post = await getPostById(id);

  if (!post) {
    redirect("/admin/posts?error=missing-post");
  }

  const [result] = await publishDuePosts({
    postId: id,
    mode: "manual",
    dryRun: isDryRun(),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect(`/admin/posts/${id}?publish=${result?.status ?? "skipped"}`);
}

export async function seedCalendarAction() {
  await requireAuthenticatedUser();
  await importContentCalendar(buildSeedCalendarPayload());
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect("/admin/import?seeded=1");
}

export async function importRawCalendarAction(formData: FormData) {
  await requireAuthenticatedUser();
  const raw = String(formData.get("raw") ?? "");
  const filename = String(formData.get("filename") ?? "calendar.json");
  await importContentCalendar(parseContentCalendar(raw, filename));
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/calendar");
  redirect("/admin/import?imported=1");
}

export async function signOutAction() {
  if (!hasSupabaseBrowserEnv()) {
    redirect("/admin");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
