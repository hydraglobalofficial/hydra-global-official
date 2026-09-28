import type { Metadata } from "next";
import { Clock, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/primitives";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get help with orders, installation, warranty claims and returns from the HYDRA support team.",
  alternates: { canonical: "/support/contact" },
};

const topicMap = { warranty: "WARRANTY", return: "RETURN", returns: "RETURN" } as const;

export default async function SupportContactPage({ searchParams }: PageProps<"/support/contact">) {
  const { topic, code } = await searchParams;
  const type = typeof topic === "string" && topic in topicMap ? topicMap[topic as keyof typeof topicMap] : "SUPPORT";
  const defaultMessage =
    topic === "authenticity" && typeof code === "string"
      ? `I'd like to report a possible counterfeit. Verification code: ${code}\n\nWhere I bought it: `
      : undefined;

  return (
    <>
      <PageHeader eyebrow="Support" title="Contact support" description="Warranty claims, returns, installation trouble — tell us what's up and we'll sort it." />
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_20rem]">
        <InquiryForm showType defaultType={type} defaultMessage={defaultMessage} />
        <aside className="space-y-4">
          {[
            { icon: Phone, label: "Call / WhatsApp", value: siteConfig.phone },
            { icon: Mail, label: "Email", value: siteConfig.email },
            { icon: Clock, label: "Hours", value: siteConfig.hours },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass flex items-center gap-4 rounded-2xl p-5">
              <Icon size={18} className="text-accent" />
              <div>
                <p className="text-xs text-muted">{label}</p>
                <p className="text-sm">{value}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
