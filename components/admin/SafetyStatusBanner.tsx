import type { AdminRole } from "@/types/database";

type BannerTone = "pass" | "warn" | "fail";

interface StatusDetail {
  tone: BannerTone;
  title: string;
  detail: string;
}

interface SafetyStatusBannerProps {
  role?: AdminRole;
  dryRun: boolean;
  liveCronEnabled: boolean;
  metaStatus: StatusDetail;
  storageStatus: StatusDetail;
  packagePriceCount: number;
  circadiaServiceCount: number;
  circadiaBrandCount: number;
  invalidAssetCount: number;
}

const toneClasses: Record<BannerTone, string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  fail: "border-rose-200 bg-rose-50 text-rose-900",
};

export function SafetyStatusBanner({
  role,
  dryRun,
  liveCronEnabled,
  metaStatus,
  storageStatus,
  packagePriceCount,
  circadiaServiceCount,
  circadiaBrandCount,
  invalidAssetCount,
}: SafetyStatusBannerProps) {
  const warnings: Array<{ key: string; tone: BannerTone; message: string }> = [];

  if (role === "editor") {
    warnings.push({
      key: "editor",
      tone: "warn",
      message:
        "Editors can create and edit drafts only. Only owner/admin can approve, schedule, price-verify, or publish.",
    });
  }

  if (role === "viewer") {
    warnings.push({
      key: "viewer",
      tone: "warn",
      message: "Viewers are read-only. Ask an owner/admin/editor to update scheduler content.",
    });
  }

  if (!dryRun) {
    warnings.push({
      key: "live-publish",
      tone: "fail",
      message: "Live publishing can occur for approved posts.",
    });
  }

  if (liveCronEnabled) {
    warnings.push({
      key: "live-cron",
      tone: dryRun ? "warn" : "fail",
      message: "Live cron is enabled.",
    });
  }

  if (packagePriceCount > 0) {
    warnings.push({
      key: "package-price",
      tone: "warn",
      message: `${packagePriceCount} package-price post(s) still need price verification.`,
    });
  }

  if (circadiaServiceCount > 0) {
    warnings.push({
      key: "circadia-service",
      tone: "warn",
      message: `${circadiaServiceCount} Circadia post(s) still need owner service confirmation.`,
    });
  }

  if (circadiaBrandCount > 0) {
    warnings.push({
      key: "circadia-brand",
      tone: "warn",
      message: `${circadiaBrandCount} Circadia post(s) still need brand asset-rights confirmation.`,
    });
  }

  if (invalidAssetCount > 0) {
    warnings.push({
      key: "asset-url",
      tone: "warn",
      message: `${invalidAssetCount} asset(s) have URL or rights issues that block publishing.`,
    });
  }

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Rollout Safety
          </p>
          <h2 className="mt-1 font-display text-3xl text-stone-900">
            Deployment mode and publish blockers
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Keep dry run on, keep cron off, and clear the warning chips below before the first
            manual live publish.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
              dryRun ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {dryRun ? "Dry Run On" : "Dry Run Off"}
          </span>
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
              liveCronEnabled
                ? "bg-amber-100 text-amber-900"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {liveCronEnabled ? "Live Cron Enabled" : "Live Cron Disabled"}
          </span>
          {role ? (
            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Role: {role}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {[metaStatus, storageStatus].map((status) => (
          <div key={status.title} className={`rounded-3xl border p-4 ${toneClasses[status.tone]}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">{status.title}</p>
            <p className="mt-2 text-sm leading-6">{status.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {warnings.length === 0 ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            No rollout warnings are active right now.
          </span>
        ) : (
          warnings.map((warning) => (
            <span
              key={warning.key}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses[warning.tone]}`}
            >
              {warning.message}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
