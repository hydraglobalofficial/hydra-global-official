"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, Fingerprint, Layers, PackageCheck, ScanLine, ShoppingBag, Sparkles, Truck, Wrench, Zap } from "lucide-react";
import { motion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BrandPlatformMedia } from "@/components/sections/brand-platform-media";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import type { BrandRecord } from "@/config/site";
import type { HowItWorksContent, NewsletterContent, TechContent } from "@/content/site-sections";
import type { NavigationData } from "@/server/queries/catalog";

export function ShopByDevice({
  devices,
  brands,
}: {
  devices: NavigationData["devices"];
  brands: BrandRecord[];
}) {
  const cards = brands.map((brand, i) => {
    const models = devices.filter((d) => d.brand === brand.code);
    return {
      brand,
      glow: i % 2 === 0 ? "bg-accent/30" : "bg-sky-500/15",
      count: models.length,
      models: models.slice(0, 4),
      latest: models[0]?.model ?? brand.label,
      image: brand.image?.trim() || null,
    };
  });

  return (
    <section className="container-page py-14 sm:py-20 md:py-24">
      <SectionHeading eyebrow="Shop by device" title={<>Pick your <span className="text-muted">platform.</span></>} />
      <RevealGroup
        className={`grid gap-4 sm:gap-5 ${cards.length > 2 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}
        stagger={0.12}
      >
        {cards.map((card) => (
          <RevealItem key={card.brand.slug} className="min-w-0">
            <SpotlightCard className="group h-full overflow-hidden">
              <Link
                href={`/shop/${card.brand.slug}`}
                className="relative flex min-h-[20rem] flex-col gap-6 overflow-hidden p-5 sm:min-h-[22rem] sm:flex-row sm:items-center sm:gap-5 sm:p-7 md:min-h-[23rem] md:gap-6 md:p-8"
              >
                <div
                  className={`pointer-events-none absolute -right-10 top-1/3 size-[18rem] rounded-full ${card.glow} blur-[100px] opacity-40 transition-opacity duration-700 group-hover:opacity-75`}
                />
                <div className="bg-dots pointer-events-none absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,#000_15%,transparent_80%)]" />

                <div className="relative z-[1] flex min-w-0 flex-1 flex-col justify-center pr-1" style={{ minWidth: "12rem" }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:text-[11px] sm:tracking-[0.25em]">
                    {card.count} models supported
                  </p>
                  <h3 className="mt-2.5 text-3xl font-semibold tracking-tight sm:mt-3 sm:text-4xl md:text-[2.5rem]">
                    {card.brand.label}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted sm:text-[0.95rem]">{card.brand.blurb}</p>
                  <div className="mt-4 flex max-w-md flex-wrap gap-2">
                    {card.models.map((m) => (
                      <span
                        key={m.slug}
                        className="rounded-full border border-line bg-bg/40 px-2.5 py-1 text-[11px] text-muted backdrop-blur-sm sm:px-3 sm:text-xs light:border-[#C5E0F3] light:bg-white"
                      >
                        {m.model}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-line-strong bg-bg/55 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-all group-hover:border-accent/45 group-hover:bg-accent/10 light:border-[#C5E0F3] light:bg-white">
                    Shop {card.brand.label}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

                <BrandPlatformMedia
                  slug={card.brand.slug}
                  code={card.brand.code}
                  image={card.image}
                  label={card.latest}
                  className="relative z-[1]"
                />
              </Link>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

const techIcons = [Layers, Zap, Fingerprint, Droplets, ScanLine, Sparkles];

export function TechGrid({ content }: { content: TechContent }) {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 md:py-28">
      <div className="light-wash pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(30,64,175,0.12),transparent_65%)]" />
      <div className="container-page relative">
        <SectionHeading
          align="center"
          eyebrow={content.eyebrow}
          title={
            <>
              {content.title} <span className="text-muted">{content.titleMuted}</span>
            </>
          }
          description={content.description}
        />
        <RevealGroup className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {content.cards.slice(0, 6).map((card, i) => {
            const Icon = techIcons[i % techIcons.length]!;
            const photo = Boolean(card.image);
            return (
              <RevealItem key={`${card.title}-${i}`} className="h-full min-w-0">
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border p-5 sm:p-6 ${
                    photo
                      ? "min-h-[17.5rem] justify-between border-white/15 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.7)]"
                      : "border-line bg-surface light:border-[#C5E0F3] light:bg-white"
                  }`}
                >
                  {photo ? (
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                  {photo ? (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
                  ) : (
                    <>
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                      <div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-accent/[0.08] blur-2xl" />
                    </>
                  )}
                  <div className="relative flex items-start justify-between gap-3">
                    <span
                      className={`grid size-11 place-items-center rounded-2xl border backdrop-blur-sm ${
                        photo
                          ? "border-white/25 bg-white/15 text-white"
                          : "border-accent/25 bg-accent/10 text-accent"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    {card.stat ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide backdrop-blur-sm ${
                          photo
                            ? "border-white/25 bg-black/35 text-white"
                            : "border-line bg-surface-2 text-accent light:border-[#C5E0F3] light:bg-white"
                        }`}
                      >
                        {card.stat}
                      </span>
                    ) : null}
                  </div>
                  <div className={photo ? "relative mt-10" : "relative mt-6"}>
                    <h3 className={`text-lg font-semibold tracking-tight ${photo ? "text-white" : "text-fg"}`}>
                      {card.title}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${photo ? "text-white/80" : "text-muted"}`}>{card.text}</p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

const stepIcons = [ShoppingBag, Truck, Wrench, PackageCheck];

export function HowItWorks({ content }: { content: HowItWorksContent }) {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <div className="light-wash pointer-events-none absolute left-1/2 top-16 h-56 w-[min(100%,40rem)] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[120px]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={
            <>
              {content.title} <span className="text-muted">{content.titleMuted}</span>
            </>
          }
        />
        <RevealGroup className="relative grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          <div aria-hidden className="divider-glow absolute left-8 right-8 top-[3.25rem] hidden lg:block" />
          {content.steps.map(({ title, text }, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <RevealItem key={title} className="relative h-full min-w-0">
                <SpotlightCard className="group h-full overflow-hidden p-5 sm:p-7">
                  <div className="relative flex items-center gap-4">
                    <span className="relative grid size-12 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-105">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-xs font-medium tracking-[0.18em] text-accent">
                      STEP 0{i + 1}
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-lg font-medium">{title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

export function NewsletterBlock({ content }: { content: NewsletterContent }) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="card-premium relative overflow-hidden rounded-[1.5rem] px-4 py-12 text-center sm:rounded-[2rem] sm:px-6 sm:py-16 md:py-24">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[min(100%,36rem)] -translate-x-1/2 rounded-full bg-accent/25 blur-[90px]"
          animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-white/[0.05] blur-[90px]" />
        <motion.div
          className="relative mx-auto max-w-xl space-y-5 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{content.eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {content.title} <span className="text-accent">{content.titleAccent}</span> list.
          </h2>
          <p className="text-sm text-muted sm:text-base">{content.description}</p>
          <NewsletterForm className="mx-auto max-w-md text-left" />
        </motion.div>
      </div>
    </section>
  );
}
