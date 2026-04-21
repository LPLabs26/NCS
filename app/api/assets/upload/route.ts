import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth";
import { createAssetRecord } from "@/lib/data/posts";
import { uploadAssetBuffer } from "@/lib/storage/object-store";
import { inspectUploadedAsset } from "@/lib/storage/media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAuthenticatedUser();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    const inspected = await inspectUploadedAsset(file);
    const uploaded = await uploadAssetBuffer({
      filename: inspected.filename,
      buffer: inspected.buffer,
      contentType: inspected.contentType,
    });

    const asset = await createAssetRecord({
      filename: inspected.filename,
      type: inspected.type,
      storage_url: uploaded.storageUrl,
      public_url: uploaded.publicUrl,
      aspect_ratio: inspected.aspectRatio,
      duration_sec: inspected.durationSec,
      width: inspected.width,
      height: inspected.height,
      alt_text: String(formData.get("alt_text") ?? "") || null,
      checksum: inspected.checksum,
      usage_rights_confirmed: formData.get("usage_rights_confirmed") === "true",
    });

    return NextResponse.json({ asset });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
