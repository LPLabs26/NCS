import { roleCan } from "@/lib/access";
import type {
  AdminRole,
  ContentTemplateInsert,
  PostInsert,
  PostStatus,
} from "@/types/database";

const publishSensitiveStatuses = new Set<PostStatus>([
  "approved",
  "scheduled",
  "publishing",
  "published",
]);

export interface ImportSanitizeResult {
  posts: PostInsert[];
  templates: ContentTemplateInsert[];
  sanitizedCount: number;
}

export function isPublishSensitivePostInput(
  input: Pick<
    PostInsert,
    "owner_approved" | "price_verified" | "owner_service_confirmed" | "status"
  >,
): boolean {
  return Boolean(
    input.owner_approved ||
      input.price_verified ||
      input.owner_service_confirmed ||
      (input.status && publishSensitiveStatuses.has(input.status)),
  );
}

export function canRoleSavePostInput(
  role: AdminRole,
  input: Pick<
    PostInsert,
    "owner_approved" | "price_verified" | "owner_service_confirmed" | "status"
  >,
): boolean {
  return roleCan(role, "edit") && (!isPublishSensitivePostInput(input) || roleCan(role, "publish"));
}

export function sanitizeImportedPostsForRole(
  role: AdminRole,
  posts: PostInsert[],
): ImportSanitizeResult {
  if (roleCan(role, "publish")) {
    return {
      posts,
      templates: [],
      sanitizedCount: 0,
    };
  }

  let sanitizedCount = 0;

  const sanitizedPosts = posts.map((post) => {
    const sanitized: PostInsert = {
      ...post,
      status: "draft",
      owner_approved: false,
      price_verified: false,
      owner_service_confirmed: false,
    };

    if (
      post.status !== sanitized.status ||
      post.owner_approved !== sanitized.owner_approved ||
      post.price_verified !== sanitized.price_verified ||
      post.owner_service_confirmed !== sanitized.owner_service_confirmed
    ) {
      sanitizedCount += 1;
    }

    return sanitized;
  });

  return {
    posts: sanitizedPosts,
    templates: [],
    sanitizedCount,
  };
}

export function sanitizeImportedPayloadForRole(
  role: AdminRole,
  payload: {
    posts: PostInsert[];
    templates?: ContentTemplateInsert[];
  },
): ImportSanitizeResult {
  const result = sanitizeImportedPostsForRole(role, payload.posts);
  return {
    ...result,
    templates: payload.templates ?? [],
  };
}
