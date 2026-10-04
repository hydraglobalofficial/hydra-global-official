"use client";

import { useActionState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  saveAboutSection,
  saveCollectionsSection,
  saveHomeHeroSection,
  saveHowItWorksSection,
  saveNewsletterSection,
} from "@/server/actions/admin";
import type {
  AboutContent,
  CollectionsContent,
  HomeHeroContent,
  HowItWorksContent,
  NewsletterContent,
} from "@/content/site-sections";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { Card } from "@/components/admin/admin-ui";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="space-y-4 p-5 sm:p-6">
      <h2 className="text-sm font-medium tracking-tight">{title}</h2>
      {children}
    </Card>
  );
}

function Label({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      {children}
      {hint ? <p className="text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

function padRows<T>(rows: T[], min: number, empty: T): T[] {
  if (rows.length >= min) return rows;
  return [...rows, ...Array.from({ length: min - rows.length }, () => empty)];
}

export function AboutSectionEditor({ content }: { content: AboutContent }) {
  const [state, action, pending] = useActionState(saveAboutSection, initialFormState);
  const stats = padRows(content.stats, 6, { value: "", label: "" });
  const missionBullets = padRows(content.mission.bullets, 4, "");
  const visionBullets = padRows(content.vision.bullets, 4, "");
  const values = padRows(content.values, 7, { title: "", keyword: "", text: "" });
  const divisions = padRows(content.divisions, 4, { title: "", text: "", href: "" });
  const journey = padRows(content.journey, 6, { year: "", title: "", text: "" });
  const commitments = padRows(content.company.commitments, 5, { title: "", text: "" });
  const facts = padRows(content.company.facts, 8, { label: "", value: "" });

  return (
    <form action={action} className="space-y-5">
      <Section title="Hero">
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Eyebrow"><Input name="heroEyebrow" defaultValue={content.hero.eyebrow} required /></Label>
          <Label label="Title accent"><Input name="heroTitleAccent" defaultValue={content.hero.titleAccent} required /></Label>
        </div>
        <Label label="Title"><Input name="heroTitle" defaultValue={content.hero.title} required /></Label>
        <Label label="Description"><Textarea name="heroDescription" defaultValue={content.hero.description} className="min-h-24" required /></Label>
      </Section>

      <Section title="Stats">
        <p className="text-xs text-subtle">Leave a row blank to skip it. Aim for ~5 filled rows.</p>
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Input name="statValue" defaultValue={s.value} placeholder="Value" />
              <Input name="statLabel" defaultValue={s.label} placeholder="Label" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Manifesto">
        <Label label="Text"><Textarea name="manifestoText" defaultValue={content.manifesto.text} className="min-h-28" required /></Label>
        <Label label="Highlight words (one per line)" hint="Exact words to tint accent blue">
          <Textarea
            name="manifestoHighlights"
            defaultValue={content.manifesto.highlight.join("\n")}
            className="min-h-24 font-mono text-xs"
          />
        </Label>
      </Section>

      <Section title="Mission">
        <Label label="Title"><Input name="missionTitle" defaultValue={content.mission.title} required /></Label>
        <Label label="Body"><Textarea name="missionBody" defaultValue={content.mission.body} className="min-h-24" required /></Label>
        {missionBullets.map((b, i) => (
          <Input key={i} name="missionBullet" defaultValue={b} placeholder={`Bullet ${i + 1}`} />
        ))}
      </Section>

      <Section title="Vision">
        <Label label="Title"><Input name="visionTitle" defaultValue={content.vision.title} required /></Label>
        <Label label="Body"><Textarea name="visionBody" defaultValue={content.vision.body} className="min-h-24" required /></Label>
        {visionBullets.map((b, i) => (
          <Input key={i} name="visionBullet" defaultValue={b} placeholder={`Bullet ${i + 1}`} />
        ))}
      </Section>

      <Section title="Values intro">
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="valuesTitle" defaultValue={content.valuesIntro.title} required /></Label>
          <Label label="Muted title"><Input name="valuesTitleMuted" defaultValue={content.valuesIntro.titleMuted} required /></Label>
        </div>
        <Label label="Description"><Textarea name="valuesDescription" defaultValue={content.valuesIntro.description} className="min-h-24" required /></Label>
      </Section>

      <Section title="Values">
        <p className="text-xs text-subtle">Blank cards are skipped. At least one complete value is required.</p>
        <div className="space-y-4">
          {values.map((v, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-[1fr_8rem]">
              <Input name="valueTitle" defaultValue={v.title} placeholder="Title" />
              <Input name="valueKeyword" defaultValue={v.keyword} placeholder="Keyword" />
              <Textarea name="valueText" defaultValue={v.text} className="min-h-20 sm:col-span-2" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Divisions">
        <p className="text-xs text-subtle">Blank cards are skipped.</p>
        <div className="space-y-4">
          {divisions.map((d, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3">
              <Input name="divisionTitle" defaultValue={d.title} placeholder="Title" />
              <Textarea name="divisionText" defaultValue={d.text} className="min-h-20" />
              <Input name="divisionHref" defaultValue={d.href} placeholder="/shop" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Journey">
        <p className="text-xs text-subtle">Blank milestones are skipped.</p>
        <div className="space-y-4">
          {journey.map((j, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-[6rem_1fr_auto]">
              <Input name="journeyYear" defaultValue={j.year} placeholder="Year" />
              <Input name="journeyTitle" defaultValue={j.title} placeholder="Title" />
              <label className="flex items-center gap-2 text-xs text-muted">
                Future
                <select
                  name="journeyFuture"
                  defaultValue={j.future ? "yes" : "no"}
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-fg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <Textarea name="journeyText" defaultValue={j.text} className="min-h-20 sm:col-span-3" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Company information">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="companyVisible"
            defaultChecked={content.company.visible}
            className="accent-[var(--color-accent)]"
          />
          Show company section on the About page
        </label>
        <p className="text-xs text-subtle">
          Do not publish registration numbers, trade licence, TIN or BIN here — keep those for private profiles only.
          Blank fact rows are skipped; clear all facts to hide the overview card.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Eyebrow"><Input name="companyEyebrow" defaultValue={content.company.eyebrow} /></Label>
          <Label label="Sheet badge"><Input name="companySheetBadge" defaultValue={content.company.sheetBadge} placeholder="Public" /></Label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="companyTitle" defaultValue={content.company.title} /></Label>
          <Label label="Muted title"><Input name="companyTitleMuted" defaultValue={content.company.titleMuted} /></Label>
        </div>
        <Label label="Description">
          <Textarea name="companyDescription" defaultValue={content.company.description} className="min-h-24" />
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="CTA label"><Input name="companyCtaLabel" defaultValue={content.company.ctaLabel} /></Label>
          <Label label="CTA link"><Input name="companyCtaHref" defaultValue={content.company.ctaHref} /></Label>
        </div>
        <Label label="Overview card title"><Input name="companySheetTitle" defaultValue={content.company.sheetTitle} /></Label>
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Commitments</p>
          {commitments.map((c, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-2">
              <Input name="companyCommitmentTitle" defaultValue={c.title} placeholder="Title" />
              <Input name="companyCommitmentText" defaultValue={c.text} placeholder="Short text" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Public overview rows</p>
          {facts.map((f, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-2">
              <Input name="companyFactLabel" defaultValue={f.label} placeholder="Label" />
              <Input name="companyFactValue" defaultValue={f.value} placeholder="Value" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Careers & partner">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <Label label="Careers title"><Input name="careersTitle" defaultValue={content.careers.title} required /></Label>
            <Label label="Careers text"><Textarea name="careersText" defaultValue={content.careers.text} className="min-h-20" required /></Label>
            <Label label="Careers CTA"><Input name="careersCta" defaultValue={content.careers.cta} required /></Label>
          </div>
          <div className="space-y-3">
            <Label label="Partner title"><Input name="partnerTitle" defaultValue={content.partner.title} required /></Label>
            <Label label="Partner text"><Textarea name="partnerText" defaultValue={content.partner.text} className="min-h-20" required /></Label>
            <Label label="Partner CTA"><Input name="partnerCta" defaultValue={content.partner.cta} required /></Label>
          </div>
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish About
      </Button>
    </form>
  );
}

export function HowItWorksSectionEditor({ content }: { content: HowItWorksContent }) {
  const [state, action, pending] = useActionState(saveHowItWorksSection, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <Section title="Heading">
        <div className="grid gap-3 sm:grid-cols-3">
          <Label label="Eyebrow"><Input name="eyebrow" defaultValue={content.eyebrow} required /></Label>
          <Label label="Title"><Input name="title" defaultValue={content.title} required /></Label>
          <Label label="Muted title"><Input name="titleMuted" defaultValue={content.titleMuted} required /></Label>
        </div>
      </Section>
      <Section title="Steps">
        <div className="space-y-3">
          {content.steps.map((s, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3">
              <Input name="stepTitle" defaultValue={s.title} placeholder="Step title" required />
              <Textarea name="stepText" defaultValue={s.text} className="min-h-20" required />
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

const emptyHeroSlide = {
  key: "",
  brand: "",
  title: "",
  titleAccent: "",
  text: "",
  primaryLabel: "",
  primaryHref: "/shop",
  secondaryLabel: "",
  secondaryHref: "/about",
  visual: "phone" as const,
  image: "",
};

export function HomeHeroSectionEditor({ content }: { content: HomeHeroContent }) {
  const [state, action, pending] = useActionState(saveHomeHeroSection, initialFormState);
  const baseSlides = Array.isArray(content?.slides) && content.slides.length > 0 ? content.slides : [];
  const slides = [...baseSlides, ...Array.from({ length: Math.max(0, 4 - baseSlides.length) }, () => emptyHeroSlide)].slice(
    0,
    4,
  );
  const stats =
    Array.isArray(content?.stats) && content.stats.length > 0
      ? content.stats
      : [
          { value: "", label: "" },
          { value: "", label: "" },
          { value: "", label: "" },
        ];
  const quickLinks =
    Array.isArray(content?.quickLinks) && content.quickLinks.length > 0
      ? content.quickLinks
      : [
          { label: "", href: "" },
          { label: "", href: "" },
          { label: "", href: "" },
        ];

  return (
    <form action={action} className="space-y-5">
      <Section title="Social proof & quick links">
        <Label label="Rating line" hint="Shown under the CTAs next to the stars.">
          <Input name="ratingLabel" defaultValue={content.ratingLabel} required />
        </Label>
        <div className="space-y-3">
          {quickLinks.map((link, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Label label={`Link ${i + 1} label`}>
                <Input name="linkLabel" defaultValue={link.label} />
              </Label>
              <Label label={`Link ${i + 1} href`}>
                <Input name="linkHref" defaultValue={link.href} placeholder="/shop/iphone" />
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bottom stats bar">
        <p className="text-xs text-subtle">Hardness / fit / warranty strip under the hero.</p>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Label label={`Stat ${i + 1} value`}>
                <Input name="statValue" defaultValue={stat.value} placeholder="9H+" />
              </Label>
              <Label label={`Stat ${i + 1} label`}>
                <Input name="statLabel" defaultValue={stat.label} placeholder="Hardness" />
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Hero slides">
        <p className="text-xs text-subtle">
          Each slide has its own left-side copy and right-side stage. Leave a slot blank to skip it. Visual:
          built-in phone / glass / privacy, or a custom image URL.
        </p>
        <div className="space-y-4">
          {slides.map((slide, i) => (
            <div key={`${slide.key}-${i}`} className="space-y-3 rounded-xl border border-white/[0.06] p-3 sm:p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                Slide {String(i + 1).padStart(2, "0")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Key (unique id)">
                  <Input name="slideKey" defaultValue={slide.key} placeholder="clarity" />
                </Label>
                <Label label="Brand / eyebrow">
                  <Input name="slideBrand" defaultValue={slide.brand} placeholder="Clarity glass" />
                </Label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Title line">
                  <Input name="slideTitle" defaultValue={slide.title} placeholder="Less glare." />
                </Label>
                <Label label="Accent line">
                  <Input name="slideTitleAccent" defaultValue={slide.titleAccent} placeholder="More clarity." />
                </Label>
              </div>
              <Label label="Supporting text">
                <Textarea name="slideText" defaultValue={slide.text} className="min-h-20" />
              </Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Primary CTA label">
                  <Input name="slidePrimaryLabel" defaultValue={slide.primaryLabel} placeholder="Shop glass" />
                </Label>
                <Label label="Primary CTA link">
                  <Input name="slidePrimaryHref" defaultValue={slide.primaryHref} placeholder="/shop" />
                </Label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Secondary CTA label">
                  <Input name="slideSecondaryLabel" defaultValue={slide.secondaryLabel} placeholder="iPhone lineup" />
                </Label>
                <Label label="Secondary CTA link">
                  <Input name="slideSecondaryHref" defaultValue={slide.secondaryHref} placeholder="/shop/iphone" />
                </Label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Stage visual">
                  <Select name="slideVisual" defaultValue={slide.visual}>
                    <option value="phone">Phone (default)</option>
                    <option value="glass">Clarity glass lift</option>
                    <option value="privacy">Privacy glass</option>
                    <option value="image">Custom image</option>
                  </Select>
                </Label>
                <Label label="Custom image URL" hint="Required only when visual is Custom image.">
                  <Input name="slideImage" defaultValue={slide.image} placeholder="/products/glass-clear.jpg" />
                </Label>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish hero
      </Button>
    </form>
  );
}

export function NewsletterSectionEditor({ content }: { content: NewsletterContent }) {
  const [state, action, pending] = useActionState(saveNewsletterSection, initialFormState);
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Section title="Newsletter block">
        <Label label="Eyebrow"><Input name="eyebrow" defaultValue={content.eyebrow} required /></Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="title" defaultValue={content.title} required /></Label>
          <Label label="Accent word"><Input name="titleAccent" defaultValue={content.titleAccent} required /></Label>
        </div>
        <Label label="Description"><Textarea name="description" defaultValue={content.description} className="min-h-24" required /></Label>
      </Section>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

export function CollectionsSectionEditor({ content }: { content: CollectionsContent }) {
  const [state, action, pending] = useActionState(saveCollectionsSection, initialFormState);
  const items =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : [
          { slug: "", name: "", description: "", image: "" },
          { slug: "", name: "", description: "", image: "" },
          { slug: "", name: "", description: "", image: "" },
          { slug: "", name: "", description: "", image: "" },
          { slug: "", name: "", description: "", image: "" },
        ];

  return (
    <form action={action} className="space-y-5">
      <Section title="Heading">
        <Label label="Eyebrow"><Input name="eyebrow" defaultValue={content?.eyebrow ?? ""} required /></Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="title" defaultValue={content?.title ?? ""} required /></Label>
          <Label label="Muted title"><Input name="titleMuted" defaultValue={content?.titleMuted ?? ""} required /></Label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="CTA label"><Input name="ctaLabel" defaultValue={content?.ctaLabel ?? "All products"} required /></Label>
          <Label label="CTA link"><Input name="ctaHref" defaultValue={content?.ctaHref ?? "/shop"} required /></Label>
        </div>
      </Section>
      <Section title="Collection cards">
        <p className="text-xs text-subtle">First card is the large featured tile. Slug must match a shop category (e.g. tempered-glass).</p>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                {String(i + 1).padStart(2, "0")} {i === 0 ? "· Featured" : ""}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Name"><Input name="itemName" defaultValue={item.name} required /></Label>
                <Label label="Slug"><Input name="itemSlug" defaultValue={item.slug} required /></Label>
              </div>
              <Label label="Description">
                <Textarea name="itemDescription" defaultValue={item.description} className="min-h-16" />
              </Label>
              <Label label="Image URL" hint="Public path, e.g. /products/glass-clear.jpg">
                <Input name="itemImage" defaultValue={item.image} required />
              </Label>
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}
