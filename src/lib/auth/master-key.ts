import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

/** Constant-time compare for master keys (and similar secrets). */
export function safeEqualString(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function getAdminMasterKey() {
  const key = process.env.ADMIN_MASTER_KEY?.trim();
  if (!key || key.length < 16) {
    throw new Error("ADMIN_MASTER_KEY must be set to a random string of at least 16 characters.");
  }
  return key;
}

export function verifyAdminMasterKey(candidate: string) {
  try {
    return safeEqualString(candidate, getAdminMasterKey());
  } catch {
    return false;
  }
}
