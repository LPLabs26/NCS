import Link from "next/link";

import { hasSupabaseBrowserEnv, isDryRun } from "@/lib/env";
import { signOutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/import", label: "Import" },
];

export function AdminNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[rgba(248,243,238,0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
            NCS Aesthetics
          </p>
          <h1 className="font-display text-2xl text-stone-900">Social Scheduler</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
              isDryRun() ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isDryRun() ? "Dry Run" : "Live Publish"}
          </span>
          {hasSupabaseBrowserEnv() ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
