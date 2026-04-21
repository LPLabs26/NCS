import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasSupabaseBrowserEnv } from "@/lib/env";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authConfigured = hasSupabaseBrowserEnv();
  const user = await getAuthenticatedUser();

  if (authConfigured && !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {!authConfigured ? <SetupBanner title="Auth is not configured yet" /> : null}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
