import { createClient } from "@supabase/supabase-js";

import { getSupabaseServiceEnv } from "@/lib/env";
import { loadLocalEnvIfPresent } from "@/scripts/_socialCli";

loadLocalEnvIfPresent();

const DEFAULT_BUCKET = "scheduler-assets";
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
];

async function main() {
  const { url, serviceRoleKey } = getSupabaseServiceEnv();
  const bucket = process.env.SUPABASE_ASSET_BUCKET?.trim() || DEFAULT_BUCKET;
  const publicBaseUrl = `${url.replace(/\/$/, "")}/storage/v1/object/public/${bucket}`;
  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(listError.message);
  }

  const existing = buckets?.find((item) => item.name === bucket);
  if (existing) {
    const { error } = await supabase.storage.updateBucket(bucket, {
      public: true,
      allowedMimeTypes,
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Supabase Storage bucket "${bucket}" already exists and is public.`);
  } else {
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      allowedMimeTypes,
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Created public Supabase Storage bucket "${bucket}".`);
  }

  console.log("Add these non-secret asset env values locally and in Vercel Production:");
  console.log(`SUPABASE_ASSET_BUCKET=${bucket}`);
  console.log(`ASSET_PUBLIC_BASE_URL=${publicBaseUrl}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
