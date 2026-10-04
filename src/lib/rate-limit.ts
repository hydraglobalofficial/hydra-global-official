import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { redisIncr } from "@/lib/redis";

export async function clientFingerprint() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/** Distributed fixed-window limiter via Upstash Redis (in-memory fallback when unset). */
export async function rateLimit(scope: string, limit: number, windowMs: number) {
  const key = `rl:${scope}:${await clientFingerprint()}`;
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const count = await redisIncr(key, windowSeconds);
  return { ok: count <= limit, remaining: Math.max(0, limit - count) };
}
