"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { invalid, productSchema, type FormState } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { CATALOG_TAG, CONTENT_TAG } from "@/server/queries/catalog";
import { Prisma } from "@/generated/prisma/client";
import type {
  AboutContent,
  CollectionsContent,
  HowItWorksContent,
  NewsletterContent,
} from "@/content/site-sections";

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

function linesFrom(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((v) => String(v).trim())
    .filter(Boolean);
}

function pairsFrom(formData: FormData, a: string, b: string) {
  const left = formData.getAll(a).map(String);
  const right = formData.getAll(b).map(String);
  return left
    .map((value, i) => ({ value: value.trim(), label: (right[i] ?? "").trim() }))
    .filter((row) => row.value && row.label);
}

export async function saveAboutSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const stats = pairsFrom(formData, "statValue", "statLabel");
  const missionBullets = linesFrom(formData, "missionBullet");
  const visionBullets = linesFrom(formData, "visionBullet");
  const highlights = String(formData.get("manifestoHighlights") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const valueTitles = formData.getAll("valueTitle").map(String);
  const valueKeywords = formData.getAll("valueKeyword").map(String);
  const valueTexts = formData.getAll("valueText").map(String);
  const values = valueTitles
    .map((title, i) => ({
      title: title.trim(),
      keyword: (valueKeywords[i] ?? "").trim(),
      text: (valueTexts[i] ?? "").trim(),
    }))
    .filter((v) => v.title && v.keyword && v.text);

  const divisionTitles = formData.getAll("divisionTitle").map(String);
  const divisionTexts = formData.getAll("divisionText").map(String);
  const divisionHrefs = formData.getAll("divisionHref").map(String);
  const divisions = divisionTitles
    .map((title, i) => ({
      title: title.trim(),
      text: (divisionTexts[i] ?? "").trim(),
      href: (divisionHrefs[i] ?? "").trim(),
    }))
    .filter((d) => d.title && d.text && d.href);

  const journeyYears = formData.getAll("journeyYear").map(String);
  const journeyTitles = formData.getAll("journeyTitle").map(String);
  const journeyTexts = formData.getAll("journeyText").map(String);
  const journeyFuture = formData.getAll("journeyFuture").map(String);
  const journey = journeyYears
    .map((year, i) => ({
      year: year.trim(),
      title: (journeyTitles[i] ?? "").trim(),
      text: (journeyTexts[i] ?? "").trim(),
      ...(journeyFuture[i] === "yes" ? { future: true as const } : {}),
    }))
    .filter((j) => j.year && j.title && j.text);

  const data: AboutContent = {
    hero: {
      eyebrow: String(formData.get("heroEyebrow") ?? "").trim(),
      title: String(formData.get("heroTitle") ?? "").trim(),
      titleAccent: String(formData.get("heroTitleAccent") ?? "").trim(),
      description: String(formData.get("heroDescription") ?? "").trim(),
    },
    stats,
    manifesto: {
      text: String(formData.get("manifestoText") ?? "").trim(),
      highlight: highlights,
    },
    mission: {
      title: String(formData.get("missionTitle") ?? "").trim(),
      body: String(formData.get("missionBody") ?? "").trim(),
      bullets: missionBullets,
    },
    vision: {
      title: String(formData.get("visionTitle") ?? "").trim(),
      body: String(formData.get("visionBody") ?? "").trim(),
      bullets: visionBullets,
    },
    valuesIntro: {
      title: String(formData.get("valuesTitle") ?? "").trim(),
      titleMuted: String(formData.get("valuesTitleMuted") ?? "").trim(),
      description: String(formData.get("valuesDescription") ?? "").trim(),
    },
    values,
    divisions,
    journey,
    careers: {
      title: String(formData.get("careersTitle") ?? "").trim(),
      text: String(formData.get("careersText") ?? "").trim(),
      cta: String(formData.get("careersCta") ?? "").trim(),
    },
    partner: {
      title: String(formData.get("partnerTitle") ?? "").trim(),
      text: String(formData.get("partnerText") ?? "").trim(),
      cta: String(formData.get("partnerCta") ?? "").trim(),
    },
  };

  if (!data.hero.title || !data.manifesto.text || values.length === 0) {
    return { status: "error", message: "Hero, manifesto and at least one value are required." };
  }

  await db.siteSection.upsert({
    where: { key: "about" },
    create: { key: "about", title: "About page", data },
    update: { data, title: "About page" },
  });
  updateTag(CONTENT_TAG);
  revalidatePath("/about");
  revalidatePath("/admin/content");
  return { status: "success", message: "About page published." };
}

export async function saveHowItWorksSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const titles = formData.getAll("stepTitle").map(String);
  const texts = formData.getAll("stepText").map(String);
  const steps = titles
    .map((title, i) => ({ title: title.trim(), text: (texts[i] ?? "").trim() }))
    .filter((s) => s.title && s.text);

  const data: HowItWorksContent = {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    titleMuted: String(formData.get("titleMuted") ?? "").trim(),
    steps,
  };
  if (!data.title || steps.length === 0) {
    return { status: "error", message: "Title and at least one step are required." };
  }

  await db.siteSection.upsert({
    where: { key: "home.howItWorks" },
    create: { key: "home.howItWorks", title: "Home · How it works", data },
    update: { data, title: "Home · How it works" },
  });
  updateTag(CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/admin/content");
  return { status: "success", message: "How it works published." };
}

export async function saveNewsletterSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const data: NewsletterContent = {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    titleAccent: String(formData.get("titleAccent") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
  if (!data.title || !data.description) {
    return { status: "error", message: "Title and description are required." };
  }

  await db.siteSection.upsert({
    where: { key: "home.newsletter" },
    create: { key: "home.newsletter", title: "Home · Newsletter", data },
    update: { data, title: "Home · Newsletter" },
  });
  updateTag(CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/admin/content");
  return { status: "success", message: "Newsletter block published." };
}

export async function saveCollectionsSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const names = formData.getAll("itemName").map(String);
  const slugs = formData.getAll("itemSlug").map(String);
  const descriptions = formData.getAll("itemDescription").map(String);
  const images = formData.getAll("itemImage").map(String);
  const items = names
    .map((name, i) => ({
      name: name.trim(),
      slug: (slugs[i] ?? "").trim(),
      description: (descriptions[i] ?? "").trim(),
      image: (images[i] ?? "").trim(),
    }))
    .filter((item) => item.name && item.slug && item.image);

  const data: CollectionsContent = {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    titleMuted: String(formData.get("titleMuted") ?? "").trim(),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    ctaHref: String(formData.get("ctaHref") ?? "").trim(),
    items,
  };

  if (!data.title || !data.ctaHref || items.length === 0) {
    return { status: "error", message: "Title, CTA link, and at least one collection card are required." };
  }

  await db.siteSection.upsert({
    where: { key: "home.collections" },
    create: { key: "home.collections", title: "Home · Collections", data },
    update: { data, title: "Home · Collections" },
  });
  updateTag(CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/admin/content");
  return { status: "success", message: "Collections section published." };
}
