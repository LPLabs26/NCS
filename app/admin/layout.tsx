import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { getAuthenticatedUser } from "@/lib/auth";
import { getAdminAccessForUser } from "@/lib/access";
import {
  hasSupabaseBrowserEnv,
  isLiveCronEnabled,
  shouldFailClosedForAdminAuth,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authConfigured = hasSupabaseBrowserEnv();
  if (shouldFailClosedForAdminAuth(process.env.NODE_ENV, authConfigured)) {
    redirect("/login?error=auth-not-configured");
  }

  const user = await getAuthenticatedUser();
  const access = await getAdminAccessForUser(user, authConfigured);

  if (authConfigured && !user) {
    redirect("/login");
  }

  if (!access) {
    return (
      <div className="min-h-screen">
        <AdminNav authConfigured={authConfigured} liveCronEnabled={isLiveCronEnabled()} />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-stone-800">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">
              Scheduler access denied
            </p>
            <p className="mt-3 text-sm leading-6">
              {authConfigured
                ? `Signed in as ${user?.email ?? "this account"}, but the account is not in the scheduler admin allowlist.`
                : "Admin auth is not configured in this environment."}
            </p>
            <p className="mt-3 text-sm leading-6">
              Add the owner or team member to the `admin_users` table before using the production
              scheduler.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminNav
        authConfigured={authConfigured}
        liveCronEnabled={isLiveCronEnabled()}
        role={access.role}
      />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {!authConfigured ? <SetupBanner title="Auth is not configured yet" /> : null}
        {access.source === "local-dev-bypass" ? (
          <div className="mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            Local development bypass is active because browser auth env is missing outside
            production. Production still fails closed.
          </div>
        ) : null}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
