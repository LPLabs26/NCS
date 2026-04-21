import { buildInstagramCaption } from "@/lib/utils";
import { getMetaEnv } from "@/lib/env";

export class MetaApiError extends Error {
  status: number;
  code?: number;
  subcode?: number;
  responseBody: unknown;

  constructor(message: string, params: { status: number; code?: number; subcode?: number; responseBody: unknown }) {
    super(message);
    this.name = "MetaApiError";
    this.status = params.status;
    this.code = params.code;
    this.subcode = params.subcode;
    this.responseBody = params.responseBody;
  }
}

type GraphMethod = "GET" | "POST";

interface GraphRequestOptions {
  method?: GraphMethod;
  body?: Record<string, string | number | boolean | undefined | null>;
  query?: Record<string, string | number | boolean | undefined | null>;
}

interface GraphContainerResponse {
  id: string;
  uri?: string;
}

interface GraphPublishResponse {
  id: string;
}

interface GraphMediaFieldsResponse {
  id: string;
  permalink?: string;
  media_type?: string;
  media_product_type?: string;
}

interface InsightMetricResponse {
  name: string;
  values?: Array<{ value: number | Record<string, number> }>;
  total_value?: {
    value?: number;
    breakdowns?: Array<{
      dimension_values: string[];
      value: number;
    }>;
  };
}

export interface InstagramMediaInsights {
  reach: number | null;
  impressions: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  profile_visits: number | null;
  website_taps: number | null;
  permalink: string | null;
  mediaProductType: string | null;
}

const GRAPH_HOST = "https://graph.facebook.com";

function apiUrl(path: string, query?: GraphRequestOptions["query"]): string {
  const { apiVersion } = getMetaEnv();
  const url = new URL(`${GRAPH_HOST}/${apiVersion}/${path.replace(/^\//, "")}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function graphRequest<T>(path: string, options: GraphRequestOptions = {}): Promise<T> {
  const { pageAccessToken } = getMetaEnv();
  const response = await fetch(apiUrl(path, options.method === "GET" ? options.query : undefined), {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${pageAccessToken}`,
      "Content-Type": "application/json",
    },
    body:
      options.method === "POST"
        ? JSON.stringify(options.body ?? options.query ?? {})
        : undefined,
    cache: "no-store",
  });

  const json = (await response.json()) as unknown;
  const errorPayload =
    typeof json === "object" && json !== null && "error" in json
      ? (json as { error?: { message?: string; code?: number; error_subcode?: number } }).error
      : undefined;

  if (!response.ok || errorPayload) {
    const error = errorPayload;
    throw new MetaApiError(error?.message ?? "Meta API request failed.", {
      status: response.status,
      code: error?.code,
      subcode: error?.error_subcode,
      responseBody: json,
    });
  }

  return json as T;
}

export async function createImageContainer(params: {
  imageUrl: string;
  caption?: string | null;
  altText?: string | null;
  isCarouselItem?: boolean;
}) {
  const { igUserId } = getMetaEnv();
  return graphRequest<GraphContainerResponse>(`${igUserId}/media`, {
    method: "POST",
    body: {
      image_url: params.imageUrl,
      caption: params.caption ?? undefined,
      alt_text: params.altText ?? undefined,
      is_carousel_item: params.isCarouselItem ? "true" : undefined,
    },
  });
}

export async function createVideoCarouselItemContainer(params: { videoUrl: string }) {
  const { igUserId } = getMetaEnv();
  return graphRequest<GraphContainerResponse>(`${igUserId}/media`, {
    method: "POST",
    body: {
      media_type: "VIDEO",
      video_url: params.videoUrl,
      is_carousel_item: "true",
    },
  });
}

export async function createCarouselContainer(params: {
  children: string[];
  caption?: string | null;
}) {
  const { igUserId } = getMetaEnv();
  return graphRequest<GraphContainerResponse>(`${igUserId}/media`, {
    method: "POST",
    body: {
      media_type: "CAROUSEL",
      children: params.children.join(","),
      caption: params.caption ?? undefined,
    },
  });
}

export async function createReelContainer(params: {
  videoUrl: string;
  caption?: string | null;
  shareToFeed?: boolean;
  coverUrl?: string | null;
}) {
  const { igUserId } = getMetaEnv();
  return graphRequest<GraphContainerResponse>(`${igUserId}/media`, {
    method: "POST",
    body: {
      media_type: "REELS",
      video_url: params.videoUrl,
      caption: params.caption ?? undefined,
      share_to_feed: params.shareToFeed ?? true,
      cover_url: params.coverUrl ?? undefined,
    },
  });
}

export async function createStoryContainer(params: {
  imageUrl?: string;
  videoUrl?: string;
}) {
  const { igUserId } = getMetaEnv();
  return graphRequest<GraphContainerResponse>(`${igUserId}/media`, {
    method: "POST",
    body: {
      media_type: "STORIES",
      image_url: params.imageUrl,
      video_url: params.videoUrl,
    },
  });
}

export async function getContainerStatus(containerId: string) {
  return graphRequest<{ status_code: string; status?: string }>(containerId, {
    method: "GET",
    query: {
      fields: "status_code,status",
    },
  });
}

export async function publishContainer(containerId: string) {
  const { igUserId } = getMetaEnv();
  return graphRequest<GraphPublishResponse>(`${igUserId}/media_publish`, {
    method: "POST",
    body: {
      creation_id: containerId,
    },
  });
}

export async function getMediaFields(mediaId: string) {
  return graphRequest<GraphMediaFieldsResponse>(mediaId, {
    method: "GET",
    query: {
      fields: "id,permalink,media_type,media_product_type",
    },
  });
}

async function requestInsights(mediaId: string, metrics: string[], extraQuery?: Record<string, string>) {
  return graphRequest<{ data: InsightMetricResponse[] }>(`${mediaId}/insights`, {
    method: "GET",
    query: {
      metric: metrics.join(","),
      ...extraQuery,
    },
  });
}

function normalizeMetricValue(metric: InsightMetricResponse): number | null {
  if (typeof metric.total_value?.value === "number") {
    return metric.total_value.value;
  }

  const firstValue = metric.values?.[0]?.value;
  return typeof firstValue === "number" ? firstValue : null;
}

function normalizeProfileActivity(metric: InsightMetricResponse) {
  const websiteTaps = metric.total_value?.breakdowns?.find((item) =>
    item.dimension_values.includes("website_clicks"),
  )?.value;
  const profileVisits = metric.total_value?.breakdowns?.find((item) =>
    item.dimension_values.includes("profile_visits"),
  )?.value;

  return {
    profileVisits: profileVisits ?? null,
    websiteTaps: websiteTaps ?? null,
  };
}

export async function getMediaInsights(mediaId: string): Promise<InstagramMediaInsights> {
  const media = await getMediaFields(mediaId);
  const metrics =
    media.media_product_type === "REELS"
      ? ["reach", "likes", "comments", "saved", "shares", "views"]
      : media.media_product_type === "STORY"
        ? ["reach", "views", "impressions"]
        : ["reach", "likes", "comments", "saved", "views", "impressions"];

  const aggregated: Record<string, number | null> = {
    reach: null,
    impressions: null,
    views: null,
    likes: null,
    comments: null,
    saves: null,
    shares: null,
    profile_visits: null,
    website_taps: null,
  };

  try {
    const response = await requestInsights(mediaId, metrics);
    response.data.forEach((metric) => {
      aggregated[metric.name === "saved" ? "saves" : metric.name] = normalizeMetricValue(metric);
    });
  } catch {
    for (const metric of metrics) {
      try {
        const response = await requestInsights(mediaId, [metric]);
        const normalized = normalizeMetricValue(response.data[0]);
        aggregated[metric === "saved" ? "saves" : metric] = normalized;
      } catch {
        // Ignore unsupported metrics and preserve null.
      }
    }
  }

  if (media.media_product_type === "FEED" || media.media_product_type === "STORY") {
    try {
      const profileActivity = await requestInsights(mediaId, ["profile_activity"], {
        breakdown: "action_type",
      });
      const normalized = normalizeProfileActivity(profileActivity.data[0]);
      aggregated.profile_visits = normalized.profileVisits;
      aggregated.website_taps = normalized.websiteTaps;
    } catch {
      // Some media types or aged posts won't return this breakdown.
    }
  }

  return {
    reach: aggregated.reach,
    impressions: aggregated.impressions,
    views: aggregated.views,
    likes: aggregated.likes,
    comments: aggregated.comments,
    saves: aggregated.saves,
    shares: aggregated.shares,
    profile_visits: aggregated.profile_visits,
    website_taps: aggregated.website_taps,
    permalink: media.permalink ?? null,
    mediaProductType: media.media_product_type ?? null,
  };
}

export function buildMetaCaption(params: {
  caption?: string | null;
  cta?: string | null;
  hashtags?: string[] | null;
}) {
  return buildInstagramCaption(params.caption, params.cta, params.hashtags);
}
