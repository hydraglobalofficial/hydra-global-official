import "server-only";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { uploadRoot } from "@/lib/storage";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export type ResolvedLocalMedia = {
  abs: string;
  contentType: string;
  size: number;
  mtime: Date;
};

function extOf(filePath: string) {
  return path.extname(filePath).slice(1).toLowerCase();
}

/** Resolve a /media key onto the RAID/upload disk. Rejects path traversal. */
export async function resolveLocalMedia(segments: string[]): Promise<ResolvedLocalMedia | null> {
  if (!segments.length || segments.some((part) => !part || part === "." || part === "..")) {
    return null;
  }
  const root = path.resolve(uploadRoot());
  const abs = path.resolve(root, ...segments);
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  if (abs !== root && !abs.startsWith(prefix)) return null;

  const contentType = MIME_BY_EXT[extOf(abs)];
  if (!contentType) return null;

  try {
    const info = await stat(abs);
    if (!info.isFile()) return null;
    return { abs, contentType, size: info.size, mtime: info.mtime };
  } catch {
    return null;
  }
}

export function openLocalMedia(abs: string, start?: number, end?: number) {
  if (start != null && end != null) {
    return createReadStream(abs, { start, end });
  }
  return createReadStream(abs);
}
