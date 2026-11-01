import "server-only";
import { randomUUID } from "node:crypto";
import { getRedis, redisDel, redisGetStrict, redisSetStrict } from "@/lib/redis";
import { SESSION_TTL_SECONDS } from "@/lib/auth/token";

function key(userId: string) {
  return `admin-sv:${userId}`;
}

/** New login generation. Older admin cookies for this user stop working. */
export async function issueAdminSessionVersion(userId: string): Promise<string | null> {
  const sv = randomUUID();
  if (process.env.NODE_ENV === "production" && !getRedis()) return null;
  const saved = await redisSetStrict(key(userId), sv, SESSION_TTL_SECONDS);
  if (!saved) return null;
  const stored = await redisGetStrict(key(userId));
  return stored === sv ? sv : null;
}

export async function adminSessionVersionMatches(userId: string, sv: string) {
  if (!sv) return false;
  if (process.env.NODE_ENV === "production" && !getRedis()) return false;
  const current = await redisGetStrict(key(userId));
  return current === sv;
}

export async function revokeAdminSessions(userId: string) {
  await redisDel(key(userId));
}
