import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to sign order receipt links.");
  }
  return value;
}

/** Unforgeable receipt token so /checkout/success?order=… cannot be scraped by number alone. */
export function signOrderAccess(orderNumber: string) {
  return createHmac("sha256", secret()).update(`order-receipt:v1:${orderNumber}`).digest("base64url");
}

export function verifyOrderAccess(orderNumber: string, token: string | undefined) {
  if (!token || typeof token !== "string" || token.length > 128) return false;
  const expected = signOrderAccess(orderNumber);
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
