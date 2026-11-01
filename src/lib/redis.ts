import "server-only";
import { Redis as UpstashRedis } from "@upstash/redis";
import IoRedis from "ioredis";

type MemoryEntry = { value: string; expiresAt: number };

/** Small surface used by rate limits, sessions, and the admin cache. */
type Store = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(keys: string[]): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
  sadd(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
};

const memory = new Map<string, MemoryEntry>();
const PREFIX = "hydra:";

let client: Store | null | undefined;

function asString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function upstashStore(url: string, token: string): Store {
  const redis = new UpstashRedis({ url, token });
  return {
    async get(key) {
      return asString(await redis.get(key));
    },
    async set(key, value, ttlSeconds) {
      await redis.set(key, value, { ex: Math.max(1, Math.floor(ttlSeconds)) });
    },
    async del(keys) {
      if (keys.length) await redis.del(...keys);
    },
    async incr(key) {
      return redis.incr(key);
    },
    async expire(key, ttlSeconds) {
      await redis.expire(key, Math.max(1, Math.floor(ttlSeconds)));
    },
    async sadd(key, member) {
      await redis.sadd(key, member);
    },
    async smembers(key) {
      return (await redis.smembers(key)).map(String);
    },
  };
}

function localStore(url: string): Store {
  const redis = new IoRedis(url, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    lazyConnect: true,
    connectTimeout: 2_000,
  });
  redis.on("error", (error) => {
    console.error("[redis]", error.message);
  });
  return {
    async get(key) {
      return redis.get(key);
    },
    async set(key, value, ttlSeconds) {
      await redis.set(key, value, "EX", Math.max(1, Math.floor(ttlSeconds)));
    },
    async del(keys) {
      if (keys.length) await redis.del(...keys);
    },
    async incr(key) {
      return redis.incr(key);
    },
    async expire(key, ttlSeconds) {
      await redis.expire(key, Math.max(1, Math.floor(ttlSeconds)));
    },
    async sadd(key, member) {
      await redis.sadd(key, member);
    },
    async smembers(key) {
      return redis.smembers(key);
    },
  };
}

function createClient(): Store | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (upstashUrl && upstashToken) return upstashStore(upstashUrl, upstashToken);
  const localUrl = process.env.REDIS_URL?.trim();
  if (localUrl) return localStore(localUrl);
  return null;
}

/** Upstash when those two vars are set, otherwise REDIS_URL (VPS redis-server). */
export function getRedis(): Store | null {
  if (client === undefined) client = createClient();
  return client;
}

export function redisEnabled() {
  return getRedis() !== null;
}

function k(key: string) {
  return `${PREFIX}${key}`;
}

function memoryGet(key: string): string | null {
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }
  return hit.value;
}

function memorySet(key: string, value: string, ttlSeconds: number) {
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  if (memory.size > 5_000) {
    const now = Date.now();
    for (const [entryKey, entry] of memory) {
      if (entry.expiresAt <= now) memory.delete(entryKey);
    }
  }
}

/** Like redisGet, but production does not read the in-memory fallback. */
export async function redisGetStrict(key: string): Promise<string | null> {
  const redis = getRedis();
  const prod = process.env.NODE_ENV === "production";
  if (!redis) return prod ? null : memoryGet(k(key));
  try {
    const value = await redis.get(k(key));
    return value ?? null;
  } catch (error) {
    console.error("[redisGetStrict]", error);
    return prod ? null : memoryGet(k(key));
  }
}

export async function redisGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return memoryGet(k(key));
  try {
    const value = await redis.get(k(key));
    return value ?? null;
  } catch (error) {
    console.error("[redisGet]", error);
    return memoryGet(k(key));
  }
}

/** Like redisSet, but production reports failure instead of writing only to memory. */
export async function redisSetStrict(key: string, value: string, ttlSeconds: number): Promise<boolean> {
  const redis = getRedis();
  const prod = process.env.NODE_ENV === "production";
  if (!redis) {
    if (prod) return false;
    memorySet(k(key), value, ttlSeconds);
    return true;
  }
  try {
    await redis.set(k(key), value, Math.max(1, Math.floor(ttlSeconds)));
    return true;
  } catch (error) {
    console.error("[redisSetStrict]", error);
    if (!prod) memorySet(k(key), value, ttlSeconds);
    return !prod;
  }
}

export async function redisSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memorySet(k(key), value, ttlSeconds);
    return;
  }
  try {
    await redis.set(k(key), value, Math.max(1, Math.floor(ttlSeconds)));
  } catch (error) {
    console.error("[redisSet]", error);
    memorySet(k(key), value, ttlSeconds);
  }
}

export async function redisDel(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const namespaced = keys.map(k);
  const redis = getRedis();
  if (!redis) {
    for (const key of namespaced) {
      memory.delete(key);
      memorySets.delete(key);
    }
    return;
  }
  try {
    await redis.del(namespaced);
  } catch (error) {
    console.error("[redisDel]", error);
    for (const key of namespaced) {
      memory.delete(key);
      memorySets.delete(key);
    }
  }
}

export async function redisGetJson<T>(key: string): Promise<T | null> {
  const raw = await redisGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    await redisDel(key);
    return null;
  }
}

export async function redisSetJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await redisSet(key, JSON.stringify(value), ttlSeconds);
}

/** Cache-aside helper: Redis first, else loader + write-through. */
export async function redisCached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const hit = await redisGetJson<T>(key);
  if (hit !== null) return hit;
  const value = await loader();
  await redisSetJson(key, value, ttlSeconds);
  return value;
}

const memorySets = new Map<string, Set<string>>();

export async function redisSAdd(key: string, member: string, ttlSeconds = 86_400): Promise<void> {
  const redis = getRedis();
  const fullKey = k(key);
  if (!redis) {
    const set = memorySets.get(fullKey) ?? new Set<string>();
    set.add(member);
    memorySets.set(fullKey, set);
    return;
  }
  try {
    await redis.sadd(fullKey, member);
    await redis.expire(fullKey, Math.max(1, Math.floor(ttlSeconds)));
  } catch (error) {
    console.error("[redisSAdd]", error);
  }
}

export async function redisSMembers(key: string): Promise<string[]> {
  const redis = getRedis();
  const fullKey = k(key);
  if (!redis) return [...(memorySets.get(fullKey) ?? [])];
  try {
    return await redis.smembers(fullKey);
  } catch (error) {
    console.error("[redisSMembers]", error);
    return [...(memorySets.get(fullKey) ?? [])];
  }
}

function memoryIncr(fullKey: string, windowSeconds: number) {
  const raw = memoryGet(fullKey);
  const count = raw ? Number(raw) + 1 : 1;
  if (!raw) memorySet(fullKey, "1", windowSeconds);
  else {
    const hit = memory.get(fullKey);
    if (hit) hit.value = String(count);
  }
  return count;
}

/**
 * Fixed-window counter. Production never falls back to process memory:
 * a missing or failed Redis returns null so callers can reject the request.
 */
export async function redisIncr(key: string, windowSeconds: number): Promise<number | null> {
  const redis = getRedis();
  const fullKey = k(key);
  const prod = process.env.NODE_ENV === "production";
  if (!redis) {
    if (prod) return null;
    return memoryIncr(fullKey, windowSeconds);
  }
  try {
    const count = await redis.incr(fullKey);
    if (count === 1) await redis.expire(fullKey, Math.max(1, Math.floor(windowSeconds)));
    return count;
  } catch (error) {
    console.error("[redisIncr]", error);
    if (prod) return null;
    return memoryIncr(fullKey, windowSeconds);
  }
}
