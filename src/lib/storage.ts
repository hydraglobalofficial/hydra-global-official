import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildObjectKey,
  extensionFor,
  isAllowedImageType,
  isAllowedVideoType,
  r2Configured,
  uploadImageToR2,
  uploadVideoToR2,
  R2_MAX_BYTES,
  R2_VIDEO_MAX_BYTES,
  type R2UploadResult,
} from "@/lib/r2";

export const MEDIA_MAX_BYTES = R2_MAX_BYTES;
export const MEDIA_VIDEO_MAX_BYTES = R2_VIDEO_MAX_BYTES;
export const MEDIA_PUBLIC_PREFIX = "/media";

export type StorageDriver = "local" | "r2";
export type UploadResult = R2UploadResult;

function env(name: string) {
  return process.env[name]?.trim() || "";
}

/** RAID / VPS disk root. Defaults to ./uploads in the app cwd. */
export function uploadRoot() {
  const raw = env("UPLOAD_DIR");
  return path.resolve(raw || path.join(process.cwd(), "uploads"));
}

export function storageDriver(): StorageDriver {
  const explicit = env("STORAGE_DRIVER").toLowerCase();
  if (explicit === "local") return "local";
  if (explicit === "r2" || r2Configured()) return "r2";
  return "local";
}

export function storageConfigured() {
  return storageDriver() === "local" || r2Configured();
}

export async function ensureUploadRoot() {
  const root = uploadRoot();
  try {
    await mkdir(root, { recursive: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Cannot write uploads to ${root}. Check UPLOAD_DIR / RAID mount permissions. ${message}`);
  }
  return root;
}

function publicUrlForKey(key: string) {
  return `${MEDIA_PUBLIC_PREFIX}/${key}`;
}

async function putToDisk(input: {
  body: Buffer | Uint8Array;
  contentType: string;
  filename?: string;
  folder?: string;
}): Promise<UploadResult> {
  const ext = extensionFor(input.contentType, input.filename);
  const key = buildObjectKey(input.folder ?? "products", ext);
  const root = await ensureUploadRoot();
  const dest = path.join(root, key);
  await mkdir(path.dirname(dest), { recursive: true });
  const body = Buffer.isBuffer(input.body) ? input.body : Buffer.from(input.body);
  await writeFile(dest, body);
  return {
    key,
    url: publicUrlForKey(key),
    contentType: input.contentType,
    bytes: body.byteLength,
  };
}

export async function uploadImage(input: {
  body: Buffer | Uint8Array;
  contentType: string;
  filename?: string;
  folder?: string;
}): Promise<UploadResult> {
  if (!isAllowedImageType(input.contentType)) {
    throw new Error("Only JPEG, PNG, WebP, AVIF or GIF images are allowed.");
  }
  if (input.body.byteLength <= 0 || input.body.byteLength > MEDIA_MAX_BYTES) {
    throw new Error(`Image must be between 1 byte and ${MEDIA_MAX_BYTES / (1024 * 1024)}MB.`);
  }
  if (storageDriver() === "r2") return uploadImageToR2(input);
  return putToDisk(input);
}

export async function uploadVideo(input: {
  body: Buffer | Uint8Array;
  contentType: string;
  filename?: string;
  folder?: string;
}): Promise<UploadResult> {
  if (!isAllowedVideoType(input.contentType)) {
    throw new Error("Only MP4, WebM or MOV videos are allowed.");
  }
  if (input.body.byteLength <= 0 || input.body.byteLength > MEDIA_VIDEO_MAX_BYTES) {
    throw new Error(`Video must be between 1 byte and ${MEDIA_VIDEO_MAX_BYTES / (1024 * 1024)}MB.`);
  }
  if (storageDriver() === "r2") return uploadVideoToR2({ ...input, folder: input.folder ?? "videos" });
  return putToDisk({ ...input, folder: input.folder ?? "videos" });
}
