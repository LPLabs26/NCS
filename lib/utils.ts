import { createHash } from "node:crypto";

import { format, isFuture } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

import type { PostRow, PostStatus } from "@/types/database";

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  needs_asset: "Needs Asset",
  approved: "Approved",
  scheduled: "Scheduled",
  publishing: "Publishing",
  published: "Published",
  failed: "Failed",
};

export function cn(...values: Array<string | undefined | false | null>): string {
  return values.filter(Boolean).join(" ");
}

export function parseList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildInstagramCaption(
  caption?: string | null,
  cta?: string | null,
  hashtags?: string[] | null,
): string {
  const sections = [caption?.trim(), cta?.trim()]
    .filter(Boolean)
    .map((item) => item as string);
  const formattedHashtags = (hashtags ?? [])
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag.replace(/\s+/g, "")}`));

  if (formattedHashtags.length > 0) {
    sections.push(formattedHashtags.join(" "));
  }

  return sections.join("\n\n");
}

export function toLocalDateTimeInput(
  isoString: string | null | undefined,
  timezone: string,
): string {
  if (!isoString) {
    return "";
  }

  return formatInTimeZone(isoString, timezone, "yyyy-MM-dd'T'HH:mm");
}

export function fromLocalDateTimeInput(
  value: string | null | undefined,
  timezone: string,
): string | null {
  if (!value) {
    return null;
  }

  return fromZonedTime(value, timezone).toISOString();
}

export function formatInAppTimezone(
  value: string | Date | null | undefined,
  timezone: string,
  pattern = "MMM d, yyyy h:mm a zzz",
): string {
  if (!value) {
    return "Unscheduled";
  }

  return formatInTimeZone(value, timezone, pattern);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function checksumHex(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function getDisplayStatus(post: Pick<PostRow, "status" | "scheduled_at">): PostStatus {
  if (
    post.status === "approved" &&
    post.scheduled_at &&
    isFuture(new Date(post.scheduled_at))
  ) {
    return "scheduled";
  }

  return post.status;
}

export function truncate(value: string | null | undefined, length = 120): string {
  if (!value) {
    return "";
  }

  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length - 1)}…`;
}

export function groupByDay<T extends { scheduled_at: string | null }>(
  rows: T[],
  timezone: string,
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const row of rows) {
    if (!row.scheduled_at) {
      continue;
    }

    const key = formatInTimeZone(row.scheduled_at, timezone, "yyyy-MM-dd");
    grouped.set(key, [...(grouped.get(key) ?? []), row]);
  }

  return grouped;
}

export function shortDate(date: Date): string {
  return format(date, "MMM d");
}
