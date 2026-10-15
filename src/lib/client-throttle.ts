/**
 * Client-side fixed-window throttle (anti-spam / button mashing).
 * Survives within the tab session; keyed by action name.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export type ThrottleResult =
  | { ok: true; remaining: number }
  | { ok: false; remaining: 0; retryAfterMs: number };

/** Allow at most `limit` calls per `windowMs` for `key`. */
export function clientThrottle(key: string, limit = 3, windowMs = 60_000): ThrottleResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0]!;
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterMs: Math.max(0, windowMs - (now - oldest)) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.max(0, limit - bucket.timestamps.length) };
}

export function throttleMessage(retryAfterMs: number) {
  const sec = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return `Slow down — try again in ${sec}s.`;
}
