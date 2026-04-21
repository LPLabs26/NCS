import Image from "next/image";
import Link from "next/link";

import { AssetUploadForm } from "@/components/admin/AssetUploadForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { savePostAction, duplicatePostAction, publishNowAction } from "@/app/admin/actions";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { getAdminAccess } from "@/lib/auth";
import { roleCan } from "@/lib/access";
import { appTimezone, isDryRun } from "@/lib/env";
import {
  getPostById,
  hasLivePublishedPosts,
  isConfigured,
  listAssets,
  withDisplayStatus,
} from "@/lib/data/posts";
import {
  getPostPublishBlockers,
  getPostWarnings,
} from "@/lib/scheduler/validation";
import {
  buildInstagramCaption,
  toLocalDateTimeInput,
} from "@/lib/utils";

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
  const [post, assets, access, hasLivePosts] = await Promise.all([
    isNew ? null : getPostById(id),
    listAssets(),
    getAdminAccess(),
    hasLivePublishedPosts(),
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
        owner_approved: false,
        price_verified: false,
        requires_price_verification: false,
      };
  const canEdit = access ? roleCan(access.role, "edit") : false;
  const canPublish = access ? roleCan(access.role, "publish") : false;
  const selectedAssets = assets.filter((asset) => editablePost.asset_ids.includes(asset.id));
  const publishBlockers = getPostPublishBlockers(editablePost, selectedAssets);
  const warnings = getPostWarnings(editablePost, selectedAssets);
  const previewCaption = buildInstagramCaption(
    editablePost.caption,
    editablePost.cta,
    editablePost.hashtags,
  );
  const canPublishNow =
    !isNew &&
    canPublish &&
    editablePost.owner_approved &&
    ["approved", "scheduled"].includes(editablePost.status);
  const showFirstLiveConfirmation = canPublishNow && !isDryRun() && !hasLivePosts;

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
            {canEdit ? (
              <form action={duplicatePostAction}>
                <input type="hidden" name="id" value={editablePost.id} />
                <button
                  type="submit"
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
                >
                  Duplicate
                </button>
              </form>
            ) : null}
            {canPublishNow ? (
              <form action={publishNowAction}>
                <input type="hidden" name="id" value={editablePost.id} />
                {showFirstLiveConfirmation ? (
                  <label className="mb-3 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <input type="checkbox" name="confirm_first_live_publish" value="true" required />
                    I confirm this is the first live owner-approved publish and should go out now.
                  </label>
                ) : null}
                <button
                  type="submit"
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  {isDryRun() ? "Publish now (dry run)" : "Publish now"}
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
              : `Manual publish result: ${resolvedSearchParams.publish}${
                  typeof resolvedSearchParams.publish_message === "string"
                    ? ` — ${resolvedSearchParams.publish_message}`
                    : ""
                }`}
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
          <fieldset disabled={!canEdit} className="grid gap-4 md:grid-cols-2 disabled:opacity-80">
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
                  editablePost.displayStatus === "scheduled"
                    ? "scheduled"
                    : editablePost.status === "approved" || editablePost.status === "needs_asset"
                      ? editablePost.status
                      : "draft"
                }
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              >
                <option value="draft">Draft</option>
                <option value="needs_asset">Needs asset</option>
                <option value="approved">Approved</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Scheduled posts still require owner approval and valid media before they can go out.
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
            <div className="rounded-3xl border border-stone-200 bg-white p-4">
              <label className="flex items-start gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  name="owner_approved"
                  value="true"
                  defaultChecked={editablePost.owner_approved}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold text-stone-900">Owner approval required</span>
                  Manual and scheduled publishing are blocked until Natalie or an admin confirms this post.
                </span>
              </label>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-4">
              <label className="flex items-start gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  name="requires_price_verification"
                  value="true"
                  defaultChecked={editablePost.requires_price_verification}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold text-stone-900">
                    Requires price verification
                  </span>
                  Use this for package or offer posts where pricing must be confirmed before publish.
                </span>
              </label>
            </div>
            <div className="md:col-span-2 rounded-3xl border border-stone-200 bg-white p-4">
              <label className="flex items-start gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  name="price_verified"
                  value="true"
                  defaultChecked={editablePost.price_verified}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold text-stone-900">Price verified</span>
                  Do not check this for Platinum Hydrafacial B3G1 posts until the owner confirms the correct price.
                </span>
              </label>
            </div>

            <div className="space-y-3 md:col-span-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Attach assets
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Publishing is blocked until required media exists, public URLs are HTTPS, and usage rights are confirmed.
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
                          <p className="mt-1 text-xs text-stone-500">
                            {asset.width ?? "?"}×{asset.height ?? "?"}
                            {asset.file_size_bytes ? ` · ${(asset.file_size_bytes / 1024 / 1024).toFixed(1)} MB` : ""}
                          </p>
                          <p className="mt-2 break-all text-xs text-stone-500">{asset.public_url}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </fieldset>

          {canEdit ? (
            <button
              type="submit"
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Save post
            </button>
          ) : (
            <div className="rounded-3xl border border-stone-200 bg-stone-100 p-4 text-sm text-stone-700">
              Your role is view-only. Ask an owner, admin, or editor to make changes.
            </div>
          )}
        </form>

        <div className="space-y-6">
          {canEdit ? <AssetUploadForm /> : null}
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
              Preview
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-800">
              {previewCaption || "Caption preview will appear here after you add content."}
            </p>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
              Publish blockers
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {publishBlockers.length === 0 ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  No publish blockers on the saved post state.
                </span>
              ) : (
                publishBlockers.map((blocker) => (
                  <span
                    key={blocker}
                    className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-900"
                  >
                    {blocker}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
              Compliance warnings
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {warnings.length === 0 ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  No warning flags on the saved post state.
                </span>
              ) : (
                warnings.map((warning) => (
                  <span
                    key={warning}
                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
                  >
                    {warning}
                  </span>
                ))
              )}
            </div>
          </div>
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
