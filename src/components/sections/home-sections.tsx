"use client";

import Link from "next/link";
import { ArrowRight, Droplets, Fingerprint, Layers, PackageCheck, ScanLine, ShoppingBag, Sparkles, Truck, Wrench, Zap } from "lucide-react";
import { motion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BrandPlatformMedia } from "@/components/sections/brand-platform-media";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import type { BrandRecord } from "@/config/site";
import type { HowItWorksContent, NewsletterContent } from "@/content/site-sections";
import type { NavigationData } from "@/server/queries/catalog";

/** Local originals — latest flagship camera / back plates per brand. */
const DEFAULT_BRAND_TILES: Record<string, string> = {
  iphone: "/brands/iphone.jpg",
  samsung: "/brands/samsung.jpg",
};

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
      image: brand.image?.trim() || DEFAULT_BRAND_TILES[brand.slug] || null,
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
                className="relative flex min-h-[20rem] flex-col gap-6 overflow-hidden p-5 sm:min-h-[24rem] sm:flex-row sm:items-center sm:gap-3 sm:p-8 md:min-h-[25rem] md:p-9"
              >
                <div
                  className={`pointer-events-none absolute -right-10 top-1/3 size-[20rem] rounded-full ${card.glow} blur-[100px] opacity-45 transition-opacity duration-700 group-hover:opacity-85`}
                />
                <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000_15%,transparent_80%)]" />

                <div className="relative z-[1] flex min-w-0 flex-1 flex-col justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:text-[11px] sm:tracking-[0.25em]">
                    {card.count} models supported
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:mt-3.5 sm:text-4xl md:text-[2.75rem]">
                    {card.brand.label}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted sm:mt-2.5 sm:text-[0.95rem]">{card.brand.blurb}</p>
                  <div className="mt-4 flex max-w-md flex-wrap gap-2">
                    {card.models.map((m) => (
                      <span
                        key={m.slug}
                        className="rounded-full border border-line bg-bg/40 px-2.5 py-1 text-[11px] text-muted backdrop-blur-sm sm:px-3 sm:text-xs light:bg-white/70"
                      >
                        {m.model}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-line-strong bg-bg/55 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-all group-hover:border-accent/45 group-hover:bg-accent/10 light:bg-white/85">
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

const tech = [
  { icon: Layers, title: "5-layer construction", text: "Anti-shatter film, tempered core, optical adhesive, AR coat and oleophobic top layer.", stat: "5 layers" },
  { icon: Zap, title: "Impact absorption", text: "Drop-tested from 2 meters onto granite. Glass sacrifices itself — your screen doesn't.", stat: "2 m drop" },
  { icon: Fingerprint, title: "Ultrasonic ready", text: "Certified with in-display fingerprint readers on Galaxy S and iPhone Face ID sensors.", stat: "100% touch" },
  { icon: Droplets, title: "Hydrophobic coat", text: "Water and oil bead off. Wipes clean with a single swipe.", stat: "110° contact" },
  { icon: ScanLine, title: "Laser-cut precision", text: "±0.05mm tolerance ensures full coverage without case conflicts.", stat: "±0.05 mm" },
  { icon: Sparkles, title: "Dust-free install", text: "Alignment frame and clean-room kit included in every box.", stat: "2 min fit" },
];

export function TechGrid() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 md:py-28">
      <div className="light-wash pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(30,64,175,0.12),transparent_65%)]" />
      <div className="container-page relative">
        <SectionHeading align="center" eyebrow="Engineering" title={<>Protection, <span className="text-muted">re-engineered.</span></>} description="Every HYDRA protector is designed in-house and quality-checked batch by batch." />
        <RevealGroup className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {tech.map(({ icon: Icon, title, text, stat }) => (
            <RevealItem key={title} className="h-full min-w-0">
              <SpotlightCard className="group h-full overflow-hidden p-5 sm:p-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="relative grid size-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
                    <span className="absolute inset-0 rounded-2xl bg-accent/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                    <Icon className="relative transition-transform duration-500 group-hover:scale-110" size={22} />
                  </span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-subtle transition-colors group-hover:border-accent/30 group-hover:text-accent">{stat}</span>
                </div>
                <h3 className="mt-8 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
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
                  <div className="pointer-events-none absolute -right-6 -top-6 font-mono text-6xl font-semibold text-white/[0.03] transition-colors group-hover:text-accent/[0.1]">
                    0{i + 1}
                  </div>
                  <div className="relative flex items-center gap-4">
                    <span className="relative grid size-12 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-105">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-xs tracking-[0.2em] text-subtle">STEP 0{i + 1}</span>
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
