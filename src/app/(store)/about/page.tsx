import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Eye,
  FileCheck2,
  Handshake,
  Headphones,
  ShoppingBag,
  Store,
  Target,
  Truck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HeroEmblem } from "@/components/about/hero-emblem";
import { Manifesto } from "@/components/about/manifesto";
import { ValuesStack } from "@/components/about/values-stack";
import { Journey } from "@/components/about/journey";
import { companyInfo, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About HYDRA",
  description:
    "HYDRA Global Ltd. is a Dhaka-based private limited company engineering precision screen protection for iPhone and Samsung Galaxy. Our mission, vision, values and journey.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "2023", label: "Founded in Dhaka" },
  { value: "50K+", label: "Phones protected" },
  { value: "64", label: "Districts served" },
  { value: "18", label: "Flagship models" },
  { value: "4.9★", label: "Customer rating" },
];

const divisions = [
  { icon: ShoppingBag, title: "Retail & e-commerce", text: "Direct-to-customer sales through hydra.com.bd with cash on delivery nationwide.", href: "/shop" },
  { icon: Store, title: "Wholesale & distribution", text: "Trade pricing and priority stock for retailers and repair shops across Bangladesh.", href: "/contact?topic=wholesale#write" },
  { icon: Building2, title: "Corporate supply", text: "Bulk protection for company fleets with VAT invoices and a dedicated account manager.", href: "/contact?topic=corporate#write" },
  { icon: Headphones, title: "After-sales & warranty", text: "Installation help, 12-month warranty claims and replacements handled by our own team.", href: "/warranty" },
];

const leadership = [
  { name: "Arif Rahman", role: "Founder & Managing Director", initials: "AR" },
  { name: "Nusrat Jahan", role: "Director, Operations", initials: "NJ" },
  { name: "Tanvir Hasan", role: "Head of Product Engineering", initials: "TH" },
  { name: "Farhana Akter", role: "Head of Customer Experience", initials: "FA" },
];

const corporateRows = [
  { label: "Registered name", value: siteConfig.legalName },
  { label: "Legal form", value: companyInfo.legalForm },
  { label: "Incorporated", value: `${companyInfo.incorporated} · ${companyInfo.jurisdiction}` },
  { label: "Company registration", value: companyInfo.registrationNo },
  { label: "Trade licence", value: companyInfo.tradeLicense },
  { label: "e-TIN", value: companyInfo.tin },
  { label: "VAT registration (BIN)", value: companyInfo.bin },
  { label: "Registered office", value: companyInfo.registeredOffice },
];

const commitments = [
  { icon: FileCheck2, title: "VAT-compliant invoicing", text: "Every order can be issued with an official invoice." },
  { icon: Truck, title: "Transparent delivery", text: "Published shipping rates, no hidden charges at the door." },
  { icon: Handshake, title: "Fair trade terms", text: "Clear written terms for every wholesale partner." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-[40rem] rounded-full bg-accent/15 blur-[130px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-accent-2/15 blur-[110px]" />
        <div className="container-page relative grid items-center gap-12 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="space-y-7">
            <Eyebrow>About {siteConfig.legalName}</Eyebrow>
            <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              Engineering the armor <span className="text-gradient">Bangladesh&apos;s phones</span> deserve.
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted">
              {siteConfig.legalName} is a Dhaka-based private limited company that designs, sources and delivers precision protection for the
              world&apos;s flagship phones — built on engineering, honesty and service you can actually reach.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                Explore products <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="#corporate" size="lg" variant="outline">
                Company information
              </ButtonLink>
            </div>
          </Reveal>
          <HeroEmblem />
        </div>

        <div className="container-page relative pb-20">
          <RevealGroup className="glass grid grid-cols-2 divide-line overflow-hidden rounded-3xl md:grid-cols-5 md:divide-x" stagger={0.06}>
            {stats.map((s) => (
              <RevealItem key={s.label} className="px-6 py-7 text-center">
                <p className="text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Manifesto
        text="We believe the most important device in your life deserves protection that is engineered, not guessed. Genuine materials. Precise fit. Honest service. That is the HYDRA standard."
        highlight={["engineered", "Genuine", "Precise", "Honest", "HYDRA"]}
      />

      <section className="container-page py-24">
        <SectionHeading align="center" eyebrow="Why we exist" title={<>Mission &amp; <span className="text-gradient">vision.</span></>} />
        <RevealGroup className="grid gap-5 lg:grid-cols-2" stagger={0.12}>
          <RevealItem className="h-full">
            <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-12">
              <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-accent/15 blur-3xl" />
              <div className="relative">
                <div className="grid size-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                  <Target size={26} strokeWidth={1.6} />
                </div>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Our mission</p>
                <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance md:text-3xl">
                  To make world-class, genuinely engineered phone protection affordable and accessible to every smartphone owner in Bangladesh.
                </p>
                <ul className="mt-8 space-y-3 text-muted">
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />Device-specific engineering for every model we sell</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />Verified-genuine products at honest, published prices</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />Real people on support, in all 64 districts</li>
                </ul>
              </div>
            </SpotlightCard>
          </RevealItem>
          <RevealItem className="h-full">
            <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent-2/20 blur-3xl" />
              <div className="relative">
                <div className="grid size-14 place-items-center rounded-2xl border border-accent-2/30 bg-accent-2/10 text-accent-2">
                  <Eye size={26} strokeWidth={1.6} />
                </div>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">Our vision</p>
                <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance md:text-3xl">
                  To become South Asia&apos;s most trusted name in device protection — the brand people choose first, and recommend without hesitation.
                </p>
                <ul className="mt-8 space-y-3 text-muted">
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2" />A partner network in every major city</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2" />Our own R&amp;D and quality lab in Dhaka</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2" />Protection for every device you carry</li>
                </ul>
              </div>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </section>

      <section className="container-page grid gap-12 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Core values</Eyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Six principles. <span className="text-gradient">Zero compromise.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">
            They shape who we hire, what we build and how we treat every customer — from a single protector to a thousand-unit corporate order.
          </p>
        </div>
        <ValuesStack />
      </section>

      <section className="container-page py-24">
        <SectionHeading
          eyebrow="What we do"
          title={<>One company. <span className="text-gradient">Four divisions.</span></>}
          description="From a single order in Sylhet to a fleet rollout in Gulshan, every part of HYDRA runs under one roof."
        />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {divisions.map(({ icon: Icon, title, text, href }) => (
            <RevealItem key={title} className="h-full">
              <SpotlightCard className="group h-full">
                <Link href={href} className="flex h-full flex-col p-7">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl border border-line bg-white/5 text-accent">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <ArrowUpRight size={18} className="text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm text-pretty text-muted">{text}</p>
                </Link>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-accent-2/10 blur-[140px]" />
        <div className="container-page relative">
          <SectionHeading align="center" eyebrow="Our journey" title={<>From one idea to <span className="text-gradient">50,000 phones.</span></>} />
          <Journey />
        </div>
      </section>

      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Leadership"
          title={<>The people behind <span className="text-gradient">HYDRA.</span></>}
          description="A small, hands-on team of engineers, operators and service people — accountable for every box that leaves our warehouse."
        />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {leadership.map((p, i) => (
            <RevealItem key={p.name}>
              <SpotlightCard className="group overflow-hidden p-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2">
                  <div className="bg-dots absolute inset-0 opacity-40" />
                  <div
                    className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-125"
                    style={{ background: ["#3de3ff33", "#7b61ff40", "#00ffa326", "#3de3ff33"][i % 4] }}
                  />
                  <span className="text-gradient absolute inset-0 grid place-items-center text-5xl font-semibold tracking-tight">{p.initials}</span>
                </div>
                <h3 className="mt-5 font-medium">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.role}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section id="corporate" className="container-page scroll-mt-28 py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Eyebrow>Corporate information</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              A registered company <span className="text-gradient">you can verify.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted">
              {siteConfig.legalName} is incorporated in Bangladesh and fully registered for trade and VAT. Partners and corporate buyers can request our
              complete company profile and documents.
            </p>
            <div className="mt-8 space-y-4">
              {commitments.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/5 text-accent">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <ButtonLink href="/contact?topic=corporate#write" variant="outline" className="mt-8">
              Request company profile <ArrowRight size={16} />
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-premium relative overflow-hidden rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-line px-7 py-5">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-accent" />
                  <p className="font-medium">Company fact sheet</p>
                </div>
                <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-success">
                  Active
                </span>
              </div>
              <dl className="divide-y divide-line">
                {corporateRows.map((row) => (
                  <div key={row.label} className="grid gap-1 px-7 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                    <dt className="text-sm text-muted">{row.label}</dt>
                    <dd className="font-mono text-sm text-fg">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-28 pt-8">
        <RevealGroup className="grid gap-5 lg:grid-cols-2" stagger={0.1}>
          <RevealItem className="h-full">
            <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-10">
              <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-accent/15 blur-3xl" />
              <Briefcase className="relative text-accent" size={26} strokeWidth={1.6} />
              <h3 className="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Build the future of protection with us.</h3>
              <p className="relative mt-3 max-w-md text-muted">We&apos;re hiring across engineering, operations and customer experience in Dhaka.</p>
              <a
                href={`mailto:careers@hydra.com.bd?subject=${encodeURIComponent("Careers at HYDRA")}`}
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
              >
                View careers <ArrowRight size={16} />
              </a>
            </SpotlightCard>
          </RevealItem>
          <RevealItem className="h-full">
            <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-10">
              <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-accent-2/20 blur-3xl" />
              <Handshake className="relative text-accent-2" size={26} strokeWidth={1.6} />
              <h3 className="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Partner with HYDRA.</h3>
              <p className="relative mt-3 max-w-md text-muted">Retailers, distributors and brands — let&apos;s grow the market for genuine protection together.</p>
              <Link
                href="/contact?topic=partnership#write"
                className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-fg transition-colors hover:bg-white/5"
              >
                Start a partnership <ArrowRight size={16} />
              </Link>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </section>
    </>
  );
}
