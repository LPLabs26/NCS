import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFile, rm } from "node:fs/promises";

import ffprobe from "ffprobe-static";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

import type { AssetRow, PostRow } from "@/types/database";
import { checksumHex } from "@/lib/utils";

const execFileAsync = promisify(execFile);

export interface InspectedAsset {
  buffer: Buffer;
  type: "image" | "video";
  contentType: string;
  filename: string;
  checksum: string;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  aspectRatio: string | null;
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function aspectRatioString(width: number, height: number): string {
  const gcd = greatestCommonDivisor(width, height);
  return `${Math.round(width / gcd)}:${Math.round(height / gcd)}`;
}

function numericAspectRatio(value: string | null): number | null {
  if (!value || !value.includes(":")) {
    return null;
  }

  const [width, height] = value.split(":").map(Number);
  if (!width || !height) {
    return null;
  }

  return width / height;
}

async function inspectImage(buffer: Buffer, filename: string, contentType: string): Promise<InspectedAsset> {
  const metadata = await sharp(buffer).metadata();
  return {
    buffer,
    filename,
    contentType,
    type: "image",
    checksum: checksumHex(buffer),
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    durationSec: null,
    aspectRatio:
      metadata.width && metadata.height
        ? aspectRatioString(metadata.width, metadata.height)
        : null,
  };
}

async function inspectVideo(buffer: Buffer, filename: string, contentType: string): Promise<InspectedAsset> {
  if (!ffprobe.path) {
    throw new Error("ffprobe is unavailable, so video metadata could not be inspected.");
  }

  const tempPath = join(tmpdir(), `${randomUUID()}-${filename}`);

  await writeFile(tempPath, buffer);

  try {
    const { stdout } = await execFileAsync(ffprobe.path, [
      "-v",
      "error",
      "-show_entries",
      "stream=width,height,codec_name:format=duration,format_name",
      "-of",
      "json",
      tempPath,
    ]);

    const parsed = JSON.parse(stdout) as {
      streams?: Array<{ width?: number; height?: number; codec_name?: string }>;
      format?: { duration?: string; format_name?: string };
    };

    const videoStream = parsed.streams?.find((stream) => stream.width && stream.height);
    const width = videoStream?.width ?? null;
    const height = videoStream?.height ?? null;

    return {
      buffer,
      filename,
      contentType,
      type: "video",
      checksum: checksumHex(buffer),
      width,
      height,
      durationSec: parsed.format?.duration ? Number(parsed.format.duration) : null,
      aspectRatio: width && height ? aspectRatioString(width, height) : null,
    };
  } finally {
    await rm(tempPath, { force: true });
  }
}

export async function inspectUploadedAsset(file: File): Promise<InspectedAsset> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const guessedType = await fileTypeFromBuffer(buffer);
  const contentType = guessedType?.mime ?? file.type ?? "application/octet-stream";

  if (contentType.startsWith("image/")) {
    return inspectImage(buffer, file.name, contentType);
  }

  if (contentType.startsWith("video/")) {
    return inspectVideo(buffer, file.name, contentType);
  }

  throw new Error(
    "Unsupported asset type. Upload a JPEG/PNG/WebP image or an MP4/MOV video.",
  );
}

export function validateAssetsForPost(post: PostRow, assets: AssetRow[]): string[] {
  const errors: string[] = [];

  if (post.status !== "approved") {
    errors.push("Only approved posts can be published.");
  }

  if (assets.length === 0) {
    errors.push("Post is missing required media.");
    return errors;
  }

  for (const asset of assets) {
    if (!asset.usage_rights_confirmed) {
      errors.push(`Usage rights are not confirmed for ${asset.filename}.`);
    }

    try {
      const publicUrl = new URL(asset.public_url);
      if (publicUrl.protocol !== "https:") {
        errors.push(`${asset.filename} must use an HTTPS public URL.`);
      }
    } catch {
      errors.push(`${asset.filename} does not have a valid public URL.`);
    }
  }

  if (post.format === "image") {
    if (assets.length !== 1 || assets[0]?.type !== "image") {
      errors.push("Image posts require exactly one image asset.");
    }
  }

  if (post.format === "carousel") {
    if (assets.length < 2 || assets.length > 10) {
      errors.push("Carousel posts require between 2 and 10 media assets.");
    }
  }

  if (post.format === "reel") {
    const reelAsset = assets[0];
    if (assets.length !== 1 || reelAsset?.type !== "video") {
      errors.push("Reels require exactly one video asset.");
    } else {
      const extension = reelAsset.filename.toLowerCase();
      if (!extension.endsWith(".mp4") && !extension.endsWith(".mov")) {
        errors.push("Reels must use an MP4 or MOV video file.");
      }
      if ((reelAsset.duration_sec ?? 0) < 3 || (reelAsset.duration_sec ?? 0) > 900) {
        errors.push("Reels must be between 3 seconds and 15 minutes long.");
      }

      const ratio = numericAspectRatio(reelAsset.aspect_ratio);
      if (ratio === null || ratio < 0.01 || ratio > 10) {
        errors.push("Reels must use a supported aspect ratio.");
      }
    }
  }

  if (post.format === "story") {
    const storyAsset = assets[0];
    if (assets.length !== 1) {
      errors.push("Stories require exactly one asset.");
    } else if (storyAsset.type === "video") {
      if ((storyAsset.duration_sec ?? 0) < 3 || (storyAsset.duration_sec ?? 0) > 60) {
        errors.push("Story videos must be between 3 and 60 seconds long.");
      }
    }
  }

  return errors;
}
