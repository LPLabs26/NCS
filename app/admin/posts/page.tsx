import Link from "next/link";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { appTimezone } from "@/lib/env";
import { formatInAppTimezone, truncate } from "@/lib/utils";
import { getDistinctPillars, isConfigured, listPosts, withDisplayStatus } from "@/lib/data/posts";

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PostsPage({ searchParams }: Props) {
  if (!isConfigured()) {
    return <SetupBanner title="Database connection still missing" />;
  }

  const resolvedParams = (await searchParams) ?? {};
  const filters = {
    status: typeof resolvedParams.status === "string" ? resolvedParams.status : "all",
    format: typeof resolvedParams.format === "string" ? resolvedParams.format : "all",
    pillar: typeof resolvedParams.pillar === "string" ? resolvedParams.pillar : "all",
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : "",
  };
  const [posts, pillars] = await Promise.all([
    listPosts(filters).then((rows) => rows.map(withDisplayStatus)),
    getDistinctPillars(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Content Library
          </p>
          <h2 className="mt-1 font-display text-4xl text-stone-900">Posts</h2>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          New post
        </Link>
      </div>

      <form className="glass-panel grid gap-4 rounded-[2rem] p-5 md:grid-cols-4">
        <input
          type="text"
          name="search"
          defaultValue={filters.search}
          placeholder="Search title"
          className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
        />
        <select
          name="status"
          defaultValue={filters.status}
          className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
        >
          {["all", "draft", "needs_asset", "approved", "scheduled", "publishing", "published", "failed"].map(
            (item) => (
              <option key={item} value={item}>
                {item === "all" ? "All statuses" : item}
              </option>
            ),
          )}
        </select>
        <select
          name="format"
          defaultValue={filters.format}
          className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
        >
          {["all", "reel", "image", "carousel", "story"].map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All formats" : item}
            </option>
          ))}
        </select>
        <select
          name="pillar"
          defaultValue={filters.pillar}
          className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
        >
          <option value="all">All pillars</option>
          {pillars.map((pillar) => (
            <option key={pillar} value={pillar}>
              {pillar}
            </option>
          ))}
        </select>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Apply filters
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/posts/${post.id}`}
            className="grid gap-4 rounded-[2rem] border border-white/85 bg-white/82 p-5 transition hover:-translate-y-0.5 hover:shadow-lg lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr]"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                {post.format}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-stone-900">{post.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {truncate(post.caption, 180)}
              </p>
            </div>
            <div className="text-sm leading-6 text-stone-700">
              <p className="font-semibold text-stone-900">Pillar</p>
              <p>{post.pillar ?? "General"}</p>
            </div>
            <div className="text-sm leading-6 text-stone-700">
              <p className="font-semibold text-stone-900">Scheduled</p>
              <p>{formatInAppTimezone(post.scheduled_at, appTimezone())}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    post.owner_approved
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-900"
                  }`}
                >
                  {post.owner_approved ? "Owner approved" : "Owner approval needed"}
                </span>
                {post.requires_price_verification ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      post.price_verified
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-rose-50 text-rose-900"
                    }`}
                  >
                    {post.price_verified ? "Price verified" : "Price verification required"}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-start lg:justify-end">
              <StatusBadge status={post.displayStatus} />
            </div>
          </Link>
        ))}

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/82 p-8 text-center text-stone-600">
            No posts match those filters yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
