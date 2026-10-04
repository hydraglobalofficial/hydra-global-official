import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import {
  AboutSectionEditor,
  CollectionsSectionEditor,
  HomeHeroSectionEditor,
  HowItWorksSectionEditor,
  NewsletterSectionEditor,
} from "@/components/admin/section-editors";
import { SITE_SECTION_META } from "@/content/site-sections";
import { requireAdmin } from "@/lib/auth/session";
import {
  normalizeAboutContent,
  normalizeCollectionsContent,
  normalizeHomeHeroContent,
  normalizeHowItWorksContent,
  normalizeNewsletterContent,
} from "@/lib/normalize-sections";
import { db } from "@/lib/db";

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

      {key === "home.hero" && <HomeHeroSectionEditor content={normalizeHomeHeroContent(row?.data)} />}
      {key === "about" && <AboutSectionEditor content={normalizeAboutContent(row?.data)} />}
      {key === "home.collections" && (
        <CollectionsSectionEditor content={normalizeCollectionsContent(row?.data)} />
      )}
      {key === "home.howItWorks" && (
        <HowItWorksSectionEditor content={normalizeHowItWorksContent(row?.data)} />
      )}
      {key === "home.newsletter" && (
        <NewsletterSectionEditor content={normalizeNewsletterContent(row?.data)} />
      )}
    </>
  );
}
