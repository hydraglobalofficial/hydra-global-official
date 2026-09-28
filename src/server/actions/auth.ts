"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema, type FormState } from "@/lib/validations";

// Compared against when the email doesn't exist, so response timing doesn't reveal valid accounts.
let dummyHash: string | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync("hydra-timing-equalizer", 12));

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("admin-login", 5, 15 * 60_000);
  if (!limited.ok) return { status: "error", message: "Too many login attempts. Try again in 15 minutes." };

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Invalid email or password." };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? getDummyHash());
  if (!user || !ok || (user.role !== "OWNER" && user.role !== "STAFF")) {
    return { status: "error", message: "Invalid email or password." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
