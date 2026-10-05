import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultAboutContent,
  defaultCollectionsContent,
  defaultHomeHeroContent,
  defaultHowItWorksContent,
  defaultNewsletterContent,
  type AboutContent,
  type CollectionsContent,
  type HomeHeroContent,
  type HowItWorksContent,
  type NewsletterContent,
} from "@/content/site-sections";
import { defaultInstallationContent, type InstallationContent } from "@/content/installation";
import { safeInternalHref } from "@/lib/content-safety";
import {
  normalizeAboutContent,
  normalizeCollectionsContent,
  normalizeHomeHeroContent,
  normalizeHowItWorksContent,
  normalizeInstallationContent,
  normalizeNewsletterContent,
} from "@/lib/normalize-sections";
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
  ["site-section-home-hero"],
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
  ["site-section-installation-v3"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const listSiteSections = cache(async () =>
  db.siteSection.findMany({
    select: { key: true, title: true, updatedAt: true },
    orderBy: { key: "asc" },
  }),
);
