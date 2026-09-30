"use server";

import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { inquirySchema, newsletterSchema, reviewSchema, invalid, type FormState } from "@/lib/validations";

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("inquiry", 5, 10 * 60_000);
  if (!limited.ok) return { status: "error", message: "You've sent several messages already. Please try again later." };

  // Honeypot: real users never see or fill this field.
  if (formData.get("company")) return { status: "success", message: "Thanks! We'll be in touch shortly." };

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return invalid(parsed.error);
  }

  const { phone, subject, orderNumber, ...rest } = parsed.data;
  await db.inquiry.create({
    data: { ...rest, phone: phone || null, subject: subject || null, orderNumber: orderNumber || null },
  });
  // Hook for transactional email (Resend/SES) once a provider is chosen.

  return { status: "success", message: "Message received. Our team replies within one business day." };
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("newsletter", 5, 10 * 60_000);
  if (!limited.ok) return { status: "error", message: "Too many attempts. Please try again later." };

  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };

  try {
    await db.subscriber.upsert({
      where: { email: parsed.data.email },
      update: { status: "CONFIRMED", confirmedAt: new Date() },
      create: {
        email: parsed.data.email,
        token: randomBytes(24).toString("base64url"),
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });
  } catch {
    return { status: "error", message: "Couldn't save your email right now. Please try again." };
  }
  // Hook: email provider (Resend/SES) can send a welcome note using the token.

  return { status: "success", message: "You're on the list. We'll email launch drops and member offers — no spam." };
}

export async function submitReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("review", 3, 60 * 60_000);
  if (!limited.ok) return { status: "error", message: "Too many reviews submitted. Please try later." };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return invalid(parsed.error);
  }

  const exists = await db.product.count({ where: { id: parsed.data.productId, status: "ACTIVE" } });
  if (!exists) return { status: "error", message: "Product not found." };

  await db.review.create({ data: { ...parsed.data, title: parsed.data.title || null } });
  return { status: "success", message: "Thanks! Your review will appear once it's approved." };
}
