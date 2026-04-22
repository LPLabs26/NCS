import { parseArgs } from "node:util";

import { hasSupabaseServiceEnv } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/service";
import { loadLocalEnvIfPresent } from "@/scripts/_socialCli";
import type { AdminRole } from "@/types/database";

loadLocalEnvIfPresent();

const allowedRoles = new Set<AdminRole>(["owner", "admin", "editor", "viewer"]);

async function main() {
  const { values } = parseArgs({
    allowPositionals: false,
    options: {
      email: { type: "string" },
      role: { type: "string", default: "editor" },
      "confirm-update": { type: "boolean", default: false },
    },
  });

  if (!hasSupabaseServiceEnv()) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required before adding scheduler admins.",
    );
  }

  const email = values.email?.trim().toLowerCase();
  const role = values.role?.trim().toLowerCase() as AdminRole | undefined;

  if (!email) {
    throw new Error(
      "Email is required. Example: npm run social:add-admin -- --email owner@example.com --role owner",
    );
  }

  if (!role || !allowedRoles.has(role)) {
    throw new Error("Role must be one of: owner, admin, editor, viewer.");
  }

  const client = getServiceSupabase();
  const existing = await client
    .from("admin_users")
    .select("*")
    .ilike("email", email)
    .maybeSingle();

  if (existing.error) {
    throw new Error(existing.error.message);
  }

  if (existing.data) {
    if (existing.data.role === role) {
      console.log(`Assigned role ${role} to ${email}. No change was needed.`);
      return;
    }

    if (!values["confirm-update"]) {
      throw new Error(
        `${email} is already in admin_users as ${existing.data.role}. Re-run with --confirm-update to change the role to ${role}.`,
      );
    }

    const update = await client
      .from("admin_users")
      .update({ role })
      .eq("id", existing.data.id);

    if (update.error) {
      throw new Error(update.error.message);
    }

    console.log(`Assigned role ${role} to ${email}.`);
    return;
  }

  const insert = await client.from("admin_users").insert({
    email,
    role,
  });

  if (insert.error) {
    throw new Error(insert.error.message);
  }

  console.log(`Assigned role ${role} to ${email}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
