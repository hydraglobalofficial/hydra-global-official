import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import {
  isAllowedImageType,
  isAllowedVideoType,
  R2_MAX_BYTES,
  R2_VIDEO_MAX_BYTES,
  r2Configured,
  uploadImageToR2,
  uploadVideoToR2,
} from "@/lib/r2";

export const runtime = "nodejs";

/** All admin media folders publish to Cloudflare R2 (device → R2 public URL). */
const FOLDERS = new Set([
  "products",
  "content",
  "hero",
  "collections",
  "brands",
  "uploads",
  "videos",
  "whatsapp",
]);

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "OWNER" && session.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await rateLimit(`admin-upload:${session.userId}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many uploads. Try again in a minute." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  const kindRaw = String(form.get("kind") ?? "").toLowerCase();
  const isVideo =
    kindRaw === "video" || isAllowedVideoType(file.type) || /\.(mp4|webm|mov)$/i.test(file.name);

  if (!r2Configured()) {
    return NextResponse.json(
      {
        error:
          "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_URL.",
      },
      { status: 503 },
    );
  }

  if (isVideo) {
    if (file.size > R2_VIDEO_MAX_BYTES) {
      return NextResponse.json(
        { error: `Video must be ${R2_VIDEO_MAX_BYTES / (1024 * 1024)}MB or smaller.` },
        { status: 400 },
      );
    }
    if (!isAllowedVideoType(file.type)) {
      return NextResponse.json({ error: "Only MP4, WebM or MOV videos are allowed." }, { status: 400 });
    }
  } else {
    if (file.size > R2_MAX_BYTES) {
      return NextResponse.json(
        { error: `Image must be ${R2_MAX_BYTES / (1024 * 1024)}MB or smaller.` },
        { status: 400 },
      );
    }
    if (!isAllowedImageType(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, AVIF or GIF images are allowed." },
        { status: 400 },
      );
    }
  }

  const rawFolder = String(form.get("folder") ?? (isVideo ? "videos" : "products"));
  const folder = FOLDERS.has(rawFolder) ? rawFolder : isVideo ? "videos" : "uploads";

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = isVideo
      ? await uploadVideoToR2({
          body: buffer,
          contentType: file.type,
          filename: file.name,
          folder,
        })
      : await uploadImageToR2({
          body: buffer,
          contentType: file.type,
          filename: file.name,
          folder,
        });
    return NextResponse.json({
      url: uploaded.url,
      key: uploaded.key,
      bytes: uploaded.bytes,
      contentType: uploaded.contentType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "OWNER" && session.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    configured: r2Configured(),
    maxBytes: R2_MAX_BYTES,
    videoMaxBytes: R2_VIDEO_MAX_BYTES,
    accept: "image/jpeg,image/png,image/webp,image/avif,image/gif",
    videoAccept: "video/mp4,video/webm,video/quicktime",
  });
}
