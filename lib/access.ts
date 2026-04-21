import type { User } from "@supabase/supabase-js";

import { hasSupabaseServiceEnv, isProductionEnvironment } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/service";
import type { AdminRole, AdminUserRow } from "@/types/database";

export type SchedulerPermission = "read" | "edit" | "publish" | "manage";

export interface AdminAccess {
  role: AdminRole;
  record: AdminUserRow | null;
  source: "allowlist" | "local-dev-bypass";
}

const roleCapabilities: Record<AdminRole, SchedulerPermission[]> = {
  owner: ["read", "edit", "publish", "manage"],
  admin: ["read", "edit", "publish", "manage"],
  editor: ["read", "edit"],
  viewer: ["read"],
};

export function roleCan(role: AdminRole, permission: SchedulerPermission): boolean {
  return roleCapabilities[role].includes(permission);
}

export function allowLocalDevelopmentBypass(
  nodeEnv = process.env.NODE_ENV,
  authConfigured = false,
): boolean {
  return !isProductionEnvironment(nodeEnv) && !authConfigured;
}

export async function getAdminAllowlistEntry(user: Pick<User, "id" | "email">) {
  if (!hasSupabaseServiceEnv()) {
    throw new Error(
      "Supabase service role is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const normalizedEmail = user.email?.trim().toLowerCase();
  const client = getServiceSupabase();
  const queries = [];

  if (user.id) {
    queries.push(client.from("admin_users").select("*").eq("user_id", user.id).maybeSingle());
  }
  if (normalizedEmail) {
    queries.push(
      client.from("admin_users").select("*").ilike("email", normalizedEmail).maybeSingle(),
    );
  }

  for (const query of queries) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      return data;
    }
  }

  return null;
}

export async function getAdminAccessForUser(
  user: Pick<User, "id" | "email"> | null,
  authConfigured: boolean,
): Promise<AdminAccess | null> {
  if (!user) {
    if (allowLocalDevelopmentBypass(process.env.NODE_ENV, authConfigured)) {
      return {
        role: "owner",
        record: null,
        source: "local-dev-bypass",
      };
    }

    return null;
  }

  const allowlistEntry = await getAdminAllowlistEntry(user);
  if (!allowlistEntry) {
    return null;
  }

  return {
    role: allowlistEntry.role,
    record: allowlistEntry,
    source: "allowlist",
  };
}
