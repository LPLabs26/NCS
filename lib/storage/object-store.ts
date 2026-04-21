import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getStorageEnv } from "@/lib/env";
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

export async function uploadAssetBuffer(params: {
  filename: string;
  buffer: Buffer;
  contentType: string;
}) {
  const storage = getStorageEnv();
  const timestamp = new Date().toISOString().slice(0, 10);
  const key = `assets/${timestamp}/${slugify(params.filename)}-${Date.now()}`;

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
  };
}
