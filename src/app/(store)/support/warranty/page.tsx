import type { Metadata } from "next";
import { CmsPage } from "@/components/content/cms-page";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Warranty",
  description: "HYDRA's 12-month warranty: what's covered and how to file a claim.",
  alternates: { canonical: "/support/warranty" },
};

export default function WarrantyPage() {
  return (
    <CmsPage
      slug="warranty"
      eyebrow="Support · Warranty"
      aside={
        <div className="glass space-y-4 rounded-3xl p-6">
          <p className="font-medium">Need to make a claim?</p>
          <p className="text-sm text-muted">Have your order number and a photo of the issue ready.</p>
          <ButtonLink href="/support/contact?topic=warranty" className="w-full">Start a claim</ButtonLink>
        </div>
      }
    />
  );
}
