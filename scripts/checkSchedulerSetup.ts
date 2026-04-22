import {
  hasStorageEnv,
  hasSupabaseBrowserEnv,
  hasSupabaseServiceEnv,
  isDryRun,
  isLiveCronEnabled,
} from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/service";
import { analyzePublicAssetUrl } from "@/lib/storage/urlSafety";
import {
  hasFailures,
  loadLocalEnvIfPresent,
  printCheck,
  printHeading,
  type CheckLine,
} from "@/scripts/_socialCli";

loadLocalEnvIfPresent();

const requiredTables = ["posts", "assets", "metrics", "content_templates", "admin_users"] as const;
const requiredPostSafetyColumns =
  "owner_approved,requires_price_verification,price_verified,requires_owner_service_confirmation,owner_service_confirmed,requires_brand_asset_rights,hide_public_product_pricing";

function presenceLine(
  label: string,
  value: string | undefined,
  options: { secret?: boolean; optional?: boolean; fallback?: string } = {},
): CheckLine {
  if (value) {
    return {
      level: "PASS",
      label,
      message: options.secret ? "Present." : `Set to ${value}.`,
    };
  }

  if (options.fallback) {
    return {
      level: "PASS",
      label,
      message: `Not set. Falling back to ${options.fallback}.`,
    };
  }

  return {
    level: options.optional ? "WARN" : "FAIL",
    label,
    message: "Missing.",
  };
}

function runtimeHardFailure(lines: CheckLine[]) {
  const nodeEnv = process.env.NODE_ENV;
  const dryRun = isDryRun();
  const liveCronEnabled = isLiveCronEnabled();

  if (!dryRun) {
    return true;
  }

  if (liveCronEnabled && !dryRun) {
    return true;
  }

  return nodeEnv === "production" && hasFailures(lines);
}

async function checkDatabase() {
  const lines: CheckLine[] = [];

  if (!hasSupabaseServiceEnv()) {
    lines.push({
      level: "WARN",
      label: "Database checks",
      message:
        "Skipped because SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured yet.",
    });
    return { lines, hardFailure: false };
  }

  const client = getServiceSupabase();

  for (const table of requiredTables) {
    const { error } = await client.from(table).select("id", { head: true, count: "exact" });
    lines.push(
      error
        ? {
            level: "FAIL",
            label: `Table ${table}`,
            message: error.message,
          }
        : {
            level: "PASS",
            label: `Table ${table}`,
            message: "Available.",
          },
    );
  }

  const postColumns = await client
    .from("posts")
    .select(requiredPostSafetyColumns, { head: true, count: "exact" })
    .limit(1);

  lines.push(
    postColumns.error
      ? {
          level: "FAIL",
          label: "Post safety columns",
          message: postColumns.error.message,
        }
      : {
          level: "PASS",
          label: "Post safety columns",
          message:
            "Owner approval, pricing, Circadia service confirmation, and asset-rights columns are present.",
        },
  );

  const adminCount = await client
    .from("admin_users")
    .select("id", { head: true, count: "exact" })
    .in("role", ["owner", "admin"]);

  lines.push(
    adminCount.error
      ? {
          level: "WARN",
          label: "Owner/admin allowlist",
          message: adminCount.error.message,
        }
      : (adminCount.count ?? 0) > 0
        ? {
            level: "PASS",
            label: "Owner/admin allowlist",
            message: `${adminCount.count} owner/admin ${adminCount.count === 1 ? "entry" : "entries"} found.`,
          }
        : {
            level: "WARN",
            label: "Owner/admin allowlist",
            message:
              "No owner/admin entries found yet. Run npm run social:add-admin before production use.",
          },
  );

  return {
    lines,
    hardFailure: lines.some((line) => line.level === "FAIL"),
  };
}

async function main() {
  const envLines: CheckLine[] = [
    presenceLine("NODE_ENV", process.env.NODE_ENV),
    presenceLine("APP_TIMEZONE", process.env.APP_TIMEZONE, {
      fallback: "America/Los_Angeles",
    }),
    presenceLine("SUPABASE_URL", process.env.SUPABASE_URL),
    presenceLine("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY, {
      secret: true,
    }),
    presenceLine("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    presenceLine(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { secret: true },
    ),
    presenceLine("META_API_VERSION", process.env.META_API_VERSION),
    presenceLine("META_APP_ID", process.env.META_APP_ID),
    presenceLine("META_APP_SECRET", process.env.META_APP_SECRET, { secret: true }),
    presenceLine("PAGE_ID", process.env.PAGE_ID),
    presenceLine("IG_USER_ID", process.env.IG_USER_ID),
    presenceLine("PAGE_ACCESS_TOKEN", process.env.PAGE_ACCESS_TOKEN, { secret: true }),
    presenceLine("CRON_SECRET", process.env.CRON_SECRET, { secret: true }),
  ];

  const assetBaseUrl = process.env.ASSET_PUBLIC_BASE_URL;
  const assetUrlCheck = analyzePublicAssetUrl(assetBaseUrl);
  envLines.push(
    hasStorageEnv()
      ? {
          level: "PASS",
          label: "Storage credentials",
          message: "R2/S3-style storage credentials are configured.",
        }
      : {
          level: "WARN",
          label: "Storage credentials",
          message:
            "Storage credentials are not fully configured yet. Uploads will stay blocked until R2/S3 env is set.",
        },
  );

  envLines.push(
    assetBaseUrl
      ? assetUrlCheck.ok
        ? {
            level: "PASS",
            label: "ASSET_PUBLIC_BASE_URL",
            message: `${assetBaseUrl} looks safe for Meta publishing.`,
          }
        : {
            level: "FAIL",
            label: "ASSET_PUBLIC_BASE_URL",
            message: assetUrlCheck.issues.join(" "),
          }
      : {
          level: "FAIL",
          label: "ASSET_PUBLIC_BASE_URL",
          message: "Missing.",
        },
  );

  const dryRun = isDryRun();
  const liveCronEnabled = isLiveCronEnabled();
  const safetyLines: CheckLine[] = [
    dryRun
      ? {
          level: "PASS",
          label: "DRY_RUN",
          message: "true. No posts can publish live from scheduler commands.",
        }
      : {
          level: "FAIL",
          label: "DRY_RUN",
          message: "false. Live publishing can occur for approved posts.",
        },
    !liveCronEnabled
      ? {
          level: "PASS",
          label: "LIVE_CRON_ENABLED",
          message: "false. Cron cannot live publish right now.",
        }
      : dryRun
        ? {
            level: "WARN",
            label: "LIVE_CRON_ENABLED",
            message:
              "true while DRY_RUN stays true. Cron is enabled, but dry-run still blocks live publishing.",
          }
        : {
            level: "FAIL",
            label: "LIVE_CRON_ENABLED",
            message:
              "true while DRY_RUN is false. Live cron could publish approved posts.",
          },
  ];

  if (process.env.NODE_ENV === "production" && !hasSupabaseBrowserEnv()) {
    safetyLines.push({
      level: "FAIL",
      label: "Production admin auth",
      message:
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required in production so admin auth can fail closed safely.",
    });
  }

  const { lines: databaseLines, hardFailure: databaseHardFailure } = await checkDatabase();
  const allLines = [...envLines, ...safetyLines, ...databaseLines];

  printHeading("NCS Social Scheduler Setup Check");
  allLines.forEach(printCheck);

  if (runtimeHardFailure(allLines) || databaseHardFailure) {
    console.error(
      "\nUnsafe configuration detected. Fix the FAIL items before deployment or any live publish testing.",
    );
    process.exit(1);
  }

  const failCount = allLines.filter((line) => line.level === "FAIL").length;
  const warnCount = allLines.filter((line) => line.level === "WARN").length;

  console.log(
    `\nSetup check finished with ${failCount} FAIL and ${warnCount} WARN item(s). Review them before owner rollout.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
