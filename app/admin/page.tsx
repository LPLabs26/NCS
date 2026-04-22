import Link from "next/link";

import { SafetyStatusBanner } from "@/components/admin/SafetyStatusBanner";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { getAdminAccess } from "@/lib/auth";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { smokeTestMetaConnection } from "@/lib/meta/instagram";
import { getPostWarnings } from "@/lib/scheduler/validation";
import { appTimezone, hasStorageEnv, isDryRun, isLiveCronEnabled } from "@/lib/env";
import { formatInAppTimezone, truncate } from "@/lib/utils";
import {
  getUpcomingPosts,
  isConfigured,
  listAssets,
  listPosts,
  withDisplayStatus,
} from "@/lib/data/posts";
import { analyzePublicAssetUrl } from "@/lib/storage/urlSafety";
import type { AssetRow } from "@/types/database";

function isAssetRow(asset: AssetRow | undefined): asset is AssetRow {
  return Boolean(asset);
}

export default async function AdminOverviewPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-6">
        <SetupBanner title="Database connection still missing" />
      </div>
    );
  }

  const [upcomingRaw, allPosts, allAssets, metaStatus, access] = await Promise.all([
    getUpcomingPosts(30),
    listPosts(),
    listAssets(),
    smokeTestMetaConnection(),
    getAdminAccess(),
  ]);
  const upcoming = upcomingRaw.map(withDisplayStatus);
  const assetMap = new Map(allAssets.map((asset) => [asset.id, asset]));
  const warningRows = upcoming.map((post) => {
    const assets = post.asset_ids
      .map((assetId) => assetMap.get(assetId))
      .filter(isAssetRow);
    return {
      post,
      warnings: getPostWarnings(post, assets),
    };
  });
  const attentionRows = warningRows.filter((item) => item.warnings.length > 0);
  const timezone = appTimezone();
  const counts = upcoming.reduce<Record<string, number>>((accumulator, post) => {
    accumulator[post.displayStatus] = (accumulator[post.displayStatus] ?? 0) + 1;
    return accumulator;
  }, {});
  const packagePriceCount = allPosts.filter(
    (post) => post.requires_price_verification && !post.price_verified,
  ).length;
  const circadiaServiceCount = allPosts.filter(
    (post) =>
      post.requires_owner_service_confirmation && !post.owner_service_confirmed,
  ).length;
  const circadiaBrandCount = allPosts.filter((post) => {
    if (!post.requires_brand_asset_rights) {
      return false;
    }

    const assets = post.asset_ids
      .map((assetId) => assetMap.get(assetId))
      .filter(isAssetRow);
    return assets.length === 0 || assets.some((asset) => !asset.usage_rights_confirmed);
  }).length;
  const invalidAssetCount = allAssets.filter((asset) => {
    const urlStatus = analyzePublicAssetUrl(asset.public_url);
    return !urlStatus.ok || !asset.usage_rights_confirmed;
  }).length;
  const baseUrlStatus = analyzePublicAssetUrl(process.env.ASSET_PUBLIC_BASE_URL);
  const storageConfigured = hasStorageEnv();
  const storageStatus = !storageConfigured
    ? {
        tone: "warn" as const,
        title: "Asset storage",
        detail:
          "Storage credentials are not fully configured yet. Uploads and Meta-ready public URLs still need setup.",
      }
    : !process.env.ASSET_PUBLIC_BASE_URL || !baseUrlStatus.ok
      ? {
          tone: "fail" as const,
          title: "Asset storage",
          detail:
            "ASSET_PUBLIC_BASE_URL is missing or not HTTPS. Meta publishing requires stable public HTTPS asset URLs.",
        }
      : invalidAssetCount > 0
        ? {
            tone: "warn" as const,
            title: "Asset storage",
            detail: `${invalidAssetCount} asset(s) currently have public URL or usage-rights issues.`,
          }
        : {
            tone: "pass" as const,
            title: "Asset storage",
            detail:
              "Storage env is configured and current asset URLs look publish-safe.",
          };
  const metaBannerStatus = metaStatus.ok
    ? {
        tone: "pass" as const,
        title: "Meta connection",
        detail: metaStatus.details[1] ?? "Instagram account is reachable through the official Meta API.",
      }
    : metaStatus.configured
      ? {
          tone: "warn" as const,
          title: "Meta connection",
          detail: metaStatus.errors[0] ?? "Meta account setup still needs attention.",
        }
      : {
          tone: "warn" as const,
          title: "Meta connection",
          detail: "Meta env is not configured yet. Smoke test this before any manual publish test.",
        };

  return (
    <div className="space-y-8">
      <SafetyStatusBanner
        role={access?.role}
        dryRun={isDryRun()}
        liveCronEnabled={isLiveCronEnabled()}
        metaStatus={metaBannerStatus}
        storageStatus={storageStatus}
        packagePriceCount={packagePriceCount}
        circadiaServiceCount={circadiaServiceCount}
        circadiaBrandCount={circadiaBrandCount}
        invalidAssetCount={invalidAssetCount}
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Next 30 days", value: upcoming.length },
          { label: "Approved + scheduled", value: counts.scheduled ?? 0 },
          { label: "Needs attention", value: (counts.failed ?? 0) + (counts.needs_asset ?? 0) },
          { label: "Warning rows", value: attentionRows.length },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              {stat.label}
            </p>
            <p className="mt-4 font-display text-5xl text-stone-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Publish mode
          </p>
          <p className="mt-3 text-2xl font-semibold text-stone-900">
            {isDryRun() ? "Dry run is ON" : "Live publish is ON"}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {isDryRun()
              ? "Validation and scheduling work, but no live publish call is made."
              : "Manual owner-approved publishing is live. Treat this as production."}
          </p>
        </div>
        <div className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Cron mode
          </p>
          <p className="mt-3 text-2xl font-semibold text-stone-900">
            {isLiveCronEnabled() ? "Live cron enabled" : "Live cron disabled"}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {isLiveCronEnabled()
              ? "Cron can publish live once dry run is disabled and the first live manual post has already succeeded."
              : "Cron stays safe by forcing dry-run behavior until you explicitly enable live cron."}
          </p>
        </div>
        <div className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Meta connection
          </p>
          <p className="mt-3 text-2xl font-semibold text-stone-900">
            {metaStatus.ok ? "Connected" : metaStatus.configured ? "Needs attention" : "Not configured"}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {metaStatus.ok
              ? metaStatus.details[1] ?? "Instagram account is reachable through the official Meta API."
              : metaStatus.errors[0] ?? "Meta account setup still needs attention."}
          </p>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Safety queue
            </p>
            <h2 className="mt-1 font-display text-3xl text-stone-900">
              Warnings before anything gets approved
            </h2>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {attentionRows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
              No publish blockers are showing on posts in the next 30 days right now.
            </div>
          ) : (
            attentionRows.map(({ post, warnings }) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="block rounded-3xl border border-white/80 bg-white/82 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                      {post.format}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-stone-900">{post.title}</h3>
                  </div>
                  <StatusBadge status={post.displayStatus} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {warnings.map((warning) => (
                    <span
                      key={`${post.id}-${warning}`}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
                    >
                      {warning}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          )}
        </div>
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
