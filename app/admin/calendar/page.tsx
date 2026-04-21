import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { appTimezone } from "@/lib/env";
import { formatInAppTimezone, groupByDay } from "@/lib/utils";
import { getCalendarPosts, isConfigured, withDisplayStatus } from "@/lib/data/posts";

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CalendarPage({ searchParams }: Props) {
  if (!isConfigured()) {
    return <SetupBanner title="Database connection still missing" />;
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const monthParam =
    typeof resolvedSearchParams.month === "string"
      ? resolvedSearchParams.month
      : format(new Date(), "yyyy-MM");
  const anchorDate = parse(`${monthParam}-01`, "yyyy-MM-dd", new Date());
  const timezone = appTimezone();
  const posts = (await getCalendarPosts(anchorDate)).map(withDisplayStatus);
  const grouped = groupByDay(posts, timezone);
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchorDate)),
    end: endOfWeek(endOfMonth(anchorDate)),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Calendar View
          </p>
          <h2 className="mt-1 font-display text-4xl text-stone-900">
            {format(anchorDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/calendar?month=${format(subMonths(anchorDate, 1), "yyyy-MM")}`}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
          >
            Previous
          </Link>
          <Link
            href={`/admin/calendar?month=${format(addMonths(anchorDate, 1), "yyyy-MM")}`}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
          >
            Next
          </Link>
        </div>
      </div>

      <section className="glass-panel rounded-[2rem] p-5">
        <div className="calendar-grid mb-4 grid gap-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="px-2 text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid grid gap-3">
          {days.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayPosts = grouped.get(dayKey) ?? [];
            const inMonth = day.getMonth() === anchorDate.getMonth();

            return (
              <div
                key={dayKey}
                className={`min-h-44 rounded-[1.75rem] border p-3 ${
                  inMonth ? "border-white/80 bg-white/82" : "border-stone-200 bg-stone-100/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${inMonth ? "text-stone-900" : "text-stone-500"}`}>
                    {format(day, "d")}
                  </p>
                  <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    {dayPosts.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {dayPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/admin/posts/${post.id}`}
                      className="block rounded-2xl border border-stone-200 bg-stone-50 p-2"
                    >
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        {post.format}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-medium text-stone-900">
                        {post.title}
                      </p>
                      <p className="mt-2 text-xs text-stone-500">
                        {formatInAppTimezone(post.scheduled_at, timezone, "h:mm a")}
                      </p>
                    </Link>
                  ))}
                  {dayPosts.length > 3 ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      +{dayPosts.length - 3} more
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
          Month Detail
        </p>
        <div className="mt-4 space-y-4">
          {posts.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-stone-300 bg-white/75 p-8 text-center text-stone-600">
              No scheduled posts this month yet.
            </p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/82 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">{post.title}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {formatInAppTimezone(post.scheduled_at, timezone)}
                  </p>
                </div>
                <StatusBadge status={post.displayStatus} />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
