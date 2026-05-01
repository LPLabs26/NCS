import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import {
  getLocalAssetFallbackStatus,
  getSupabaseAssetStorageEnv,
  getStorageEnv,
  hasObjectStorageEnv,
  hasSupabaseAssetStorageEnv,
} from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/service";
import { slugify } from "@/lib/utils";

let s3Client: S3Client | null = null;

function getClient(): S3Client {
  if (s3Client) {
    return s3Client;
  }

  const storage = getStorageEnv();
  s3Client = new S3Client({
    region: storage.region ?? "auto",
    endpoint: storage.endpoint,
    forcePathStyle: storage.provider === "r2",
    credentials: {
      accessKeyId: storage.accessKeyId,
      secretAccessKey: storage.secretAccessKey,
    },
  });

  return s3Client;
}

function buildLocalAssetFilename(filename: string): string {
  const extension = extname(filename).toLowerCase();
  const stem = slugify(filename.slice(0, filename.length - extension.length)) || "asset";
  return `${stem}-${Date.now()}${extension}`;
}

function buildAssetObjectKey(filename: string): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  return `assets/${timestamp}/${buildLocalAssetFilename(filename)}`;
}

async function uploadAssetBufferLocally(params: {
  filename: string;
  buffer: Buffer;
  contentType: string;
}) {
  void params.contentType;

  const fallback = getLocalAssetFallbackStatus();
  if (!fallback.enabled || !fallback.baseUrl) {
    throw new Error(fallback.detail);
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const relativeKey = `${timestamp}/${buildLocalAssetFilename(params.filename)}`;
  const localPrefix = "scheduler-assets";
  const filePath = join(process.cwd(), "public", localPrefix, relativeKey);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, params.buffer);

  return {
    key: `${localPrefix}/${relativeKey}`,
    storageUrl: `local://${localPrefix}/${relativeKey}`,
    publicUrl: `${fallback.baseUrl.replace(/\/$/, "")}/${relativeKey}`,
    storageMode: "local-fallback" as const,
  };
}

async function uploadAssetBufferToSupabase(params: {
  filename: string;
  buffer: Buffer;
  contentType: string;
}) {
  const storage = getSupabaseAssetStorageEnv();
  const key = buildAssetObjectKey(params.filename);
  const { error } = await getServiceSupabase()
    .storage
    .from(storage.bucket)
    .upload(key, params.buffer, {
      contentType: params.contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    key,
    storageUrl: `supabase://${storage.bucket}/${key}`,
    publicUrl: `${storage.publicBaseUrl.replace(/\/$/, "")}/${key}`,
    storageMode: "supabase-storage" as const,
  };
}

export async function uploadAssetBuffer(params: {
  filename: string;
  buffer: Buffer;
  contentType: string;
}) {
  if (hasSupabaseAssetStorageEnv()) {
    return uploadAssetBufferToSupabase(params);
  }

  if (!hasObjectStorageEnv()) {
    const fallback = getLocalAssetFallbackStatus();
    if (fallback.enabled) {
      return uploadAssetBufferLocally(params);
    }

    throw new Error(`Asset storage is not configured. ${fallback.detail}`);
  }

  const storage = getStorageEnv();
  const key = buildAssetObjectKey(params.filename);

  await getClient().send(
    new PutObjectCommand({
      Bucket: storage.bucket,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
    }),
  );

  return {
    key,
    storageUrl: `s3://${storage.bucket}/${key}`,
    publicUrl: `${storage.publicBaseUrl.replace(/\/$/, "")}/${key}`,
    storageMode: "object-storage" as const,
  };
}
