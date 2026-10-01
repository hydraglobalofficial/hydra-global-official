"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyAdminMasterKey } from "@/lib/auth/master-key";
import { createSession, destroySession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema, registerSchema, invalid, type FormState } from "@/lib/validations";

const BCRYPT_COST = 12;

// Compared against when the account doesn't exist, so response timing doesn't reveal valid accounts.
let dummyHash: string | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync("hydra-timing-equalizer", BCRYPT_COST));

function looksLikeEmail(value: string) {
  return value.includes("@");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("admin-login", 5, 15 * 60_000);
  if (!limited.ok) return { status: "error", message: "Too many login attempts. Try again in 15 minutes." };

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Invalid username/email or password." };

  const id = parsed.data.identifier.trim().toLowerCase();
  const user = looksLikeEmail(id)
    ? await db.user.findUnique({ where: { email: id } })
    : await db.user.findUnique({ where: { username: id } });

  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? getDummyHash());
  if (!user || !ok || (user.role !== "OWNER" && user.role !== "STAFF")) {
    return { status: "error", message: "Invalid username/email or password." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("admin-register", 3, 60 * 60_000);
  if (!limited.ok) return { status: "error", message: "Too many registration attempts. Try again later." };

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  if (!verifyAdminMasterKey(parsed.data.masterKey)) {
    return { status: "error", message: "Invalid master key." };
  }

  const existing = await db.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
    },
    select: { id: true },
  });
  if (existing) {
    return { status: "error", message: "Username or email is already registered." };
  }

  const adminCount = await db.user.count({ where: { role: { in: ["OWNER", "STAFF"] } } });
  const role = adminCount === 0 ? "OWNER" : "STAFF";
  const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_COST);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      username: parsed.data.username,
      email: parsed.data.email,
      passwordHash,
      role,
    },
  });

  if (user.role !== "OWNER" && user.role !== "STAFF") {
    return { status: "error", message: "Account created but is not an admin role." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
