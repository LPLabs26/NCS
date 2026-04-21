import Link from "next/link";

import { LoginForm } from "@/components/admin/LoginForm";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { hasSupabaseBrowserEnv } from "@/lib/env";

export default function LoginPage() {
  const authConfigured = hasSupabaseBrowserEnv();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-stone-500">
            Studio Login
          </p>
          <h1 className="font-display text-5xl text-stone-900">Access the scheduler.</h1>
          <p className="text-lg leading-8 text-stone-700">
            Use Supabase magic-link sign-in for the internal admin dashboard. Once signed in, you
            can review posts, manage assets, import calendars, and trigger manual dry runs.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
          >
            Back to home
          </Link>
        </section>
        <section className="glass-panel rounded-[2rem] p-8">
          {authConfigured ? <LoginForm /> : <SetupBanner title="Auth envs still missing" />}
        </section>
      </div>
    </main>
  );
}
