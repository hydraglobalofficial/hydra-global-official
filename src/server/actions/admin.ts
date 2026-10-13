"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db, withTransaction } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { invalid, productSchema, type FormState } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { adminCachePurgeAll } from "@/lib/admin-cache";
import { invalidateAdminCache } from "@/server/queries/admin";
import { CATALOG_TAG, CONTENT_TAG } from "@/server/queries/catalog";
import { Prisma } from "@/generated/prisma/client";
import type {
  AboutContent,
  CollectionsContent,
  HeroVisualKey,
  HomeHeroContent,
  HowItWorksContent,
  NewsletterContent,
  ShowcaseContent,
  WhatsappWidgetContent,
} from "@/content/site-sections";
import { clampText, safeInternalHref, safeMediaUrl, safeSlug, safeVideoUrl } from "@/lib/content-safety";
import {
  normalizeAboutContent,
  normalizeCollectionsContent,
  normalizeHomeHeroContent,
  normalizeHowItWorksContent,
  normalizeInstallationContent,
  normalizeNewsletterContent,
  normalizeShowcaseContent,
  normalizeWhatsappWidgetContent,
} from "@/lib/normalize-sections";
import type { InstallationContent } from "@/content/installation";

const HERO_VISUALS = new Set<HeroVisualKey>(["phone", "glass", "privacy", "image"]);

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
    const product = await withTransaction(async (tx) => {
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

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const name = z.string().trim().min(2).max(60).parse(formData.get("name"));
  const description = String(formData.get("description") ?? "").trim() || null;
  const current = await db.category.findUnique({ where: { id } });
  if (!current) return;
  const nextSlug = slugify(name);
  const clash =
    nextSlug !== current.slug
      ? await db.category.findUnique({ where: { slug: nextSlug }, select: { id: true } })
      : null;
  await db.category.update({
    where: { id },
    data: { name, description, slug: clash ? current.slug : nextSlug },
  });
  refreshCatalog();
  revalidatePath("/admin/catalog");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin(["OWNER"]);
  const id = String(formData.get("id"));
  if (await db.product.count({ where: { categoryId: id } })) return;
  await db.category.delete({ where: { id } });
  refreshCatalog();
}

export type DeviceMutationResult =
  | { ok: true; device: { id: string; brand: "APPLE" | "SAMSUNG"; series: string; model: string } }
  | { ok: false; message: string };

const deviceFields = z.object({
  brand: z.enum(["APPLE", "SAMSUNG"]),
  series: z.string().trim().min(2).max(60),
  model: z.string().trim().min(2).max(80),
});

/** Used from product form (client). Catalog forms call the void wrappers below. */
export async function createDeviceMutation(formData: FormData): Promise<DeviceMutationResult> {
  await requireAdmin();
  const parsed = deviceFields.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Brand, series, and model are required." };
  const data = parsed.data;
  const slug = slugify(data.model);
  if (await db.device.findUnique({ where: { slug }, select: { id: true } })) {
    return { ok: false, message: "A device with that name already exists." };
  }
  try {
    const device = await db.device.create({
      data: {
        ...data,
        slug,
        position: await db.device.count({ where: { brand: data.brand } }),
      },
      select: { id: true, brand: true, series: true, model: true },
    });
    refreshCatalog();
    revalidatePath("/admin/catalog");
    revalidatePath("/admin/products", "layout");
    return { ok: true, device };
  } catch {
    return { ok: false, message: "Could not create device." };
  }
}

export async function updateDeviceMutation(formData: FormData): Promise<DeviceMutationResult> {
  await requireAdmin();
  const parsed = deviceFields
    .extend({ id: z.string().min(1) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Brand, series, and model are required." };
  const data = parsed.data;
  const current = await db.device.findUnique({ where: { id: data.id } });
  if (!current) return { ok: false, message: "Device not found." };
  const nextSlug = slugify(data.model);
  const clash =
    nextSlug !== current.slug
      ? await db.device.findUnique({ where: { slug: nextSlug }, select: { id: true } })
      : null;
  try {
    const device = await db.device.update({
      where: { id: data.id },
      data: {
        brand: data.brand,
        series: data.series,
        model: data.model,
        slug: clash ? current.slug : nextSlug,
      },
      select: { id: true, brand: true, series: true, model: true },
    });
    refreshCatalog();
    revalidatePath("/admin/catalog");
    revalidatePath("/admin/products", "layout");
    return { ok: true, device };
  } catch {
    return { ok: false, message: "Could not update device." };
  }
}

export async function createDevice(formData: FormData): Promise<void> {
  await createDeviceMutation(formData);
}

export async function updateDevice(formData: FormData): Promise<void> {
  await updateDeviceMutation(formData);
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

  let justConfirmed = false;
  let confirmedOrderId: string | null = null;

  await withTransaction(async (tx) => {
    const current = await tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
    const restock = (s: string) => s === "CANCELLED" || s === "RETURNED";
    // Return stock to inventory exactly once when an order is cancelled/returned.
    if (restock(data.status) && !restock(current.status)) {
      for (const item of current.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity }, soldCount: { decrement: item.quantity } } });
        if (item.variantId) await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
      }
    }
    justConfirmed = data.status === "CONFIRMED" && current.status !== "CONFIRMED";
    await tx.order.update({ where: { id }, data: { ...data, fulfillmentNote: data.fulfillmentNote || null } });
    if (justConfirmed) confirmedOrderId = id;
  });

  updateTag(CATALOG_TAG);
  await invalidateAdminCache();
  revalidatePath("/admin", "layout");

  // Invoice email + courier booking run after commit (never block admin on SMTP).
  if (justConfirmed && confirmedOrderId) {
    const order = await db.order.findUnique({
      where: { id: confirmedOrderId },
      include: { items: true },
    });
    if (order) {
      const { toInvoiceOrder } = await import("@/lib/invoice/from-order");
      const { sendOrderInvoiceEmail } = await import("@/lib/mail/send-order-invoice");
      const { createCourierShipment, orderToCourierRequest } = await import("@/lib/courier");

      const invoice = toInvoiceOrder(order);
      const mail = await sendOrderInvoiceEmail(invoice);
      if (!mail.ok) {
        console.error("[orders] invoice email failed", order.number, mail.error);
      } else if ("skipped" in mail && mail.skipped) {
        console.info("[orders] invoice email skipped", order.number, mail.reason);
      }

      const courier = await createCourierShipment(
        orderToCourierRequest({ ...order, currency: "USD" }),
      );
      if ("skipped" in courier && courier.skipped) {
        console.info("[orders] courier skipped", order.number, courier.reason);
      } else if (!courier.ok) {
        console.error("[orders] courier booking failed", order.number, courier.error);
      }

      if (mail.ok && !("skipped" in mail && mail.skipped)) {
        return { status: "success", message: "Order confirmed · invoice emailed to customer." };
      }
      if (mail.ok && "skipped" in mail && mail.skipped) {
        return {
          status: "success",
          message: "Order confirmed. Invoice email skipped (add SMTP_* to env when ready).",
        };
      }
      return {
        status: "success",
        message: "Order confirmed, but invoice email failed — check SMTP settings / logs.",
      };
    }
  }

  return { status: "success", message: "Order updated." };
}

// ─── Inquiries & reviews ─────────────────────────────────────────────────────

export async function setInquiryStatus(formData: FormData) {
  await requireAdmin();
  const { id, status } = z
    .object({ id: z.string(), status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]) })
    .parse(Object.fromEntries(formData));
  await db.inquiry.update({ where: { id }, data: { status } });
  await invalidateAdminCache();
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
  await invalidateAdminCache();
  refreshCatalog(product.slug);
  revalidatePath("/admin", "layout");
}

/** Wipe admin Redis/memory cache so the next load is fresh from Postgres. */
export async function purgeAdminCache() {
  await requireAdmin();
  await adminCachePurgeAll();
  revalidatePath("/admin", "layout");
}

// ─── Content ─────────────────────────────────────────────────────────────────

function refreshAnnouncements() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  void invalidateAdminCache("dashboard");
}

async function bumpAdminContentHub() {
  await invalidateAdminCache("dashboard");
  revalidatePath("/admin/content");
}

export async function saveAnnouncement(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      id: z.string().optional(),
      message: z.string().trim().min(3).max(160),
      href: z.string().trim().max(200).optional(),
      position: z.coerce.number().int().min(0).max(999).default(0),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const href = parsed.data.href ? safeInternalHref(parsed.data.href, "") : "";
  const payload = {
    message: parsed.data.message,
    href: href || null,
    position: parsed.data.position,
    active: formData.get("active") === "on",
  };
  if (parsed.data.id) await db.announcement.update({ where: { id: parsed.data.id }, data: payload });
  else await db.announcement.create({ data: payload });
  refreshAnnouncements();
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db.announcement.delete({ where: { id } });
  refreshAnnouncements();
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

  try {
    const stats = pairsFrom(formData, "statValue", "statLabel").slice(0, 8);
    const missionBullets = linesFrom(formData, "missionBullet").slice(0, 8);
    const visionBullets = linesFrom(formData, "visionBullet").slice(0, 8);
    const highlights = String(formData.get("manifestoHighlights") ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 24);

    const valueTitles = formData.getAll("valueTitle").map(String);
    const valueKeywords = formData.getAll("valueKeyword").map(String);
    const valueTexts = formData.getAll("valueText").map(String);
    const values = valueTitles
      .map((title, i) => ({
        title: clampText(title, 80),
        keyword: clampText(valueKeywords[i], 40),
        text: clampText(valueTexts[i], 600),
      }))
      .filter((v) => v.title && v.keyword && v.text)
      .slice(0, 12);

    const divisionTitles = formData.getAll("divisionTitle").map(String);
    const divisionTexts = formData.getAll("divisionText").map(String);
    const divisionHrefs = formData.getAll("divisionHref").map(String);
    const divisions = divisionTitles
      .map((title, i) => ({
        title: clampText(title, 80),
        text: clampText(divisionTexts[i], 400),
        href: safeInternalHref(divisionHrefs[i], ""),
      }))
      .filter((d) => d.title && d.text && d.href)
      .slice(0, 6);

    const journeyYears = formData.getAll("journeyYear").map(String);
    const journeyTitles = formData.getAll("journeyTitle").map(String);
    const journeyTexts = formData.getAll("journeyText").map(String);
    const journeyFuture = formData.getAll("journeyFuture").map(String);
    const journey = journeyYears
      .map((year, i) => ({
        year: clampText(year, 24),
        title: clampText(journeyTitles[i], 120),
        text: clampText(journeyTexts[i], 600),
        ...(journeyFuture[i] === "yes" ? { future: true as const } : {}),
      }))
      .filter((j) => j.year && j.title && j.text)
      .slice(0, 12);

    const heroTitle = clampText(formData.get("heroTitle"), 120);
    const manifestoText = clampText(formData.get("manifestoText"), 1200);
    if (!heroTitle || !manifestoText || values.length === 0) {
      return { status: "error", message: "Hero, manifesto and at least one value are required." };
    }
    const badDivisionLink = divisionTitles.some((title, i) => {
      const filled = title.trim() || (divisionTexts[i] ?? "").trim() || (divisionHrefs[i] ?? "").trim();
      if (!filled) return false;
      return !safeInternalHref(divisionHrefs[i], "");
    });
    if (badDivisionLink) {
      return { status: "error", message: "Division links must be site paths like /shop or /contact." };
    }

    const commitmentTitles = formData.getAll("companyCommitmentTitle").map(String);
    const commitmentTexts = formData.getAll("companyCommitmentText").map(String);
    const commitments = commitmentTitles
      .map((title, i) => ({
        title: clampText(title, 80),
        text: clampText(commitmentTexts[i], 240),
      }))
      .filter((row) => row.title && row.text)
      .slice(0, 8);

    const factLabels = formData.getAll("companyFactLabel").map(String);
    const factValues = formData.getAll("companyFactValue").map(String);
    const facts = factLabels
      .map((label, i) => ({
        label: clampText(label, 80),
        value: clampText(factValues[i], 200),
      }))
      .filter((row) => row.label && row.value)
      .slice(0, 16);

    const data = normalizeAboutContent({
      hero: {
        eyebrow: clampText(formData.get("heroEyebrow"), 60),
        title: heroTitle,
        titleAccent: clampText(formData.get("heroTitleAccent"), 80),
        description: clampText(formData.get("heroDescription"), 800),
      },
      stats,
      manifesto: { text: manifestoText, highlight: highlights },
      mission: {
        title: clampText(formData.get("missionTitle"), 80),
        body: clampText(formData.get("missionBody"), 800),
        bullets: missionBullets,
      },
      vision: {
        title: clampText(formData.get("visionTitle"), 80),
        body: clampText(formData.get("visionBody"), 800),
        bullets: visionBullets,
      },
      valuesIntro: {
        title: clampText(formData.get("valuesTitle"), 80),
        titleMuted: clampText(formData.get("valuesTitleMuted"), 80),
        description: clampText(formData.get("valuesDescription"), 400),
      },
      values,
      divisions,
      journey,
      company: {
        visible: formData.get("companyVisible") === "on",
        eyebrow: clampText(formData.get("companyEyebrow"), 60),
        title: clampText(formData.get("companyTitle"), 120),
        titleMuted: clampText(formData.get("companyTitleMuted"), 80),
        description: clampText(formData.get("companyDescription"), 600),
        ctaLabel: clampText(formData.get("companyCtaLabel"), 60),
        ctaHref: safeInternalHref(formData.get("companyCtaHref"), "/contact"),
        sheetTitle: clampText(formData.get("companySheetTitle"), 80),
        sheetBadge: clampText(formData.get("companySheetBadge"), 40),
        commitments,
        facts,
      },
      careers: {
        title: clampText(formData.get("careersTitle"), 120),
        text: clampText(formData.get("careersText"), 400),
        cta: clampText(formData.get("careersCta"), 60),
      },
      partner: {
        title: clampText(formData.get("partnerTitle"), 120),
        text: clampText(formData.get("partnerText"), 400),
        cta: clampText(formData.get("partnerCta"), 60),
      },
    } satisfies AboutContent);

    await db.siteSection.upsert({
      where: { key: "about" },
      create: { key: "about", title: "About page", data },
      update: { data, title: "About page" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/about");
    revalidatePath("/admin/about");
    revalidatePath("/admin/content/sections/about");
    await bumpAdminContentHub();
    return { status: "success", message: "About page published." };
  } catch (error) {
    console.error("[saveAboutSection]", error);
    return { status: "error", message: "Could not publish About page." };
  }
}

export async function saveHowItWorksSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const titles = formData.getAll("stepTitle").map(String);
    const texts = formData.getAll("stepText").map(String);
    const steps = titles
      .map((title, i) => ({
        title: clampText(title, 80),
        text: clampText(texts[i], 400),
      }))
      .filter((s) => s.title && s.text)
      .slice(0, 8);

    const title = clampText(formData.get("title"), 120);
    if (!title || steps.length === 0) {
      return { status: "error", message: "Title and at least one step are required." };
    }

    const data = normalizeHowItWorksContent({
      eyebrow: clampText(formData.get("eyebrow"), 60),
      title,
      titleMuted: clampText(formData.get("titleMuted"), 80),
      steps,
    } satisfies HowItWorksContent);

    await db.siteSection.upsert({
      where: { key: "home.howItWorks" },
      create: { key: "home.howItWorks", title: "Home · How it works", data },
      update: { data, title: "Home · How it works" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/");
    await bumpAdminContentHub();
    return { status: "success", message: "How it works published." };
  } catch (error) {
    console.error("[saveHowItWorksSection]", error);
    return { status: "error", message: "Could not publish How it works." };
  }
}

export async function saveInstallationSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const titles = formData.getAll("stepTitle").map(String);
    const bodies = formData.getAll("stepBody").map(String);
    const tips = formData.getAll("stepTip").map(String);
    const images = formData.getAll("stepImage").map(String);
    const steps = titles
      .map((title, i) => ({
        title: clampText(title, 100),
        body: clampText(bodies[i], 600),
        tip: clampText(tips[i], 240, ""),
        image: safeMediaUrl(images[i], ""),
      }))
      .filter((s) => s.title && s.body)
      .slice(0, 16)
      .map((s) => ({
        title: s.title,
        body: s.body,
        ...(s.tip ? { tip: s.tip } : {}),
        ...(s.image ? { image: s.image } : {}),
      }));

    const problems = formData.getAll("troubleProblem").map(String);
    const fixes = formData.getAll("troubleFix").map(String);
    const troubleshooting = problems
      .map((problem, i) => ({
        problem: clampText(problem, 120),
        fix: clampText(fixes[i], 400),
      }))
      .filter((t) => t.problem && t.fix)
      .slice(0, 12);

    const title = clampText(formData.get("title"), 80);
    if (!title || steps.length === 0) {
      return { status: "error", message: "Title and at least one install step are required." };
    }

    const data = normalizeInstallationContent({
      eyebrow: clampText(formData.get("eyebrow"), 60),
      title,
      titleAccent: clampText(formData.get("titleAccent"), 80),
      intro: clampText(formData.get("intro"), 500),
      duration: clampText(formData.get("duration"), 40),
      videoUrl: safeVideoUrl(formData.get("videoUrl"), ""),
      brandsNote: clampText(formData.get("brandsNote"), 80),
      kit: lines(String(formData.get("kit") ?? "")),
      steps,
      troubleshooting,
    } satisfies InstallationContent);

    await db.siteSection.upsert({
      where: { key: "installation" },
      create: { key: "installation", title: "Installation guide", data },
      update: { data, title: "Installation guide" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/installation");
    revalidatePath("/installation/iphone");
    revalidatePath("/installation/samsung");
    revalidatePath("/admin/installation");
    revalidatePath("/admin/content/sections/installation");
    await bumpAdminContentHub();
    return { status: "success", message: "Installation guide published." };
  } catch (error) {
    console.error("[saveInstallationSection]", error);
    return { status: "error", message: "Could not publish installation guide." };
  }
}

export async function saveNewsletterSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const title = clampText(formData.get("title"), 80);
    const description = clampText(formData.get("description"), 400);
    if (!title || !description) {
      return { status: "error", message: "Title and description are required." };
    }

    const data = normalizeNewsletterContent({
      eyebrow: clampText(formData.get("eyebrow"), 60),
      title,
      titleAccent: clampText(formData.get("titleAccent"), 40),
      description,
    } satisfies NewsletterContent);

    await db.siteSection.upsert({
      where: { key: "home.newsletter" },
      create: { key: "home.newsletter", title: "Home · Newsletter", data },
      update: { data, title: "Home · Newsletter" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/");
    await bumpAdminContentHub();
    return { status: "success", message: "Newsletter block published." };
  } catch (error) {
    console.error("[saveNewsletterSection]", error);
    return { status: "error", message: "Could not publish newsletter block." };
  }
}

export async function saveWhatsappWidgetSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const names = formData.getAll("staffName").map(String);
    const images = formData.getAll("staffImage").map(String);
    const staff = images
      .map((image, i) => ({
        name: clampText(names[i], 60),
        image: safeMediaUrl(image, ""),
      }))
      // Staff float: real face photos only — never product catalog paths.
      .filter((row) => !!row.image && !row.image.startsWith("/products/"))
      .slice(0, 6);

    const data = normalizeWhatsappWidgetContent({
      enabled: formData.get("enabled") === "on" || formData.get("enabled") === "true",
      phone: String(formData.get("phone") ?? ""),
      message: clampText(formData.get("message"), 200),
      rotateSeconds: Number(formData.get("rotateSeconds") ?? 3),
      staff,
    } satisfies WhatsappWidgetContent);

    if (data.enabled && staff.length === 0) {
      return { status: "error", message: "Add at least one staff photo, or turn the widget off." };
    }

    await db.siteSection.upsert({
      where: { key: "site.whatsapp" },
      create: { key: "site.whatsapp", title: "WhatsApp float", data },
      update: { data, title: "WhatsApp float" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/", "layout");
    await bumpAdminContentHub();
    return { status: "success", message: "WhatsApp float published." };
  } catch (error) {
    console.error("[saveWhatsappWidgetSection]", error);
    return { status: "error", message: "Could not publish WhatsApp float." };
  }
}

export async function saveShowcaseSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const titles = formData.getAll("videoTitle").map(String);
    const captions = formData.getAll("videoCaption").map(String);
    const durations = formData.getAll("videoDuration").map(String);
    const posters = formData.getAll("videoPoster").map(String);
    const videoUrls = formData.getAll("videoUrl").map(String);
    const hrefs = formData.getAll("videoHref").map(String);

    const videos = titles.map((_, i) => ({
      title: titles[i] ?? "",
      caption: captions[i] ?? "",
      duration: durations[i] ?? "",
      poster: posters[i] ?? "",
      videoUrl: videoUrls[i] ?? "",
      href: hrefs[i] ?? "/shop",
    }));

    const data = normalizeShowcaseContent({
      eyebrow: clampText(formData.get("eyebrow"), 60),
      title: clampText(formData.get("title"), 80),
      titleMuted: clampText(formData.get("titleMuted"), 80),
      channelLabel: clampText(formData.get("channelLabel"), 40),
      channelHref: clampText(formData.get("channelHref"), 240),
      videos,
    } satisfies ShowcaseContent);

    if (data.videos.length === 0) {
      return { status: "error", message: "Add at least one video card with title, caption, duration and poster." };
    }

    await db.siteSection.upsert({
      where: { key: "home.showcase" },
      create: { key: "home.showcase", title: "Home · Video showcase", data },
      update: { data, title: "Home · Video showcase" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/");
    revalidatePath("/admin/content/sections/home.showcase");
    await bumpAdminContentHub();
    return { status: "success", message: "Video showcase published." };
  } catch (error) {
    console.error("[saveShowcaseSection]", error);
    return { status: "error", message: "Could not publish video showcase." };
  }
}

export async function saveHomeHeroSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  try {
    const keys = formData.getAll("slideKey").map(String);
    const brands = formData.getAll("slideBrand").map(String);
    const titles = formData.getAll("slideTitle").map(String);
    const accents = formData.getAll("slideTitleAccent").map(String);
    const texts = formData.getAll("slideText").map(String);
    const primaryLabels = formData.getAll("slidePrimaryLabel").map(String);
    const primaryHrefs = formData.getAll("slidePrimaryHref").map(String);
    const secondaryLabels = formData.getAll("slideSecondaryLabel").map(String);
    const secondaryHrefs = formData.getAll("slideSecondaryHref").map(String);
    const visuals = formData.getAll("slideVisual").map(String);
    const images = formData.getAll("slideImage").map(String);

    const slides = keys
      .map((_, i) => {
        const key = safeSlug(keys[i]) || clampText(keys[i], 40).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
        const brand = clampText(brands[i], 40);
        const title = clampText(titles[i], 80);
        const titleAccent = clampText(accents[i], 80);
        const text = clampText(texts[i], 280);
        const primaryLabel = clampText(primaryLabels[i], 40);
        const primaryHref = safeInternalHref(primaryHrefs[i], "/shop");
        const secondaryLabel = clampText(secondaryLabels[i], 40);
        const secondaryHref = safeInternalHref(secondaryHrefs[i], "/shop");
        const visualRaw = String(visuals[i] ?? "phone");
        const visual: HeroVisualKey = HERO_VISUALS.has(visualRaw as HeroVisualKey)
          ? (visualRaw as HeroVisualKey)
          : "phone";
        const image = safeMediaUrl(images[i], "");
        if (!key && !brand && !title) return null;
        if (!key || !brand || !title || !titleAccent || !text || !primaryLabel || !secondaryLabel) return null;
        if (visual === "image" && !image) return null;
        return {
          key,
          brand,
          title,
          titleAccent,
          text,
          primaryLabel,
          primaryHref,
          secondaryLabel,
          secondaryHref,
          visual,
          image,
        };
      })
      .filter((row): row is NonNullable<typeof row> => !!row)
      .slice(0, 6);

    if (slides.length === 0) {
      return { status: "error", message: "Add at least one complete hero slide." };
    }

    const statValues = formData.getAll("statValue").map(String);
    const statLabels = formData.getAll("statLabel").map(String);
    const stats = statValues
      .map((value, i) => ({
        value: clampText(value, 24),
        label: clampText(statLabels[i], 40),
      }))
      .filter((row) => row.value && row.label)
      .slice(0, 4);

    const linkLabels = formData.getAll("linkLabel").map(String);
    const linkHrefs = formData.getAll("linkHref").map(String);
    const quickLinks = linkLabels
      .map((label, i) => ({
        label: clampText(label, 40),
        href: safeInternalHref(linkHrefs[i], ""),
      }))
      .filter((row) => row.label && row.href)
      .slice(0, 6);

    const data = normalizeHomeHeroContent({
      ratingLabel: clampText(formData.get("ratingLabel"), 80) || "50,000+ owners · worldwide",
      quickLinks,
      stats,
      slides,
    } satisfies HomeHeroContent);

    await db.siteSection.upsert({
      where: { key: "home.hero" },
      create: { key: "home.hero", title: "Home · Hero slider", data },
      update: { data, title: "Home · Hero slider" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/");
    revalidatePath("/admin/content/sections/home.hero");
    await bumpAdminContentHub();
    return { status: "success", message: "Hero slider published." };
  } catch (error) {
    console.error("[saveHomeHeroSection]", error);
    return { status: "error", message: "Could not save hero section." };
  }
}

export async function saveCollectionsSection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  try {
    const names = formData.getAll("itemName").map(String);
    const slugs = formData.getAll("itemSlug").map(String);
    const descriptions = formData.getAll("itemDescription").map(String);
    const images = formData.getAll("itemImage").map(String);
    const badCard = names.some((name, i) => {
      const rawName = name.trim();
      const rawSlug = String(slugs[i] ?? "").trim();
      const rawImage = String(images[i] ?? "").trim();
      if (!rawName && !rawSlug && !rawImage) return false;
      return !(clampText(rawName, 80) && safeSlug(rawSlug) && safeMediaUrl(rawImage));
    });
    if (badCard) {
      return {
        status: "error",
        message: "Each card needs a valid slug (a-z0-9-), name, and image path/URL (local /… or allowlisted host).",
      };
    }

    const items = names
      .map((name, i) => ({
        name: clampText(name, 80),
        slug: safeSlug(slugs[i]),
        description: clampText(descriptions[i], 240, ""),
        image: safeMediaUrl(images[i]),
      }))
      .filter((item) => item.name && item.slug && item.image)
      .slice(0, 5);

    const title = clampText(formData.get("title"), 120);
    if (!title || items.length === 0) {
      return {
        status: "error",
        message: "Title and at least one complete card (name, slug, image) are required.",
      };
    }

    const data = normalizeCollectionsContent({
      eyebrow: clampText(formData.get("eyebrow"), 60),
      title,
      titleMuted: clampText(formData.get("titleMuted"), 80),
      ctaLabel: clampText(formData.get("ctaLabel"), 40) || "All products",
      ctaHref: safeInternalHref(formData.get("ctaHref"), "/shop"),
      items,
    } satisfies CollectionsContent);

    await db.siteSection.upsert({
      where: { key: "home.collections" },
      create: { key: "home.collections", title: "Home · Collections", data },
      update: { data, title: "Home · Collections" },
    });
    updateTag(CONTENT_TAG);
    revalidatePath("/");
    revalidatePath("/admin/collections");
    revalidatePath("/admin/content/sections/home.collections");
    await bumpAdminContentHub();
    return { status: "success", message: "Collections section published." };
  } catch (error) {
    console.error("[saveCollectionsSection]", error);
    return { status: "error", message: "Could not save collections section." };
  }
}
