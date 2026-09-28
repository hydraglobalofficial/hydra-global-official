"use server";

import { db } from "@/lib/db";
import { clientFingerprint, rateLimit } from "@/lib/rate-limit";
import { verifySchema } from "@/lib/validations";

export type VerifyState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "GENUINE" | "ALREADY_VERIFIED" | "VOID" | "NOT_FOUND";
      code: string;
      product?: { name: string; slug: string; image?: string };
      verifyCount?: number;
      firstVerifiedAt?: string;
    };

export async function verifyProduct(_prev: VerifyState, formData: FormData): Promise<VerifyState> {
  const limited = await rateLimit("verify", 10, 60_000);
  if (!limited.ok) return { status: "error", message: "Too many checks. Please wait a minute and try again." };

  const parsed = verifySchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid code." };
  const code = parsed.data.code;
  const ipHash = await clientFingerprint();

  const record = await db.authenticityCode.findUnique({
    where: { code },
    include: {
      product: { select: { name: true, slug: true, images: { take: 1, orderBy: { position: "asc" } } } },
    },
  });

  if (!record) {
    await db.verificationAttempt.create({ data: { input: code, result: "NOT_FOUND", ipHash } });
    return { status: "NOT_FOUND", code };
  }

  const product = {
    name: record.product.name,
    slug: record.product.slug,
    image: record.product.images[0]?.url,
  };

  if (record.status === "VOID") {
    await db.verificationAttempt.create({ data: { codeId: record.id, input: code, result: "VOID", ipHash } });
    return { status: "VOID", code, product };
  }

  const now = new Date();
  const result = record.verifyCount === 0 ? "GENUINE" : "ALREADY_VERIFIED";
  const updated = await db.authenticityCode.update({
    where: { id: record.id },
    data: {
      verifyCount: { increment: 1 },
      firstVerifiedAt: record.firstVerifiedAt ?? now,
      lastVerifiedAt: now,
      attempts: { create: { input: code, result, ipHash } },
    },
  });

  return {
    status: result,
    code,
    product,
    verifyCount: updated.verifyCount,
    firstVerifiedAt: (updated.firstVerifiedAt ?? now).toISOString(),
  };
}
