import "server-only";
import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/gif", "gif"],
]);

export const R2_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type R2UploadResult = {
  key: string;
  url: string;
  contentType: string;
  bytes: number;
};

function env(name: string) {
  return process.env[name]?.trim() || "";
}

/**
 * Accepts either a bare account id or a pasted S3 API endpoint like
 * https://<accountId>.r2.cloudflarestorage.com[/bucket]
 */
export function resolveR2AccountId(raw = env("R2_ACCOUNT_ID")) {
  const value = raw.trim();
  if (!value) return "";
  if (!value.includes("://") && !value.includes("/")) {
    return value.replace(/\.r2\.cloudflarestorage\.com$/i, "");
  }
  try {
    const host = new URL(value).hostname.toLowerCase();
    const match = host.match(/^([a-f0-9]{32})\.r2\.cloudflarestorage\.com$/i);
    if (match) return match[1];
  } catch {
    /* fall through */
  }
  return "";
}

export function r2Configured() {
  return Boolean(
    resolveR2AccountId() &&
      env("R2_ACCESS_KEY_ID") &&
      env("R2_SECRET_ACCESS_KEY") &&
      env("R2_BUCKET") &&
      env("R2_PUBLIC_URL"),
  );
}

export function r2PublicBaseUrl() {
  return env("R2_PUBLIC_URL").replace(/\/$/, "");
}

export function r2PublicHostname() {
  try {
    return new URL(r2PublicBaseUrl()).hostname.toLowerCase();
  } catch {
    return "";
  }
}

let client: S3Client | null = null;
let clientKey = "";

function getClient() {
  const accountId = resolveR2AccountId();
  if (!accountId || !r2Configured()) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID to your 32-char account id (not the full endpoint URL), plus R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_URL.",
    );
  }
  const key = [
    accountId,
    env("R2_ACCESS_KEY_ID"),
    env("R2_SECRET_ACCESS_KEY"),
    env("R2_BUCKET"),
  ].join("|");
  if (!client || clientKey !== key) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env("R2_ACCESS_KEY_ID"),
        secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
      },
    });
    clientKey = key;
  }
  return client;
}

export function isAllowedImageType(type: string) {
  return ALLOWED_TYPES.has(type.toLowerCase());
}

function extensionFor(type: string, filename?: string) {
  const mapped = ALLOWED_TYPES.get(type.toLowerCase());
  if (mapped) return mapped;
  const fromName = filename?.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  return "bin";
}

function buildObjectKey(folder: string, ext: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "") || "uploads";
  return `${safeFolder}/${stamp}/${randomUUID()}.${ext}`;
}

/** Upload a binary image buffer to Cloudflare R2 and return its public URL. */
export async function uploadImageToR2(input: {
  body: Buffer | Uint8Array;
  contentType: string;
  filename?: string;
  folder?: string;
}): Promise<R2UploadResult> {
  if (!isAllowedImageType(input.contentType)) {
    throw new Error("Only JPEG, PNG, WebP, AVIF or GIF images are allowed.");
  }
  if (input.body.byteLength <= 0 || input.body.byteLength > R2_MAX_BYTES) {
    throw new Error(`Image must be between 1 byte and ${R2_MAX_BYTES / (1024 * 1024)}MB.`);
  }

  const ext = extensionFor(input.contentType, input.filename);
  const key = buildObjectKey(input.folder ?? "products", ext);
  const body = Buffer.isBuffer(input.body) ? input.body : Buffer.from(input.body);

  await getClient().send(
    new PutObjectCommand({
      Bucket: env("R2_BUCKET"),
      Key: key,
      Body: body,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${r2PublicBaseUrl()}/${key}`,
    contentType: input.contentType,
    bytes: body.byteLength,
  };
}
