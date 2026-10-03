import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import {
  AboutSectionEditor,
  CollectionsSectionEditor,
  HowItWorksSectionEditor,
  NewsletterSectionEditor,
} from "@/components/admin/section-editors";
import {
  defaultAboutContent,
  defaultCollectionsContent,
  defaultHowItWorksContent,
  defaultNewsletterContent,
  SITE_SECTION_META,
} from "@/content/site-sections";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type {
  AboutContent,
  CollectionsContent,
  HowItWorksContent,
  NewsletterContent,
} from "@/content/site-sections";

export const metadata = { title: "Edit section" };

type Props = { params: Promise<{ key: string }> };

export default async function EditSiteSectionPage({ params }: Props) {
  await requireAdmin();
  const { key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  const meta = SITE_SECTION_META.find((s) => s.key === key);
  if (!meta) notFound();

  const row = await db.siteSection.findUnique({ where: { key } });

  return (
    <>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={14} /> Content
      </Link>
      <AdminHeader eyebrow="Site sections" title={meta.title} description={meta.description} />

      {key === "about" && (
        <AboutSectionEditor content={{ ...defaultAboutContent, ...((row?.data as AboutContent | undefined) ?? {}) }} />
      )}
      {key === "home.collections" && (
        <CollectionsSectionEditor
          content={{
            ...defaultCollectionsContent,
            ...((row?.data as CollectionsContent | undefined) ?? {}),
            items:
              Array.isArray((row?.data as CollectionsContent | undefined)?.items) &&
              ((row?.data as CollectionsContent).items?.length ?? 0) > 0
                ? (row?.data as CollectionsContent).items
                : defaultCollectionsContent.items,
          }}
        />
      )}
      {key === "home.howItWorks" && (
        <HowItWorksSectionEditor
          content={{ ...defaultHowItWorksContent, ...((row?.data as HowItWorksContent | undefined) ?? {}) }}
        />
      )}
      {key === "home.newsletter" && (
        <NewsletterSectionEditor
          content={{ ...defaultNewsletterContent, ...((row?.data as NewsletterContent | undefined) ?? {}) }}
        />
      )}
    </>
  );
}
