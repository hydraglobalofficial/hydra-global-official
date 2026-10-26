import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
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
        <div className="hydra-film-block container-page relative grid min-h-[min(72vh,40rem)] items-center gap-8 rounded-[2rem] bg-black px-5 pb-10 pt-12 text-white sm:gap-10 sm:px-8 sm:pb-12 sm:pt-16 md:gap-14 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:px-10 lg:pb-14">
          <div className="min-w-0 space-y-6 sm:space-y-7 md:space-y-8 [&_h1]:text-white [&_h1_span]:text-white [&_p]:text-white/75">
            <Eyebrow>{content.hero.eyebrow}</Eyebrow>
            <h1 className="text-balance text-[2.35rem] font-semibold tracking-tight sm:text-5xl md:text-7xl lg:text-[5.25rem] lg:leading-[0.95]">
              {content.hero.title}
              <br />
              <span className="text-white">{content.hero.titleAccent}</span>
            </h1>
            <p className="max-w-xl text-base text-pretty leading-relaxed text-white/70 sm:text-lg md:text-xl">{content.hero.description}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink
                href="/shop"
                size="lg"
                className="border border-white/40 bg-transparent text-white shadow-none hover:border-white hover:bg-white/10"
              >
                Shop accessories <ArrowRight size={18} />
              </ButtonLink>
              {company.visible ? (
                <ButtonLink href="#corporate" size="lg" variant="outline" className="border-white/35 text-white hover:border-white hover:bg-white/10">
                  Company information
                </ButtonLink>
              ) : (
                <ButtonLink href="/contact" size="lg" variant="outline" className="border-white/35 text-white hover:border-white hover:bg-white/10">
                  Talk to us
                </ButtonLink>
              )}
            </div>
          </div>
          <div className="hydra-crest-on-dark rounded-[2rem] bg-black px-3 py-4 lg:bg-transparent lg:p-0">
            <HeroEmblem />
          </div>
        </div>

        <div className="container-page relative pb-14 sm:pb-20 md:pb-24">
          <RevealGroup
            className="card-premium grid grid-cols-2 overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] md:grid-cols-5 md:divide-x md:divide-white/[0.06]"
            stagger={0.06}
          >
            {content.stats.map((s) => (
              <RevealItem
                key={s.label}
                className="group relative min-w-0 border-b border-white/[0.06] px-3 py-5 text-center last:border-b-0 odd:border-r odd:border-white/[0.06] sm:px-5 sm:py-7 md:border-b-0 md:border-r-0 md:px-6 md:py-9 odd:md:border-r-0"
              >
                <p className="relative text-2xl font-semibold tracking-tight text-fg sm:text-3xl md:text-4xl">{s.value}</p>
                <p className="relative mt-1.5 text-[9px] uppercase leading-snug tracking-[0.16em] text-fg/65 sm:mt-2 sm:text-[10px] sm:tracking-[0.2em] md:text-xs">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Manifesto text={content.manifesto.text} highlight={content.manifesto.highlight} />

      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-line-strong to-transparent" />
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
                <div className="pointer-events-none absolute bottom-0 right-0 font-mono text-[7rem] font-semibold leading-none text-fg/[0.04] md:text-[9rem]">
                  01
                </div>
                <div className="relative">
                  <div className="grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface-3 text-fg">
                    <Target size={26} strokeWidth={1.6} />
                  </div>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">{content.mission.title}</p>
                  <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance text-fg md:text-3xl">
                    {content.mission.body}
                  </p>
                  <ul className="mt-8 space-y-3 text-[0.95rem] leading-relaxed text-fg/75">
                    {content.mission.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/55" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </RevealItem>
            <RevealItem className="h-full">
              <SpotlightCard className="relative h-full overflow-hidden p-8 md:p-12">
                <div className="pointer-events-none absolute bottom-0 right-0 font-mono text-[7rem] font-semibold leading-none text-fg/[0.04] md:text-[9rem]">
                  02
                </div>
                <div className="relative">
                  <div className="grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface-3 text-fg">
                    <Eye size={26} strokeWidth={1.6} />
                  </div>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">{content.vision.title}</p>
                  <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-balance text-fg md:text-3xl">
                    {content.vision.body}
                  </p>
                  <ul className="mt-8 space-y-3 text-[0.95rem] leading-relaxed text-fg/75">
                    {content.vision.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fg/55" />
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

      <section className="container-page grid gap-8 py-14 sm:gap-10 sm:py-20 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="min-w-0 lg:sticky lg:top-[7.25rem] lg:self-start">
          <Eyebrow>Core values</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {content.valuesIntro.title} <span className="text-muted">{content.valuesIntro.titleMuted}</span>
          </h2>
          <p className="mt-4 max-w-md text-base text-muted sm:mt-5 sm:text-lg">{content.valuesIntro.description}</p>
          <p className="mt-8 hidden font-mono text-[11px] uppercase tracking-[0.28em] text-subtle lg:block">
            Scroll to stack →
          </p>
        </div>
        <ValuesStack values={content.values} />
      </section>

      <section className="relative overflow-hidden py-24">
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
                  <SpotlightCard className="group h-full overflow-hidden">
                    <Link href={d.href} className="relative flex h-full flex-col overflow-hidden p-7 md:p-8">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute bottom-5 right-5 select-none font-mono text-5xl font-semibold leading-none text-fg/[0.05] transition-colors group-hover:text-fg/[0.08] sm:bottom-6 sm:right-6 sm:text-6xl"
                      >
                        {index}
                      </div>
                      <div className="relative z-[1] flex items-start justify-between">
                        <div className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-surface-3 text-fg transition-transform duration-500 group-hover:scale-105">
                          <Icon size={22} strokeWidth={1.6} />
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                        />
                      </div>
                      <h3 className="relative mt-10 text-lg font-medium text-fg md:text-xl">{d.title}</h3>
                      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-pretty text-muted">{d.text}</p>
                      <span className="relative mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-fg">
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
        <div className="container-page relative">
          <SectionHeading
            align="center"
            eyebrow="Our journey"
            title={
              <>
                From one idea to <span className="text-muted">20,000 devices.</span>
              </>
            }
          />
          <Journey milestones={content.journey} />
        </div>
      </section>

      {company.visible && (
        <section id="corporate" className="scroll-mt-28 border-y border-line/60 bg-white/[0.015] py-24 md:py-28">
          <div className="container-page max-w-3xl">
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
          </div>
        </section>
      )}

      <section className="container-page pb-28 pt-4">
        <Reveal>
          <div className="card-premium relative overflow-hidden rounded-[2rem] p-1">
            <div className="relative grid gap-px overflow-hidden rounded-[1.35rem] bg-line sm:rounded-[1.85rem] lg:grid-cols-2">
              <div className="relative overflow-hidden bg-surface-2 p-6 sm:p-8 md:p-10">
                <Briefcase className="relative text-fg" size={26} strokeWidth={1.6} />
                <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-fg sm:text-2xl md:text-3xl">{content.careers.title}</h3>
                <p className="relative mt-3 max-w-md text-sm text-muted sm:text-base">{content.careers.text}</p>
                <a
                  href={`mailto:careers@hydraglobal.com?subject=${encodeURIComponent("Careers at HYDRA")}`}
                  className="relative mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
                >
                  {content.careers.cta} <ArrowRight size={16} />
                </a>
              </div>
              <div className="relative overflow-hidden bg-surface-2 p-6 sm:p-8 md:p-10">
                <Handshake className="relative text-fg" size={26} strokeWidth={1.6} />
                <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-fg sm:text-2xl md:text-3xl">{content.partner.title}</h3>
                <p className="relative mt-3 max-w-md text-sm text-muted sm:text-base">{content.partner.text}</p>
                <Link
                  href="/contact?topic=partnership#write"
                  className="relative mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-fg transition-colors hover:border-fg/40 hover:bg-surface-3"
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
