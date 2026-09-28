import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };

// In-memory fixed-window limiter. Good for a single instance; swap for
// Redis/Upstash when running multiple replicas.
const buckets = new Map<string, Bucket>();

export async function clientFingerprint() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function rateLimit(scope: string, limit: number, windowMs: number) {
  const key = `${scope}:${await clientFingerprint()}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  bucket.count += 1;
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
  return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) };
}
