import type { Metadata } from "next";
import { CmsPage } from "@/components/content/cms-page";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Returns",
  description: "How to return or replace a HYDRA product within 7 days.",
  alternates: { canonical: "/support/returns" },
};

export default function ReturnsPage() {
  return (
    <CmsPage
      slug="returns"
      eyebrow="Support · Returns"
      aside={
        <div className="glass space-y-4 rounded-3xl p-6">
          <p className="font-medium">Start a return</p>
          <p className="text-sm text-muted">We&apos;ll arrange pickup in hub cities or send courier instructions worldwide.</p>
          <ButtonLink href="/support/contact?topic=return" className="w-full">Request return</ButtonLink>
        </div>
      }
    />
  );
}
