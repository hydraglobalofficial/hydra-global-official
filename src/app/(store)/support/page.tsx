import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, HelpCircle, MessageCircle, PackageSearch, RefreshCcw, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { faqGroups } from "@/content/faq";

export const metadata: Metadata = {
  title: "Help Center",
  description: "FAQs, installation help, returns and direct support from the HYDRA team.",
  alternates: { canonical: "/support" },
};

const topics = [
  { href: "/track", icon: PackageSearch, title: "Track order", text: "Status by invoice ID from your confirmation email." },
  { href: "/support/faq", icon: HelpCircle, title: "FAQ", text: "Delivery, compatibility, payments and more." },
  { href: "/installation", icon: Wrench, title: "Installation", text: "Guided, bubble-free fitting for every device." },
  { href: "/support/returns", icon: RefreshCcw, title: "Returns", text: "7-day returns and replacements." },
  { href: "/contact", icon: Building2, title: "Business enquiries", text: "Wholesale, corporate and partnership requests." },
  { href: "/support/contact", icon: MessageCircle, title: "Contact support", text: `Real humans, ${siteConfig.hours}.` },
];

export default function SupportPage() {
  const popular = faqGroups.flatMap((g) => g.items).slice(0, 4);
  return (
    <>
      <PageHeader eyebrow="Help Center" title="How can we help?" description="Find answers fast, or reach the HYDRA support team directly." />
      <section className="container-page grid gap-3 py-10 sm:grid-cols-2 sm:gap-4 sm:py-16 lg:grid-cols-3">
        {topics.map(({ href, icon: Icon, title, text }) => (
          <Link key={href + title} href={href} className="group glass relative min-h-[11rem] rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30 sm:rounded-3xl sm:p-7">
            <ArrowUpRight size={18} className="absolute right-5 top-5 text-subtle transition-colors group-hover:text-accent sm:right-6 sm:top-6" />
            <Icon className="text-accent" />
            <h2 className="mt-6 text-lg font-medium sm:mt-8">{title}</h2>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </Link>
        ))}
      </section>
      <section className="container-page pb-8">
        <h2 className="mb-5 text-xl font-semibold sm:mb-6 sm:text-2xl">Popular questions</h2>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {popular.map((f) => (
            <div key={f.question} className="rounded-2xl border border-line p-5 sm:p-6">
              <p className="font-medium">{f.question}</p>
              <p className="mt-2 text-sm text-muted">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
