import Link from "next/link";

import { SetupBanner } from "@/components/admin/SetupBanner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { appTimezone } from "@/lib/env";
import { formatInAppTimezone, truncate } from "@/lib/utils";
import { getUpcomingPosts, isConfigured, withDisplayStatus } from "@/lib/data/posts";

export default async function AdminOverviewPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-6">
        <SetupBanner title="Database connection still missing" />
      </div>
    );
  }

  const upcoming = (await getUpcomingPosts(30)).map(withDisplayStatus);
  const timezone = appTimezone();
  const counts = upcoming.reduce<Record<string, number>>((accumulator, post) => {
    accumulator[post.displayStatus] = (accumulator[post.displayStatus] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Next 30 days", value: upcoming.length },
          { label: "Approved + scheduled", value: counts.scheduled ?? 0 },
          { label: "Needs attention", value: (counts.failed ?? 0) + (counts.needs_asset ?? 0) },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              {stat.label}
            </p>
            <p className="mt-4 font-display text-5xl text-stone-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Next 30 Days
            </p>
            <h2 className="mt-1 font-display text-3xl text-stone-900">
              Scheduled studio content at a glance
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/posts"
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
            >
              Manage posts
            </Link>
            <Link
              href="/admin/calendar"
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Open calendar
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {upcoming.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white/75 p-8 text-center text-stone-600">
              No upcoming posts yet. Seed the starter calendar or import a CSV/JSON plan.
            </div>
          ) : (
            upcoming.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="grid gap-3 rounded-3xl border border-white/80 bg-white/82 p-5 transition hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[1.6fr_0.8fr_0.6fr]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                    {post.format}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-stone-900">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {truncate(post.caption, 180)}
                  </p>
                </div>
                <div className="text-sm leading-6 text-stone-700">
                  <p className="font-semibold text-stone-900">{post.pillar ?? "General"}</p>
                  <p>{formatInAppTimezone(post.scheduled_at, timezone)}</p>
                </div>
                <div className="flex items-start justify-start md:justify-end">
                  <StatusBadge status={post.displayStatus} />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
