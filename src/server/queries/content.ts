import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
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
