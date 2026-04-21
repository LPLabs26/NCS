import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServiceEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let cachedClient: SupabaseClient<Database> | null = null;

export function getServiceSupabase(): SupabaseClient<Database> {
  if (cachedClient) {
    return cachedClient;
  }

  const { url, serviceRoleKey } = getSupabaseServiceEnv();

  cachedClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
