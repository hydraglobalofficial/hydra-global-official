import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
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
import { defaultAboutContent } from "@/content/site-sections";
import { getAboutContent } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "About HYDRA",
  description:
    "HYDRA Global Ltd. — company overview, mission and the story behind precision mobile accessories for iPhone and Samsung Galaxy.",
  alternates: { canonical: "/about" },
};

const divisionIcons = [ShoppingBag, Store, Headphones];

export default async function AboutPage() {
  const content = await getAboutContent();
  const company = content.company ?? defaultAboutContent.company;

  return (
    <>
      <section className="relative min-h-[min(92vh,52rem)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_10%,rgba(30,64,175,0.28),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,#000,transparent_78%)]" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />
        <div className="pointer-events-none absolute -left-24 top-1/3 size-[28rem] rounded-full bg-accent/20 blur-[140px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-white/[0.04] blur-[110px]" />

        <div className="container-page relative grid min-h-[min(72vh,40rem)] items-center gap-10 pb-10 pt-16 md:gap-14 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:pb-14">
          <Reveal className="space-y-7 md:space-y-8">
            <Eyebrow>{content.hero.eyebrow}</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl lg:text-[5.25rem] lg:leading-[0.95]">
              {content.hero.title}
              <br />
              <span className="text-accent">{content.hero.titleAccent}</span>
            </h1>
            <p className="max-w-xl text-lg text-pretty leading-relaxed text-muted md:text-xl">{content.hero.description}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink href="/shop" size="lg">
                Shop accessories <ArrowRight size={18} />
              </ButtonLink>
              {company.visible ? (
                <ButtonLink href="#corporate" size="lg" variant="outline">
                  Company information
                </ButtonLink>
              ) : (
                <ButtonLink href="/contact" size="lg" variant="outline">
                  Talk to us
                </ButtonLink>
              )}
            </div>
          </Reveal>
          <HeroEmblem />
        </div>

        <div className="container-page relative pb-20 md:pb-24">
          <RevealGroup
            className="card-premium grid grid-cols-2 overflow-hidden rounded-[1.75rem] md:grid-cols-5 md:divide-x md:divide-white/[0.06]"
            stagger={0.06}
          >
            {content.stats.map((s) => (
              <RevealItem
                key={s.label}
                className="group relative border-b border-white/[0.06] px-5 py-7 text-center last:border-b-0 odd:border-r odd:border-white/[0.06] md:border-b-0 md:border-r-0 md:px-6 md:py-9 odd:md:border-r-0"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="relative text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</p>
                <p className="relative mt-2 text-[10px] uppercase tracking-[0.2em] text-muted md:text-xs">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Manifesto text={content.manifesto.text} highlight={content.manifesto.highlight} />

      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-[radial-gradient(ellipse_at_center,rgba(30,64,175,0.12),transparent_70%)]" />
        <div className="container-page relative">
          <SectionHeading
            align="center"
            eyebrow="Why we exist"
            title={
              <>
                Mission &amp; <span className="text-muted">vision.</span>
              </>
            }
          />
          <RevealGroup className="grid gap-5 lg:grid-cols-2" stagger={0.12}>
            <RevealItem className="h-full">
              <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-12">
                <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-accent/20 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 font-mono text-[7rem] font-semibold leading-none text-white/[0.03] md:text-[9rem]">
                  01
                </div>
                <div className="relative">
                  <div className="grid size-14 place-items-center rounded-2xl border border-accent/35 bg-accent/12 text-accent shadow-[0_0_40px_-10px_rgba(30,64,175,0.85)]">
                    <Target size={26} strokeWidth={1.6} />
                  </div>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{content.mission.title}</p>
                  <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance md:text-3xl">
                    {content.mission.body}
                  </p>
                  <ul className="mt-8 space-y-3 text-muted">
                    {content.mission.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </RevealItem>
            <RevealItem className="h-full">
              <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-12">
                <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/[0.06] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 font-mono text-[7rem] font-semibold leading-none text-white/[0.03] md:text-[9rem]">
                  02
                </div>
                <div className="relative">
                  <div className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-fg">
                    <Eye size={26} strokeWidth={1.6} />
                  </div>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">{content.vision.title}</p>
                  <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance md:text-3xl">
                    {content.vision.body}
                  </p>
                  <ul className="mt-8 space-y-3 text-muted">
                    {content.vision.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <section className="container-page grid gap-10 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="lg:sticky lg:top-[7.25rem] lg:self-start">
          <Eyebrow>Core values</Eyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {content.valuesIntro.title} <span className="text-muted">{content.valuesIntro.titleMuted}</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">{content.valuesIntro.description}</p>
          <p className="mt-8 hidden font-mono text-[11px] uppercase tracking-[0.28em] text-subtle lg:block">
            Scroll to stack →
          </p>
        </div>
        <ValuesStack values={content.values} />
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(30,64,175,0.1),transparent_65%)]" />
        <div className="container-page relative">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                How HYDRA <span className="text-muted">serves you.</span>
              </>
            }
            description="From a single order across the world to a shop restock downtown — retail, wholesale and after-sales under one roof."
          />
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {content.divisions.map((d, i) => {
              const Icon = divisionIcons[i % divisionIcons.length];
              const index = String(i + 1).padStart(2, "0");
              return (
                <RevealItem key={d.title} className="h-full">
                  <SpotlightCard className="group h-full">
                    <Link href={d.href} className="relative flex h-full flex-col overflow-hidden p-7 md:p-8">
                      <div className="pointer-events-none absolute -right-8 -top-8 font-mono text-7xl font-semibold text-white/[0.03] transition-colors group-hover:text-accent/[0.08]">
                        {index}
                      </div>
                      <div className="relative flex items-start justify-between">
                        <div className="grid size-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-105">
                          <Icon size={22} strokeWidth={1.6} />
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                        />
                      </div>
                      <h3 className="relative mt-10 text-lg font-medium md:text-xl">{d.title}</h3>
                      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-pretty text-muted">{d.text}</p>
                      <span className="relative mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                        Explore <ArrowRight size={12} />
                      </span>
                    </Link>
                  </SpotlightCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[140px]" />
        <div className="container-page relative">
          <SectionHeading
            align="center"
            eyebrow="Our journey"
            title={
              <>
                From one idea to <span className="text-muted">50,000 devices.</span>
              </>
            }
          />
          <Journey milestones={content.journey} />
        </div>
      </section>

      {company.visible && (
        <section id="corporate" className="scroll-mt-28 border-y border-line/60 bg-white/[0.015] py-24 md:py-28">
          <div
            className={
              company.facts.length > 0
                ? "container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"
                : "container-page max-w-3xl"
            }
          >
            <Reveal>
              <Eyebrow>{company.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {company.title} <span className="text-muted">{company.titleMuted}</span>
              </h2>
              <p className="mt-5 max-w-md text-lg text-muted">{company.description}</p>
              {company.commitments.length > 0 && (
                <div className="mt-8 space-y-4">
                  {company.commitments.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/5 text-accent">
                        <CheckCircle2 size={19} strokeWidth={1.7} />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {company.ctaLabel && company.ctaHref && (
                <ButtonLink href={company.ctaHref} variant="outline" className="mt-8">
                  {company.ctaLabel} <ArrowRight size={16} />
                </ButtonLink>
              )}
            </Reveal>

            {company.facts.length > 0 && (
              <Reveal delay={0.1}>
                <div className="card-premium relative overflow-hidden rounded-[2rem]">
                  <div className="flex items-center justify-between border-b border-line px-7 py-5">
                    <div className="flex items-center gap-3">
                      <Building2 size={18} className="text-accent" />
                      <p className="font-medium">{company.sheetTitle}</p>
                    </div>
                    {company.sheetBadge ? (
                      <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-success">
                        {company.sheetBadge}
                      </span>
                    ) : null}
                  </div>
                  <dl className="divide-y divide-line">
                    {company.facts.map((row) => (
                      <div key={row.label} className="grid gap-1 px-7 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                        <dt className="text-sm text-muted">{row.label}</dt>
                        <dd className="font-mono text-sm text-fg">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <section className="container-page pb-28 pt-4">
        <Reveal>
          <div className="card-premium relative overflow-hidden rounded-[2rem] p-1">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(30,64,175,0.22),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.05),transparent_40%)]" />
            <div className="relative grid gap-px overflow-hidden rounded-[1.85rem] bg-white/[0.04] lg:grid-cols-2">
              <div className="relative overflow-hidden bg-black/40 p-8 md:p-10">
                <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-accent/20 blur-3xl" />
                <Briefcase className="relative text-accent" size={26} strokeWidth={1.6} />
                <h3 className="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">{content.careers.title}</h3>
                <p className="relative mt-3 max-w-md text-muted">{content.careers.text}</p>
                <a
                  href={`mailto:careers@hydraglobal.com?subject=${encodeURIComponent("Careers at HYDRA")}`}
                  className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
                >
                  {content.careers.cta} <ArrowRight size={16} />
                </a>
              </div>
              <div className="relative overflow-hidden bg-black/40 p-8 md:p-10">
                <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-white/[0.06] blur-3xl" />
                <Handshake className="relative text-accent" size={26} strokeWidth={1.6} />
                <h3 className="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">{content.partner.title}</h3>
                <p className="relative mt-3 max-w-md text-muted">{content.partner.text}</p>
                <Link
                  href="/contact?topic=partnership#write"
                  className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-fg transition-colors hover:border-accent/40 hover:bg-accent/10"
                >
                  {content.partner.cta} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
