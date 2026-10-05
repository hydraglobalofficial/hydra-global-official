import "server-only";
import {
  redisDel,
  redisEnabled,
  redisGet,
  redisSAdd,
  redisSMembers,
  redisSet,
} from "@/lib/redis";

/**
 * Professional admin cache (cache-aside + tag invalidation).
 *
 * Keys:  admin:v{N}:entry:{name}
 * Tags:  admin:v{N}:tag:{nav|dashboard|catalog}  → set of entry keys
 *
 * Bump ADMIN_CACHE_VERSION after envelope shape changes.
 */

export const ADMIN_CACHE_VERSION = 1;

export type AdminCacheTag = "nav" | "dashboard" | "catalog";

export type AdminCacheEnvelope<T> = {
  v: number;
  key: string;
  cachedAt: string;
  ttlSeconds: number;
  backend: "redis" | "memory";
  data: T;
};

export type AdminCacheStatus = {
  backend: "redis" | "memory";
  version: number;
  label: string;
};

const NS = `admin:v${ADMIN_CACHE_VERSION}`;

function entryKey(name: string) {
  return `${NS}:entry:${name}`;
}

function tagKey(tag: AdminCacheTag) {
  return `${NS}:tag:${tag}`;
}

export function getAdminCacheStatus(): AdminCacheStatus {
  const redis = redisEnabled();
  return {
    backend: redis ? "redis" : "memory",
    version: ADMIN_CACHE_VERSION,
    label: redis ? "Redis · live" : "Memory · local",
  };
}

export async function adminCacheGet<T>(name: string): Promise<AdminCacheEnvelope<T> | null> {
  const raw = await redisGet(entryKey(name));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminCacheEnvelope<T>;
    if (parsed.v !== ADMIN_CACHE_VERSION || parsed.data === undefined || parsed.data === null) {
      return null;
    }
    return parsed;
  } catch {
    await redisDel(entryKey(name));
    return null;
  }
}

export async function adminCacheSet<T>(
  name: string,
  data: T,
  ttlSeconds: number,
  tags: AdminCacheTag[],
): Promise<AdminCacheEnvelope<T>> {
  const key = entryKey(name);
  const envelope: AdminCacheEnvelope<T> = {
    v: ADMIN_CACHE_VERSION,
    key: name,
    cachedAt: new Date().toISOString(),
    ttlSeconds,
    backend: redisEnabled() ? "redis" : "memory",
    data,
  };
  await redisSet(key, JSON.stringify(envelope), ttlSeconds);
  await Promise.all(tags.map((tag) => redisSAdd(tagKey(tag), key)));
  return envelope;
}

export async function adminCached<T>(
  name: string,
  ttlSeconds: number,
  tags: AdminCacheTag[],
  loader: () => Promise<T>,
): Promise<{ value: T; hit: boolean; backend: "redis" | "memory"; cachedAt: string }> {
  const existing = await adminCacheGet<T>(name);
  if (existing) {
    return {
      value: existing.data,
      hit: true,
      backend: existing.backend,
      cachedAt: existing.cachedAt,
    };
  }
  const data = await loader();
  const envelope = await adminCacheSet(name, data, ttlSeconds, tags);
  return {
    value: data,
    hit: false,
    backend: envelope.backend,
    cachedAt: envelope.cachedAt,
  };
}

export async function adminCacheInvalidate(tags: AdminCacheTag[] | "all" = "all") {
  const list: AdminCacheTag[] = tags === "all" ? ["nav", "dashboard", "catalog"] : [...new Set(tags)];
  const keys = new Set<string>();

  for (const tag of list) {
    for (const member of await redisSMembers(tagKey(tag))) keys.add(member);
    keys.add(tagKey(tag));
  }

  // Known entries for this version (safe even if tag index is empty).
  keys.add(entryKey("badges"));
  keys.add(entryKey("overview"));
  keys.add(entryKey("content-index"));
  if (list.includes("catalog") || tags === "all") keys.add(entryKey("catalog-stats"));

  await redisDel(...keys);
}

export { adminCacheInvalidate as adminCachePurgeAll };
