import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "@/components/ui/social-links";
import { PageHeader } from "@/components/ui/primitives";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with HYDRA for business, wholesale or general enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const details = [
    { icon: MapPin, label: "Office", value: siteConfig.address },
    { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}` },
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: Clock, label: "Hours", value: siteConfig.hours },
  ];
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." description="Wholesale, partnerships, press or just a question — we read every message." />
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_24rem]">
        <InquiryForm defaultType="CONTACT" />
        <aside className="space-y-4">
          {details.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="glass flex items-start gap-4 rounded-2xl p-5">
              <Icon size={18} className="mt-0.5 text-accent" />
              <div>
                <p className="text-xs text-muted">{label}</p>
                {href ? <a href={href} className="text-sm hover:text-accent">{value}</a> : <p className="text-sm">{value}</p>}
              </div>
            </div>
          ))}
          <div className="glass rounded-2xl p-5">
            <SocialLinks itemClassName="size-11 rounded-xl" />
          </div>
        </aside>
      </div>
    </>
  );
}
