import { addDays, endOfMonth, startOfMonth } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";

import { appTimezone, hasSupabaseServiceEnv } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/service";
import { getDisplayStatus } from "@/lib/utils";
import type {
  AssetInsert,
  AssetRow,
  ContentTemplateInsert,
  Database,
  MetricInsert,
  PostInsert,
  PostFormat,
  PostRow,
  PostStatus,
} from "@/types/database";

export interface PostListFilters {
  status?: string;
  format?: string;
  pillar?: string;
  search?: string;
}

function service(): SupabaseClient<Database> {
  if (!hasSupabaseServiceEnv()) {
    throw new Error(
      "Supabase database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return getServiceSupabase();
}

function handleError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

export function isConfigured(): boolean {
  return hasSupabaseServiceEnv();
}

export async function listPosts(filters: PostListFilters = {}): Promise<PostRow[]> {
  let query = service()
    .from("posts")
    .select("*")
    .order("scheduled_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    if (filters.status === "scheduled") {
      query = query
        .in("status", ["approved", "scheduled"])
        .gt("scheduled_at", new Date().toISOString());
    } else {
      query = query.eq("status", filters.status as PostStatus);
    }
  }

  if (filters.format && filters.format !== "all") {
    query = query.eq("format", filters.format as PostFormat);
  }

  if (filters.pillar && filters.pillar !== "all") {
    query = query.eq("pillar", filters.pillar);
  }

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;
  handleError(error);
  return data ?? [];
}

export async function getDistinctPillars(): Promise<string[]> {
  const { data, error } = await service().from("posts").select("pillar");
  handleError(error);

  return [...new Set((data ?? []).map((row) => row.pillar).filter(Boolean) as string[])].sort();
}

export async function getPostById(id: string): Promise<PostRow | null> {
  const { data, error } = await service()
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  handleError(error);
  return data;
}

export async function listAssets(): Promise<AssetRow[]> {
  const { data, error } = await service()
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });
  handleError(error);
  return data ?? [];
}

export async function createAssetRecord(input: AssetInsert): Promise<AssetRow> {
  const { data, error } = await service().from("assets").insert(input).select("*").single();
  handleError(error);
  if (!data) {
    throw new Error("Asset insert returned no row.");
  }
  return data;
}

export async function savePost(input: PostInsert & { id?: string }): Promise<PostRow> {
  if (input.id) {
    const { data, error } = await service()
      .from("posts")
      .update(input)
      .eq("id", input.id)
      .select("*")
      .single();
    handleError(error);
    if (!data) {
      throw new Error("Post update returned no row.");
    }
    return data;
  }

  const { data, error } = await service().from("posts").insert(input).select("*").single();
  handleError(error);
  if (!data) {
    throw new Error("Post insert returned no row.");
  }
  return data;
}

export async function duplicatePost(id: string): Promise<PostRow> {
  const post = await getPostById(id);
  if (!post) {
    throw new Error("Post not found.");
  }

  const { id: _id, created_at, updated_at, meta_container_id, meta_media_id, permalink, ...copy } =
    post;
  void _id;
  void created_at;
  void updated_at;
  void meta_container_id;
  void meta_media_id;
  void permalink;

  return savePost({
    ...copy,
    title: `${post.title} (Copy)`,
    status: "draft",
    scheduled_at: null,
    owner_approved: false,
    price_verified: post.requires_price_verification ? false : post.price_verified,
    owner_service_confirmed: post.requires_owner_service_confirmation
      ? false
      : post.owner_service_confirmed,
    error: null,
  });
}

export async function getUpcomingPosts(days = 30): Promise<PostRow[]> {
  const now = new Date().toISOString();
  const end = addDays(new Date(), days).toISOString();
  const { data, error } = await service()
    .from("posts")
    .select("*")
    .not("scheduled_at", "is", null)
    .gte("scheduled_at", now)
    .lte("scheduled_at", end)
    .order("scheduled_at", { ascending: true });

  handleError(error);
  return data ?? [];
}

export async function getCalendarPosts(anchorDate = new Date()): Promise<PostRow[]> {
  const monthStart = startOfMonth(anchorDate).toISOString();
  const monthEnd = endOfMonth(anchorDate).toISOString();
  const { data, error } = await service()
    .from("posts")
    .select("*")
    .not("scheduled_at", "is", null)
    .gte("scheduled_at", monthStart)
    .lte("scheduled_at", monthEnd)
    .order("scheduled_at", { ascending: true });

  handleError(error);
  return data ?? [];
}

export async function importContentCalendar(payload: {
  posts: PostInsert[];
  templates?: ContentTemplateInsert[];
}) {
  const client = service();

  if (payload.templates && payload.templates.length > 0) {
    const { error } = await client.from("content_templates").insert(payload.templates);
    handleError(error);
  }

  if (payload.posts.length > 0) {
    const normalizedPosts = payload.posts.map((post) => ({
      ...post,
      timezone: post.timezone ?? appTimezone(),
      platform: post.platform ?? "instagram",
      asset_ids: post.asset_ids ?? [],
      hashtags: post.hashtags ?? [],
      status: post.status ?? "draft",
      owner_approved: post.owner_approved ?? false,
      requires_price_verification: post.requires_price_verification ?? false,
      price_verified: post.price_verified ?? false,
      requires_owner_service_confirmation:
        post.requires_owner_service_confirmation ?? false,
      owner_service_confirmed: post.owner_service_confirmed ?? false,
      requires_brand_asset_rights: post.requires_brand_asset_rights ?? false,
      hide_public_product_pricing: post.hide_public_product_pricing ?? false,
    }));

    const { error } = await client.from("posts").insert(normalizedPosts);
    handleError(error);
  }
}

export async function getDueApprovedPosts(referenceDate = new Date()): Promise<PostRow[]> {
  const { data, error } = await service()
    .from("posts")
    .select("*")
    .in("status", ["approved", "scheduled"])
    .eq("owner_approved", true)
    .neq("status", "published")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", referenceDate.toISOString())
    .order("scheduled_at", { ascending: true });

  handleError(error);
  return data ?? [];
}

export async function getDuePostsForReview(referenceDate = new Date()): Promise<PostRow[]> {
  const { data, error } = await service()
    .from("posts")
    .select("*")
    .in("status", ["approved", "scheduled"])
    .neq("status", "published")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", referenceDate.toISOString())
    .order("scheduled_at", { ascending: true });

  handleError(error);
  return data ?? [];
}

export async function markPostPublishing(id: string) {
  const { error } = await service()
    .from("posts")
    .update({
      status: "publishing",
      error: null,
    })
    .eq("id", id);

  handleError(error);
}

export async function markPostFailed(id: string, errorMessage: string) {
  const { error } = await service()
    .from("posts")
    .update({
      status: "failed",
      error: errorMessage,
    })
    .eq("id", id);

  handleError(error);
}

export async function markPostApproved(id: string) {
  const { error } = await service()
    .from("posts")
    .update({
      status: "approved",
      error: null,
    })
    .eq("id", id);

  handleError(error);
}

export async function markPostPublished(
  id: string,
  params: {
    containerId: string;
    mediaId: string;
    permalink: string | null;
  },
) {
  const { error } = await service()
    .from("posts")
    .update({
      status: "published",
      meta_container_id: params.containerId,
      meta_media_id: params.mediaId,
      permalink: params.permalink,
      error: null,
    })
    .eq("id", id);

  handleError(error);
}

export async function updatePostContainerId(id: string, containerId: string) {
  const { error } = await service()
    .from("posts")
    .update({
      meta_container_id: containerId,
    })
    .eq("id", id);

  handleError(error);
}

export async function getAssetsByIds(assetIds: string[]): Promise<AssetRow[]> {
  if (assetIds.length === 0) {
    return [];
  }

  const { data, error } = await service()
    .from("assets")
    .select("*")
    .in("id", assetIds);
  handleError(error);
  return data ?? [];
}

export async function hasLivePublishedPosts(): Promise<boolean> {
  const { count, error } = await service()
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");
  handleError(error);
  return (count ?? 0) > 0;
}

export async function listPublishedPostsForMetrics(limit = 100): Promise<PostRow[]> {
  const { data, error } = await service()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .not("meta_media_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(limit);
  handleError(error);
  return data ?? [];
}

export async function insertMetricRow(metric: MetricInsert) {
  const { error } = await service().from("metrics").insert(metric);
  handleError(error);
}

export function withDisplayStatus(post: PostRow): PostRow & { displayStatus: PostStatus } {
  return {
    ...post,
    displayStatus: getDisplayStatus(post),
  };
}
