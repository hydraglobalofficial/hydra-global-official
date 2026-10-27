import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultAboutContent,
  defaultClarityContent,
  defaultImpactContent,
  defaultImpactLabContent,
  defaultCollectionsContent,
  defaultHomeHeroContent,
  defaultHowItWorksContent,
  defaultTechContent,
  defaultNewsletterContent,
  defaultShippingContent,
  defaultSocialContent,
  defaultTrackingContent,
  defaultShowcaseContent,
  defaultWhatsappWidgetContent,
  type AboutContent,
  type ClarityContent,
  type ImpactContent,
  type ImpactLabContent,
  type CollectionsContent,
  type HomeHeroContent,
  type HowItWorksContent,
  type TechContent,
  type NewsletterContent,
  type ShippingContent,
  type SocialContent,
  type TrackingContent,
  type ShowcaseContent,
  type WhatsappWidgetContent,
} from "@/content/site-sections";
import { defaultInstallationContent, type InstallationContent } from "@/content/installation";
import { safeInternalHref } from "@/lib/content-safety";
import {
  normalizeAboutContent,
  normalizeClarityContent,
  normalizeImpactContent,
  normalizeImpactLabContent,
  normalizeCollectionsContent,
  normalizeCurrencyContent,
  normalizeHomeHeroContent,
  normalizeHowItWorksContent,
  normalizeTechContent,
  normalizeInstallationContent,
  normalizeNewsletterContent,
  normalizeShippingContent,
  normalizeSocialContent,
  normalizeTrackingContent,
  normalizeShowcaseContent,
  normalizeWhatsappWidgetContent,
} from "@/lib/normalize-sections";
import { defaultCurrencyContent, type CurrencyContent } from "@/lib/money";
import { CONTENT_TAG } from "./catalog";

export const getAnnouncements = unstable_cache(
  async () => {
    const rows = await db.announcement.findMany({
      where: { active: true },
      select: { id: true, message: true, href: true },
      orderBy: { position: "asc" },
    });
    return rows.map((row) => ({
      ...row,
      href: row.href ? safeInternalHref(row.href, "") || null : null,
    }));
  },
  ["announcements"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getPage = cache(async (slug: string) => db.page.findUnique({ where: { slug } }));

export const getAboutContent = unstable_cache(
  async (): Promise<AboutContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "about" }, select: { data: true } });
      return normalizeAboutContent(row?.data ?? defaultAboutContent);
    } catch {
      return normalizeAboutContent(defaultAboutContent);
    }
  },
  ["site-section-about-v2"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getTechContent = unstable_cache(
  async (): Promise<TechContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.tech" }, select: { data: true } });
      return normalizeTechContent(row?.data ?? defaultTechContent);
    } catch {
      return defaultTechContent;
    }
  },
  ["site-section-tech-v2"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getHowItWorksContent = unstable_cache(
  async (): Promise<HowItWorksContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.howItWorks" }, select: { data: true } });
      return normalizeHowItWorksContent(row?.data ?? defaultHowItWorksContent);
    } catch {
      return defaultHowItWorksContent;
    }
  },
  ["site-section-how"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getNewsletterContent = unstable_cache(
  async (): Promise<NewsletterContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.newsletter" }, select: { data: true } });
      return normalizeNewsletterContent(row?.data ?? defaultNewsletterContent);
    } catch {
      return defaultNewsletterContent;
    }
  },
  ["site-section-newsletter"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getCollectionsContent = unstable_cache(
  async (): Promise<CollectionsContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.collections" }, select: { data: true } });
      return normalizeCollectionsContent(row?.data ?? defaultCollectionsContent);
    } catch {
      return defaultCollectionsContent;
    }
  },
  ["site-section-collections"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getHomeHeroContent = unstable_cache(
  async (): Promise<HomeHeroContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.hero" }, select: { data: true } });
      return normalizeHomeHeroContent(row?.data ?? defaultHomeHeroContent);
    } catch {
      return defaultHomeHeroContent;
    }
  },
  ["site-section-home-hero-v13"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getShowcaseContent = unstable_cache(
  async (): Promise<ShowcaseContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.showcase" }, select: { data: true } });
      return normalizeShowcaseContent(row?.data ?? defaultShowcaseContent);
    } catch {
      return defaultShowcaseContent;
    }
  },
  ["site-section-showcase"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getInstallationContent = unstable_cache(
  async (): Promise<InstallationContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "installation" }, select: { data: true } });
      return normalizeInstallationContent(row?.data ?? defaultInstallationContent);
    } catch {
      return defaultInstallationContent;
    }
  },
  ["site-section-installation-v6"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getWhatsappWidgetContent = unstable_cache(
  async (): Promise<WhatsappWidgetContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "site.whatsapp" }, select: { data: true } });
      return normalizeWhatsappWidgetContent(row?.data ?? defaultWhatsappWidgetContent);
    } catch {
      return defaultWhatsappWidgetContent;
    }
  },
  ["site-section-whatsapp-v3"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getShippingContent = unstable_cache(
  async (): Promise<ShippingContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "site.shipping" }, select: { data: true } });
      return normalizeShippingContent(row?.data ?? defaultShippingContent);
    } catch {
      return defaultShippingContent;
    }
  },
  ["site-section-shipping-v1"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getTrackingContent = unstable_cache(
  async (): Promise<TrackingContent> => {
    const envFallback = {
      gtmId: process.env.NEXT_PUBLIC_GTM_ID,
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
      ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
      tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    };
    try {
      const row = await db.siteSection.findUnique({ where: { key: "site.tracking" }, select: { data: true } });
      const stored = row?.data && typeof row.data === "object" && !Array.isArray(row.data) ? row.data : {};
      return normalizeTrackingContent({ ...defaultTrackingContent, ...stored, ...pickFilled(envFallback, stored) });
    } catch {
      return normalizeTrackingContent({ ...defaultTrackingContent, ...envFallback });
    }
  },
  ["site-section-tracking-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

function pickFilled(env: Record<string, string | undefined>, stored: Record<string, unknown>) {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(env)) {
    const current = stored[key];
    if (!current && value) next[key] = value;
  }
  return next;
}

export const getSocialContent = unstable_cache(
  async (): Promise<SocialContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "site.social" }, select: { data: true } });
      return normalizeSocialContent(row?.data ?? defaultSocialContent);
    } catch {
      return defaultSocialContent;
    }
  },
  ["site-section-social-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getImpactContent = unstable_cache(
  async (): Promise<ImpactContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.impact" }, select: { data: true } });
      return normalizeImpactContent(row?.data ?? defaultImpactContent);
    } catch {
      return defaultImpactContent;
    }
  },
  ["site-section-impact-v4"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getImpactLabContent = unstable_cache(
  async (): Promise<ImpactLabContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.impactLab" }, select: { data: true } });
      return normalizeImpactLabContent(row?.data ?? defaultImpactLabContent);
    } catch {
      return defaultImpactLabContent;
    }
  },
  ["site-section-impact-lab-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getClarityContent = unstable_cache(
  async (): Promise<ClarityContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "home.clarity" }, select: { data: true } });
      return normalizeClarityContent(row?.data ?? defaultClarityContent);
    } catch {
      return defaultClarityContent;
    }
  },
  ["site-section-clarity-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getCurrencyContent = unstable_cache(
  async (): Promise<CurrencyContent> => {
    try {
      const row = await db.siteSection.findUnique({ where: { key: "site.currency" }, select: { data: true } });
      return normalizeCurrencyContent(row?.data ?? defaultCurrencyContent);
    } catch {
      return defaultCurrencyContent;
    }
  },
  ["site-section-currency-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const listSiteSections = cache(async () =>
  db.siteSection.findMany({
    select: { key: true, title: true, updatedAt: true },
    orderBy: { key: "asc" },
  }),
);

/** Per-request dedupe for admin section editors. */
export const getSiteSectionRow = cache(async (key: string) =>
  db.siteSection.findUnique({ where: { key }, select: { data: true, updatedAt: true } }),
);
