import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultAboutContent,
  defaultCollectionsContent,
  defaultHowItWorksContent,
  defaultNewsletterContent,
  type AboutContent,
  type CollectionsContent,
  type HowItWorksContent,
  type NewsletterContent,
} from "@/content/site-sections";
import { CONTENT_TAG } from "./catalog";

export const getAnnouncements = unstable_cache(
  async () =>
    db.announcement.findMany({
      where: { active: true },
      select: { id: true, message: true, href: true },
      orderBy: { position: "asc" },
    }),
  ["announcements"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getPage = cache(async (slug: string) => db.page.findUnique({ where: { slug } }));

async function readSection<T>(key: string, fallback: T): Promise<T> {
  const row = await db.siteSection.findUnique({ where: { key }, select: { data: true } });
  if (!row?.data || typeof row.data !== "object") return fallback;
  return { ...fallback, ...(row.data as object) } as T;
}

export const getAboutContent = unstable_cache(
  async () => readSection<AboutContent>("about", defaultAboutContent),
  ["site-section-about"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getHowItWorksContent = unstable_cache(
  async () => readSection<HowItWorksContent>("home.howItWorks", defaultHowItWorksContent),
  ["site-section-how"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getNewsletterContent = unstable_cache(
  async () => readSection<NewsletterContent>("home.newsletter", defaultNewsletterContent),
  ["site-section-newsletter"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export const getCollectionsContent = unstable_cache(async () => {
  const row = await db.siteSection.findUnique({ where: { key: "home.collections" }, select: { data: true } });
  if (!row?.data || typeof row.data !== "object") return defaultCollectionsContent;
  const data = row.data as Partial<CollectionsContent>;
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : defaultCollectionsContent.items;
  return { ...defaultCollectionsContent, ...data, items };
}, ["site-section-collections"], { tags: [CONTENT_TAG], revalidate: 3600 });

export const listSiteSections = cache(async () =>
  db.siteSection.findMany({
    select: { key: true, title: true, updatedAt: true },
    orderBy: { key: "asc" },
  }),
);
