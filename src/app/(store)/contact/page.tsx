import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Building2, FileText, Plus, ReceiptText, RotateCcw, ShieldCheck, Truck, UserRound, Wrench } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactForm } from "@/components/contact/contact-form";
import { LiveStatus } from "@/components/contact/live-status";
import { OfficeCard } from "@/components/contact/office-card";
import { isContactTopic } from "@/components/contact/topics";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the HYDRA team in Dhaka — WhatsApp, phone, email or message us for orders, wholesale, partnerships and press.",
  alternates: { canonical: "/contact" },
};

const heroStats = [
  { value: "~2 hrs", label: "Avg. first reply" },
  { value: "4.9★", label: "Support rating" },
  { value: "64", label: "Districts served" },
];

const selfHelp = [
  { icon: BookOpen, title: "FAQ", text: "Delivery, payments and compatibility answers.", href: "/support/faq" },
  { icon: Wrench, title: "Installation", text: "Step-by-step, bubble-free fitting guides.", href: "/installation" },
  { icon: ShieldCheck, title: "Warranty", text: "12-month coverage and how to claim.", href: "/support/warranty" },
  { icon: RotateCcw, title: "Returns", text: "7-day hassle-free returns and replacements.", href: "/support/returns" },
];

const businessPerks = [
  { icon: ReceiptText, text: "Volume pricing from 20+ units" },
  { icon: UserRound, text: "Dedicated account manager" },
  { icon: FileText, text: "VAT invoice & credit terms" },
  { icon: Truck, text: "Priority nationwide dispatch" },
];

const faqs = [
  {
    q: "How fast will I hear back?",
    a: `WhatsApp and phone are answered live during support hours (${siteConfig.hours}). Emails and form messages get a reply within one business day — usually in about two hours.`,
  },
  { q: "Where is my order?", a: "Choose “Order support” in the form and add your order number (e.g. HYD-260928-XXXXXX). We'll reply with live courier status." },
  { q: "Can I visit the office?", a: "Yes — our Gulshan office is open during support hours for pickups and installation help. Message us first so we can have your model ready." },
  { q: "Do you supply shops and companies?", a: "We do. Pick “Wholesale / bulk” or “Corporate orders” and tell us the models and quantities — you'll get a quote within 24 hours." },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { topic } = await searchParams;
  const defaultTopic = isContactTopic(topic) ? topic : "general";

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/60">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -left-32 top-0 size-[30rem] rounded-full bg-accent/15 blur-[140px] animate-aurora-2" />
        <div className="pointer-events-none absolute -right-20 top-24 size-[26rem] rounded-full bg-white/[0.04] blur-[140px] animate-aurora-1" />

        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <Reveal className="space-y-7">
            <Eyebrow>Contact HYDRA</Eyebrow>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-balance md:text-7xl">
              Talk to a human, <span className="text-muted">not a ticket.</span>
            </h1>
            <p className="max-w-lg text-lg text-pretty text-muted">
              Orders, installs, wholesale or press — our Dhaka team answers every message personally. Pick the channel that suits you.
            </p>
            <LiveStatus />
            <dl className="grid max-w-md grid-cols-3 gap-6 border-t border-line pt-7">
              {heroStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-muted">{s.label}</dt>
                  <dd className="font-mono text-2xl font-semibold tracking-tight">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <ContactChannels />
        </div>
      </section>

      <section id="write" className="container-page scroll-mt-28 py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_26rem]">
          <Reveal>
            <ContactForm key={defaultTopic} defaultTopic={defaultTopic} />
          </Reveal>
          <Reveal delay={0.1}>
            <OfficeCard />
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-20">
        <Reveal>
          <div className="card-premium relative overflow-hidden rounded-[2rem] p-8 md:p-12">
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/10 blur-[100px]" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  <Building2 size={12} /> HYDRA for Business
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                  Buying for a store or a team? <span className="text-muted">Let&apos;s talk volume.</span>
                </h2>
                <p className="max-w-lg text-muted">Retailers, repair shops and companies across Bangladesh stock HYDRA. Get trade pricing, a named contact and invoices that keep accounts happy.</p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/contact?topic=wholesale#write"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(30,64,175,0.6)]"
                  >
                    Request a quote <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/contact?topic=partnership#write"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm transition-colors hover:border-accent/50"
                  >
                    Partnership enquiry
                  </Link>
                </div>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {businessPerks.map(({ icon: Icon, text }) => (
                  <li key={text} className="glass flex items-center gap-3 rounded-2xl p-4 text-sm">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                      <Icon size={16} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-page grid gap-12 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">Self-serve</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Maybe it&apos;s already answered.</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {selfHelp.map(({ icon: Icon, title, text, href }) => (
              <Link key={href} href={href} className="group glass flex flex-col gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30">
                <div className="flex items-center justify-between">
                  <Icon size={18} className="text-accent" />
                  <ArrowUpRight size={15} className="text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-xs text-muted">{text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">Before you write</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Quick answers.</h2>
          <div className="divide-y divide-line rounded-2xl border border-line">
            {faqs.map((f, i) => (
              <details key={f.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium">
                  {f.q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line transition-all group-open:rotate-45 group-open:border-accent/50 group-open:text-accent">
                    <Plus size={14} />
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="flex items-center gap-2 text-xs text-subtle">
            <BadgeCheck size={14} className="text-success" /> Every message is read by a real HYDRA team member — no bots.
          </p>
        </Reveal>
      </section>
    </>
  );
}
