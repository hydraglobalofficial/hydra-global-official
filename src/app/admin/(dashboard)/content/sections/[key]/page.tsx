import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import {
  AboutSectionEditor,
  ClaritySectionEditor,
  ImpactSectionEditor,
  ImpactLabSectionEditor,
  CollectionsSectionEditor,
  CurrencySectionEditor,
  HomeHeroSectionEditor,
  HowItWorksSectionEditor,
  InstallationSectionEditor,
  NewsletterSectionEditor,
  ShippingSectionEditor,
  ShowcaseSectionEditor,
  WhatsappWidgetSectionEditor,
} from "@/components/admin/section-editors";
import { SITE_SECTION_META } from "@/content/site-sections";
import { requireAdmin } from "@/lib/auth/session";
import {
  normalizeAboutContent,
  normalizeClarityContent,
  normalizeImpactContent,
  normalizeImpactLabContent,
  normalizeCollectionsContent,
  normalizeCurrencyContent,
  normalizeHomeHeroContent,
  normalizeHowItWorksContent,
  normalizeInstallationContent,
  normalizeNewsletterContent,
  normalizeShippingContent,
  normalizeShowcaseContent,
  normalizeWhatsappWidgetContent,
} from "@/lib/normalize-sections";
import { getSiteSectionRow } from "@/server/queries/content";

export const metadata = { title: "Edit section" };

type Props = { params: Promise<{ key: string }> };

export default async function EditSiteSectionPage({ params }: Props) {
  await requireAdmin();
  const { key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  const meta = SITE_SECTION_META.find((s) => s.key === key);
  if (!meta) notFound();

  const row = await getSiteSectionRow(key);

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
      {key === "home.showcase" && (
        <ShowcaseSectionEditor content={normalizeShowcaseContent(row?.data)} />
      )}
      {key === "home.newsletter" && (
        <NewsletterSectionEditor content={normalizeNewsletterContent(row?.data)} />
      )}
      {key === "site.whatsapp" && (
        <WhatsappWidgetSectionEditor content={normalizeWhatsappWidgetContent(row?.data)} />
      )}
      {key === "site.currency" && (
        <CurrencySectionEditor content={normalizeCurrencyContent(row?.data)} />
      )}
      {key === "site.shipping" && (
        <ShippingSectionEditor content={normalizeShippingContent(row?.data)} />
      )}
      {key === "home.clarity" && (
        <ClaritySectionEditor content={normalizeClarityContent(row?.data)} />
      )}
      {key === "home.impact" && (
        <ImpactSectionEditor content={normalizeImpactContent(row?.data)} />
      )}
      {key === "home.impactLab" && (
        <ImpactLabSectionEditor content={normalizeImpactLabContent(row?.data)} />
      )}
      {key === "installation" && (
        <InstallationSectionEditor content={normalizeInstallationContent(row?.data)} />
      )}
    </>
  );
}
