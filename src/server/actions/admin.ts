"use server";

import { randomInt } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { invalid, productSchema, type FormState } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { CATALOG_TAG, CONTENT_TAG } from "@/server/queries/catalog";
import { Prisma } from "@/generated/prisma/client";

const lines = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function refreshCatalog(slug?: string) {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/product/${slug}`);
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function saveProduct(productId: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData),
    featured: formData.get("featured") === "on",
    deviceIds: formData.getAll("deviceIds"),
  });
  if (!parsed.success) return invalid(parsed.error);

  const { deviceIds, highlights, imageUrls, compareAtPrice, tagline, ...data } = parsed.data;
  const images = lines(imageUrls).map((url, position) => ({ url, alt: data.name, position }));

  try {
    const product = await db.$transaction(async (tx) => {
      const base = {
        ...data,
        tagline: tagline || null,
        compareAtPrice: compareAtPrice ?? null,
        highlights: lines(highlights),
      };
      if (productId) {
        await tx.productDevice.deleteMany({ where: { productId } });
        await tx.productImage.deleteMany({ where: { productId } });
        return tx.product.update({
          where: { id: productId },
          data: {
            ...base,
            devices: { create: deviceIds.map((deviceId) => ({ deviceId })) },
            images: { create: images },
          },
        });
      }
      return tx.product.create({
        data: {
          ...base,
          devices: { create: deviceIds.map((deviceId) => ({ deviceId })) },
          images: { create: images },
        },
      });
    });
    refreshCatalog(product.slug);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "Slug or SKU is already in use by another product." };
    }
    throw error;
  }

  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin(["OWNER"]);
  const id = String(formData.get("id"));
  const hasOrders = await db.orderItem.count({ where: { productId: id } });
  // Products with order history are archived, never deleted, to keep records intact.
  if (hasOrders) await db.product.update({ where: { id }, data: { status: "ARCHIVED" } });
  else await db.product.delete({ where: { id } });
  refreshCatalog();
  redirect("/admin/products");
}

// ─── Taxonomy ────────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = z.string().trim().min(2).max(60).parse(formData.get("name"));
  const description = String(formData.get("description") ?? "").trim() || null;
  await db.category.create({ data: { name, slug: slugify(name), description, position: await db.category.count() } });
  refreshCatalog();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin(["OWNER"]);
  const id = String(formData.get("id"));
  if (await db.product.count({ where: { categoryId: id } })) return;
  await db.category.delete({ where: { id } });
  refreshCatalog();
}

export async function createDevice(formData: FormData) {
  await requireAdmin();
  const data = z
    .object({
      brand: z.enum(["APPLE", "SAMSUNG"]),
      series: z.string().trim().min(2).max(60),
      model: z.string().trim().min(2).max(80),
    })
    .parse(Object.fromEntries(formData));
  await db.device.create({ data: { ...data, slug: slugify(data.model), position: await db.device.count({ where: { brand: data.brand } }) } });
  refreshCatalog();
}

export async function deleteDevice(formData: FormData) {
  await requireAdmin(["OWNER"]);
  await db.device.delete({ where: { id: String(formData.get("id")) } });
  refreshCatalog();
}

// ─── Orders ──────────────────────────────────────────────────────────────────

const orderUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED", "FAILED"]),
  fulfillmentNote: z.string().trim().max(2000).optional(),
});

export async function updateOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = orderUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...data } = parsed.data;

  await db.$transaction(async (tx) => {
    const current = await tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
    const restock = (s: string) => s === "CANCELLED" || s === "RETURNED";
    // Return stock to inventory exactly once when an order is cancelled/returned.
    if (restock(data.status) && !restock(current.status)) {
      for (const item of current.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity }, soldCount: { decrement: item.quantity } } });
        if (item.variantId) await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
      }
    }
    await tx.order.update({ where: { id }, data: { ...data, fulfillmentNote: data.fulfillmentNote || null } });
  });

  updateTag(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  return { status: "success", message: "Order updated." };
}

// ─── Inquiries & reviews ─────────────────────────────────────────────────────

export async function setInquiryStatus(formData: FormData) {
  await requireAdmin();
  const { id, status } = z
    .object({ id: z.string(), status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]) })
    .parse(Object.fromEntries(formData));
  await db.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

export async function moderateReview(formData: FormData) {
  await requireAdmin();
  const { id, status } = z
    .object({ id: z.string(), status: z.enum(["APPROVED", "REJECTED"]) })
    .parse(Object.fromEntries(formData));

  const review = await db.review.update({ where: { id }, data: { status } });
  const agg = await db.review.aggregate({
    where: { productId: review.productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: true,
  });
  const product = await db.product.update({
    where: { id: review.productId },
    data: { ratingAverage: agg._avg.rating ?? 0, ratingCount: agg._count },
  });
  refreshCatalog(product.slug);
}

// ─── Authenticity codes ──────────────────────────────────────────────────────

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function generateCode() {
  let s = "HYD";
  for (let i = 0; i < 9; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return s;
}

export async function generateCodes(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      productId: z.string().min(1, "Choose a product"),
      batch: z.string().trim().min(2).max(40),
      quantity: z.coerce.number().int().min(1).max(5000),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const { productId, batch, quantity } = parsed.data;
  const codes = new Set<string>();
  while (codes.size < quantity) codes.add(generateCode());

  const result = await db.authenticityCode.createMany({
    data: [...codes].map((code) => ({ code, productId, batch })),
    skipDuplicates: true,
  });
  revalidatePath("/admin/verifications");
  return { status: "success", message: `Generated ${result.count} codes in batch “${batch}”. Export them from the table below.` };
}

export async function voidCode(formData: FormData) {
  await requireAdmin();
  await db.authenticityCode.update({ where: { id: String(formData.get("id")) }, data: { status: "VOID" } });
  revalidatePath("/admin/verifications");
}

// ─── Content ─────────────────────────────────────────────────────────────────

export async function saveAnnouncement(formData: FormData) {
  await requireAdmin();
  const data = z
    .object({
      id: z.string().optional(),
      message: z.string().trim().min(3).max(160),
      href: z.string().trim().max(200).optional(),
      position: z.coerce.number().int().min(0).default(0),
    })
    .parse(Object.fromEntries(formData));
  const payload = { message: data.message, href: data.href || null, position: data.position, active: formData.get("active") === "on" };
  if (data.id) await db.announcement.update({ where: { id: data.id }, data: payload });
  else await db.announcement.create({ data: payload });
  updateTag(CONTENT_TAG);
  revalidatePath("/admin/content");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();
  await db.announcement.delete({ where: { id: String(formData.get("id")) } });
  updateTag(CONTENT_TAG);
  revalidatePath("/admin/content");
}

export async function savePage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      slug: z.string().min(1),
      title: z.string().trim().min(2).max(120),
      summary: z.string().trim().max(300).optional(),
      body: z.string().trim().min(10).max(50_000),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const { slug, summary, ...rest } = parsed.data;
  await db.page.update({ where: { slug }, data: { ...rest, summary: summary || null } });
  revalidatePath("/", "layout");
  return { status: "success", message: "Page published." };
}
