import { STATUS_LABELS, cn } from "@/lib/utils";
import type { PostStatus } from "@/types/database";

const badgeClasses: Record<PostStatus, string> = {
  draft: "bg-stone-200 text-stone-700",
  needs_asset: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-sky-100 text-sky-800",
  publishing: "bg-indigo-100 text-indigo-800",
  published: "bg-teal-100 text-teal-800",
  failed: "bg-rose-100 text-rose-800",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        badgeClasses[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
