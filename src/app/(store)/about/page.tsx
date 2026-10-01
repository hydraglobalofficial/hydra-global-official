import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Eye,
  Handshake,
  Headphones,
  ShoppingBag,
  Store,
  Target,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HeroEmblem } from "@/components/about/hero-emblem";
import { Manifesto } from "@/components/about/manifesto";
import { ValuesStack } from "@/components/about/values-stack";
import { Journey } from "@/components/about/journey";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About HYDRA",
  description:
    "HYDRA is a mobile accessories brand for iPhone and Samsung Galaxy — protection, precision and progression in every product. Technology within reach.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "2023", label: "Founded in Dhaka" },
  { value: "50K+", label: "Devices equipped" },
  { value: "64", label: "Districts served" },
  { value: "18", label: "Flagship models" },
  { value: "4.9★", label: "Customer rating" },
];

const divisions = [
  { icon: ShoppingBag, title: "Retail & e-commerce", text: "Direct-to-customer sales through hydra.com.bd with cash on delivery nationwide.", href: "/shop" },
  { icon: Store, title: "Wholesale & distribution", text: "Trade pricing and priority stock for retailers and repair shops across Bangladesh.", href: "/contact?topic=wholesale#write" },
  { icon: Headphones, title: "After-sales & warranty", text: "Installation help, warranty claims and replacements handled by our own team.", href: "/support/warranty" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-[40rem] rounded-full bg-accent/15 blur-[130px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-white/[0.04] blur-[110px]" />
        <div className="container-page relative grid items-center gap-12 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="space-y-7">
            <Eyebrow>About HYDRA</Eyebrow>
            <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              Mobile accessories <span className="text-accent">within reach.</span>
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted">
              HYDRA designs and delivers essentials for flagship phones — screen armor, cases, camera gear and everyday accessories —
              built on protection, precision and progression. {siteConfig.slogan}.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop accessories <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline">
                Talk to us
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
        text="We believe the most important device in your life deserves accessories that are engineered, not guessed. Genuine materials. Precise fit. Honest service. That is the HYDRA standard."
        highlight={["engineered", "Genuine", "Precise", "Honest", "HYDRA"]}
      />

      <section className="container-page py-24">
        <SectionHeading align="center" eyebrow="Why we exist" title={<>Mission &amp; <span className="text-muted">vision.</span></>} />
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
                  To make world-class mobile accessories affordable and accessible to every smartphone owner in Bangladesh.
                </p>
                <ul className="mt-8 space-y-3 text-muted">
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />Device-specific fit across protectors, cases and more</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />Verified-genuine products at honest, published prices</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />Real people on support, in all 64 districts</li>
                </ul>
              </div>
            </SpotlightCard>
          </RevealItem>
          <RevealItem className="h-full">
            <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/[0.05] blur-3xl" />
              <div className="relative">
                <div className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-fg">
                  <Eye size={26} strokeWidth={1.6} />
                </div>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">Our vision</p>
                <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance md:text-3xl">
                  To become South Asia&apos;s most trusted mobile accessories brand — the name people choose first, and recommend without hesitation.
                </p>
                <ul className="mt-8 space-y-3 text-muted">
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/60" />A partner network in every major city</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/60" />Expanding categories beyond the screen</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/60" />Accessories for every device you carry</li>
                </ul>
              </div>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </section>

      <section className="container-page grid gap-10 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="lg:sticky lg:top-[7.25rem] lg:self-start">
          <Eyebrow>Core values</Eyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Six principles. <span className="text-muted">Zero compromise.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">
            They shape who we hire, what we build and how we treat every customer — from a single case to a full accessories kit.
          </p>
          <p className="mt-8 hidden font-mono text-[11px] uppercase tracking-[0.28em] text-subtle lg:block">
            Scroll to stack →
          </p>
        </div>
        <ValuesStack />
      </section>

      <section className="container-page py-24">
        <SectionHeading
          eyebrow="What we do"
          title={<>How HYDRA <span className="text-muted">serves you.</span></>}
          description="From a single order in Sylhet to a shop restock in Gulshan — retail, wholesale and after-sales under one roof."
        />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
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
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[140px]" />
        <div className="container-page relative">
          <SectionHeading align="center" eyebrow="Our journey" title={<>From one idea to <span className="text-muted">50,000 devices.</span></>} />
          <Journey />
        </div>
      </section>

      <section className="container-page pb-28 pt-8">
        <RevealGroup className="grid gap-5 lg:grid-cols-2" stagger={0.1}>
          <RevealItem className="h-full">
            <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-10">
              <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-accent/15 blur-3xl" />
              <Briefcase className="relative text-accent" size={26} strokeWidth={1.6} />
              <h3 className="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Build with HYDRA.</h3>
              <p className="relative mt-3 max-w-md text-muted">We&apos;re growing across product, ops and customer experience in Dhaka.</p>
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
              <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-white/[0.05] blur-3xl" />
              <Handshake className="relative text-accent" size={26} strokeWidth={1.6} />
              <h3 className="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Partner with HYDRA.</h3>
              <p className="relative mt-3 max-w-md text-muted">Retailers and distributors — let&apos;s grow genuine mobile accessories together.</p>
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
