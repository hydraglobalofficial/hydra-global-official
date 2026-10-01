import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "hydra_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  userId: string;
  role: "OWNER" | "STAFF";
  name: string;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .setSubject(payload.userId)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      maxTokenAge: `${SESSION_TTL_SECONDS}s`,
    });
    if (payload.role !== "OWNER" && payload.role !== "STAFF") return null;
    if (!payload.sub || !payload.jti) return null;
    return { userId: String(payload.userId), role: payload.role, name: String(payload.name) };
  } catch {
    return null;
  }
}
