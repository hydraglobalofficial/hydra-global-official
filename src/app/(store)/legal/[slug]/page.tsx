import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsPage } from "@/components/content/cms-page";
import { getPolicy } from "@/content/policies";
import { cn } from "@/lib/utils";

const legalPages = {
  "privacy-policy": "Privacy Policy",
  terms: "Terms & Conditions",
  "shipping-policy": "Shipping & Delivery",
  "return-policy": "Returns & Refunds",
} as const;

type LegalSlug = keyof typeof legalPages;
const isLegalSlug = (s: string): s is LegalSlug => s in legalPages;

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};
  return { title: getPolicy(slug)?.title ?? legalPages[slug], alternates: { canonical: `/legal/${slug}` } };
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  return (
    <CmsPage
      slug={slug}
      eyebrow="Legal"
      aside={
        <nav className="space-y-1" aria-label="Legal pages">
          {Object.entries(legalPages).map(([s, label]) => (
            <Link
              key={s}
              href={`/legal/${s}`}
              aria-current={s === slug ? "page" : undefined}
              className={cn("block rounded-lg px-3 py-2 text-sm", s === slug ? "bg-white/5 text-fg" : "text-muted hover:text-fg")}
            >
              {label}
            </Link>
          ))}
        </nav>
      }
    />
  );
}
