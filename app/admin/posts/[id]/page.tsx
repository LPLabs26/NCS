import Image from "next/image";
import Link from "next/link";

import { AssetUploadForm } from "@/components/admin/AssetUploadForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { savePostAction, duplicatePostAction, publishNowAction } from "@/app/admin/actions";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { appTimezone } from "@/lib/env";
import { getPostById, isConfigured, listAssets, withDisplayStatus } from "@/lib/data/posts";
import { toLocalDateTimeInput } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PostDetailPage({ params, searchParams }: Props) {
  if (!isConfigured()) {
    return <SetupBanner title="Database connection still missing" />;
  }

  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const isNew = id === "new";
  const [post, assets] = await Promise.all([
    isNew ? null : getPostById(id),
    listAssets(),
  ]);

  if (!isNew && !post) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white/82 p-8">
        <p className="text-lg font-semibold text-stone-900">Post not found.</p>
        <Link href="/admin/posts" className="mt-4 inline-flex text-sm font-semibold text-stone-700">
          Back to posts
        </Link>
      </div>
    );
  }

  const editablePost = post
    ? withDisplayStatus(post)
    : {
        id: "new",
        title: "",
        format: "image" as const,
        pillar: "",
        status: "draft" as const,
        caption: "",
        hashtags: [],
        cta: "",
        scheduled_at: null,
        timezone: appTimezone(),
        asset_ids: [] as string[],
        displayStatus: "draft" as const,
        created_at: "",
        updated_at: "",
        platform: "instagram",
        meta_container_id: null,
        meta_media_id: null,
        permalink: null,
        error: null,
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/posts" className="text-sm font-semibold text-stone-500">
            ← Back to posts
          </Link>
          <h2 className="mt-2 font-display text-4xl text-stone-900">
            {isNew ? "Create Post" : editablePost.title}
          </h2>
          {!isNew ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={editablePost.displayStatus} />
              {editablePost.permalink ? (
                <a
                  href={editablePost.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-stone-700 underline decoration-stone-400 underline-offset-4"
                >
                  View live permalink
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {!isNew ? (
          <div className="flex flex-wrap gap-3">
            <form action={duplicatePostAction}>
              <input type="hidden" name="id" value={editablePost.id} />
              <button
                type="submit"
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
              >
                Duplicate
              </button>
            </form>
            {editablePost.status === "approved" ? (
              <form action={publishNowAction}>
                <input type="hidden" name="id" value={editablePost.id} />
                <button
                  type="submit"
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Publish now
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
      </div>

      {(resolvedSearchParams.saved || resolvedSearchParams.publish || resolvedSearchParams.duplicated) &&
      typeof resolvedSearchParams.saved !== "object" ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {resolvedSearchParams.saved
            ? "Post saved."
            : resolvedSearchParams.duplicated
              ? "Post duplicated."
              : `Manual publish result: ${resolvedSearchParams.publish}`}
        </div>
      ) : null}

      {editablePost.error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <span className="font-semibold">Latest publish error:</span> {editablePost.error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <form action={savePostAction} className="glass-panel space-y-5 rounded-[2rem] p-6">
          <input type="hidden" name="id" value={editablePost.id} />
          <input type="hidden" name="timezone" value={editablePost.timezone ?? appTimezone()} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                defaultValue={editablePost.title}
                required
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="format">
                Format
              </label>
              <select
                id="format"
                name="format"
                defaultValue={editablePost.format}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              >
                {["image", "reel", "carousel", "story"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="status">
                Approval status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={
                  editablePost.status === "approved" || editablePost.status === "needs_asset"
                    ? editablePost.status
                    : "draft"
                }
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              >
                <option value="draft">Draft</option>
                <option value="needs_asset">Needs asset</option>
                <option value="approved">Approved</option>
              </select>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Scheduled badges are shown automatically when an approved post has a future date.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="pillar">
                Pillar
              </label>
              <input
                id="pillar"
                name="pillar"
                defaultValue={editablePost.pillar ?? ""}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-stone-700"
                htmlFor="scheduled_at"
              >
                Schedule
              </label>
              <input
                id="scheduled_at"
                type="datetime-local"
                name="scheduled_at"
                defaultValue={toLocalDateTimeInput(
                  editablePost.scheduled_at,
                  editablePost.timezone ?? appTimezone(),
                )}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="caption">
                Caption
              </label>
              <textarea
                id="caption"
                name="caption"
                rows={7}
                defaultValue={editablePost.caption ?? ""}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="hashtags">
                Hashtags
              </label>
              <textarea
                id="hashtags"
                name="hashtags"
                rows={4}
                defaultValue={editablePost.hashtags.join(", ")}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="cta">
                CTA
              </label>
              <input
                id="cta"
                name="cta"
                defaultValue={editablePost.cta ?? ""}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                Attach assets
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Publishing is blocked until required media exists and usage rights are confirmed.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {assets.map((asset) => {
                const selected = editablePost.asset_ids.includes(asset.id);

                return (
                  <label
                    key={asset.id}
                    className={`overflow-hidden rounded-3xl border p-3 transition ${
                      selected ? "border-stone-700 bg-stone-50" : "border-stone-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="asset_ids"
                      value={asset.id}
                      defaultChecked={selected}
                      className="sr-only"
                    />
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-stone-100">
                        {asset.type === "image" ? (
                          <Image
                            src={asset.public_url}
                            alt={asset.alt_text ?? asset.filename}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-stone-900 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                            Video
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-900">
                          {asset.filename}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {asset.type} · {asset.aspect_ratio ?? "n/a"} ·{" "}
                          {asset.usage_rights_confirmed ? "rights confirmed" : "rights pending"}
                        </p>
                        <p className="mt-2 text-xs text-stone-500 break-all">{asset.public_url}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Save post
          </button>
        </form>

        <div className="space-y-6">
          <AssetUploadForm />
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
              Publish notes
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
              <li>Only approved posts are eligible for publish runs.</li>
              <li>Dry run stays on by default until you intentionally switch it off in env.</li>
              <li>The first live publish is blocked from cron and must be triggered manually.</li>
              <li>Do not post package pricing until the owner confirms the offer.</li>
              <li>
                Before-and-after images, client reviews, and intimate waxing references need explicit
                consent before they go live.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
