import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { adminSessionVersionMatches } from "@/lib/auth/session-store";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
  type SessionPayload,
} from "./token";

export type { SessionPayload };

export async function createSession(payload: SessionPayload) {
  const token = await signSession(payload);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, name: true },
  });
  if (!user || (user.role !== "OWNER" && user.role !== "STAFF")) return null;
  if (user.role !== payload.role) return null;
  if (!(await adminSessionVersionMatches(user.id, payload.sv))) return null;

  return { userId: user.id, role: user.role, name: user.name, sv: payload.sv };
});

/** Proxy only does an optimistic check; every admin page and action must call this. */
export async function requireAdmin(
  roles: SessionPayload["role"][] = ["OWNER", "STAFF"],
  options?: { next?: string },
) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) {
    const next = options?.next && options.next.startsWith("/") && !options.next.startsWith("//")
      ? `?next=${encodeURIComponent(options.next)}`
      : "";
    redirect(`/admin/login${next}`);
  }
  return session;
}
