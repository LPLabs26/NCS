const APP_TIMEZONE_FALLBACK = "America/Los_Angeles";

function requireValue(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function appTimezone(): string {
  return process.env.APP_TIMEZONE ?? APP_TIMEZONE_FALLBACK;
}

export function isProductionEnvironment(nodeEnv = process.env.NODE_ENV): boolean {
  return nodeEnv === "production";
}

export function metaApiVersion(): string {
  return process.env.META_API_VERSION ?? "v25.0";
}

export function isDryRun(): boolean {
  return process.env.DRY_RUN !== "false";
}

export function isLiveCronEnabled(): boolean {
  return process.env.LIVE_CRON_ENABLED === "true";
}

export function hasSupabaseBrowserEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function shouldFailClosedForAdminAuth(
  nodeEnv = process.env.NODE_ENV,
  authConfigured = hasSupabaseBrowserEnv(),
): boolean {
  return isProductionEnvironment(nodeEnv) && !authConfigured;
}

export function hasSupabaseServiceEnv(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasMetaEnv(): boolean {
  return Boolean(
    process.env.IG_USER_ID &&
      process.env.PAGE_ID &&
      process.env.PAGE_ACCESS_TOKEN &&
      process.env.META_APP_ID &&
      process.env.META_APP_SECRET,
  );
}

export function hasStorageEnv(): boolean {
  const awsBucket = process.env.AWS_BUCKET ?? process.env.AWS_S3_BUCKET;
  return Boolean(
    (process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET) ||
      (process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.AWS_REGION &&
        awsBucket),
  );
}

export function getSupabaseBrowserEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function getSupabaseServiceEnv() {
  return {
    url: requireValue("SUPABASE_URL"),
    serviceRoleKey: requireValue("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getMetaEnv() {
  return {
    apiVersion: metaApiVersion(),
    appId: process.env.META_APP_ID ?? "",
    appSecret: process.env.META_APP_SECRET ?? "",
    pageId: requireValue("PAGE_ID"),
    igUserId: requireValue("IG_USER_ID"),
    pageAccessToken: requireValue("PAGE_ACCESS_TOKEN"),
  };
}

export interface StorageEnv {
  provider: "r2" | "aws";
  bucket: string;
  region?: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
}

export function getStorageEnv(): StorageEnv {
  const awsBucket = process.env.AWS_BUCKET ?? process.env.AWS_S3_BUCKET;

  if (
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET
  ) {
    return {
      provider: "r2",
      bucket: process.env.R2_BUCKET,
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      publicBaseUrl: requireValue("ASSET_PUBLIC_BASE_URL"),
    };
  }

  return {
    provider: "aws",
    bucket: awsBucket ?? requireValue("AWS_S3_BUCKET"),
    region: requireValue("AWS_REGION"),
    accessKeyId: requireValue("AWS_ACCESS_KEY_ID"),
    secretAccessKey: requireValue("AWS_SECRET_ACCESS_KEY"),
    publicBaseUrl:
      process.env.ASSET_PUBLIC_BASE_URL ??
      `https://${awsBucket ?? requireValue("AWS_S3_BUCKET")}.s3.${requireValue(
        "AWS_REGION",
      )}.amazonaws.com`,
  };
}

export function getCronSecret(): string {
  return requireValue("CRON_SECRET");
}

export const setupChecklist = [
  "META_API_VERSION",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "META_APP_ID",
  "META_APP_SECRET",
  "PAGE_ID",
  "IG_USER_ID",
  "PAGE_ACCESS_TOKEN",
  "ASSET_PUBLIC_BASE_URL",
  "CRON_SECRET",
  "APP_TIMEZONE",
  "DRY_RUN",
  "LIVE_CRON_ENABLED",
] as const;
