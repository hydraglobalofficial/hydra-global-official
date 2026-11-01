import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { redisIncr } from "@/lib/redis";

/**
 * Client address for rate limits.
 * Nginx overwrites X-Real-IP from the TCP peer. The left-most X-Forwarded-For
 * value is whatever the caller sent, so it is never used.
 */
export async function clientFingerprint() {
  const h = await headers();
  const real = h.get("x-real-ip")?.trim() || "";
  const ip = real && !/[\s,]/.test(real) ? real : "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/** Distributed fixed-window limiter. Production requires Redis; otherwise the request is refused. */
export async function rateLimit(scope: string, limit: number, windowMs: number) {
  const key = `rl:${scope}:${await clientFingerprint()}`;
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const count = await redisIncr(key, windowSeconds);
  if (count == null) return { ok: false, remaining: 0 };
  return { ok: count <= limit, remaining: Math.max(0, limit - count) };
}
