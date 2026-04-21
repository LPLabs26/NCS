import type { User } from "@supabase/supabase-js";

import { getAdminAccessForUser, roleCan, type AdminAccess, type SchedulerPermission } from "@/lib/access";
import { hasSupabaseBrowserEnv, shouldFailClosedForAdminAuth } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AuthConfigurationError extends Error {
  constructor(message = "Auth is not configured.") {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export class AccessDeniedError extends Error {
  constructor(message = "Your account is not allowed to access the social scheduler.") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

export function assertAdminAuthConfigured(): void {
  if (shouldFailClosedForAdminAuth(process.env.NODE_ENV, hasSupabaseBrowserEnv())) {
    throw new AuthConfigurationError();
  }
}

async function getAuthenticatedUserFromSupabase(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getAuthenticatedUser(): Promise<User | null> {
  assertAdminAuthConfigured();

  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  return getAuthenticatedUserFromSupabase();
}

export async function getAdminAccess(): Promise<AdminAccess | null> {
  const user = await getAuthenticatedUser();
  return getAdminAccessForUser(user, hasSupabaseBrowserEnv());
}

export async function requireSchedulerPermission(
  permission: SchedulerPermission,
): Promise<AdminAccess> {
  const access = await getAdminAccess();

  if (!access) {
    throw new AccessDeniedError(
      hasSupabaseBrowserEnv()
        ? "Your account is not in the scheduler admin allowlist."
        : "Scheduler auth is not configured for this environment.",
    );
  }

  if (!roleCan(access.role, permission)) {
    throw new AccessDeniedError(
      `Your role (${access.role}) does not allow ${permission} access.`,
    );
  }

  return access;
}
