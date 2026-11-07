import type { Metadata } from "next";
import Link from "next/link";
import { CmsPage } from "@/components/content/cms-page";
import { getPolicy } from "@/content/policies";
import { cn } from "@/lib/utils";

export const legalPages = {
  "privacy-policy": "Privacy Policy",
  terms: "Terms & Conditions",
  "shipping-policy": "Shipping & Delivery",
  "return-policy": "Returns & Refunds",
} as const;

export type LegalSlug = keyof typeof legalPages;

export function legalMetadata(slug: LegalSlug): Metadata {
  return {
    title: getPolicy(slug)?.title ?? legalPages[slug],
    alternates: { canonical: `/legal/${slug}` },
  };
}

export function LegalPolicy({ slug }: { slug: LegalSlug }) {
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
