import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/primitives";
import { allFaqs, faqGroups } from "@/content/faq";
import { JsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about HYDRA delivery, payment, compatibility and returns.",
  alternates: { canonical: "/support/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <PageHeader eyebrow="Support · FAQ" title="Frequently asked questions" description="Can't find what you need? Our team replies within one business day." />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[14rem_1fr]">
        <nav className="hidden space-y-1 lg:sticky lg:top-28 lg:block lg:self-start" aria-label="FAQ sections">
          {faqGroups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg">
              {g.title}
            </a>
          ))}
        </nav>
        <div className="space-y-14">
          {faqGroups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent">{group.title}</h2>
              <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {group.items.map((item) => (
                  <details key={item.question} className="group bg-surface open:bg-surface-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-medium [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <Plus size={18} className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-accent" />
                    </summary>
                    <p className="px-6 pb-6 leading-relaxed text-muted">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="glass flex flex-col items-start justify-between gap-4 rounded-3xl p-8 md:flex-row md:items-center">
            <div>
              <p className="text-lg font-medium">Still have questions?</p>
              <p className="text-sm text-muted">Send us a message and we&apos;ll get back to you quickly.</p>
            </div>
            <ButtonLink href="/support/contact">Contact support</ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
