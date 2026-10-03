"use client";

import { useActionState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  saveAboutSection,
  saveCollectionsSection,
  saveHowItWorksSection,
  saveNewsletterSection,
} from "@/server/actions/admin";
import type {
  AboutContent,
  CollectionsContent,
  HowItWorksContent,
  NewsletterContent,
} from "@/content/site-sections";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FormMessage, Input, Textarea } from "@/components/ui/form";
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

export function AboutSectionEditor({ content }: { content: AboutContent }) {
  const [state, action, pending] = useActionState(saveAboutSection, initialFormState);

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
        <div className="space-y-3">
          {content.stats.map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Input name="statValue" defaultValue={s.value} placeholder="Value" required />
              <Input name="statLabel" defaultValue={s.label} placeholder="Label" required />
            </div>
          ))}
        </div>
        <p className="text-xs text-subtle">Keep five rows for the best layout.</p>
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
        {content.mission.bullets.map((b, i) => (
          <Input key={i} name="missionBullet" defaultValue={b} placeholder={`Bullet ${i + 1}`} />
        ))}
      </Section>

      <Section title="Vision">
        <Label label="Title"><Input name="visionTitle" defaultValue={content.vision.title} required /></Label>
        <Label label="Body"><Textarea name="visionBody" defaultValue={content.vision.body} className="min-h-24" required /></Label>
        {content.vision.bullets.map((b, i) => (
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
        <div className="space-y-4">
          {content.values.map((v, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-[1fr_8rem]">
              <Input name="valueTitle" defaultValue={v.title} placeholder="Title" required />
              <Input name="valueKeyword" defaultValue={v.keyword} placeholder="Keyword" required />
              <Textarea name="valueText" defaultValue={v.text} className="min-h-20 sm:col-span-2" required />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Divisions">
        <div className="space-y-4">
          {content.divisions.map((d, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3">
              <Input name="divisionTitle" defaultValue={d.title} placeholder="Title" required />
              <Textarea name="divisionText" defaultValue={d.text} className="min-h-20" required />
              <Input name="divisionHref" defaultValue={d.href} placeholder="/shop" required />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Journey">
        <div className="space-y-4">
          {content.journey.map((j, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-[6rem_1fr_auto]">
              <Input name="journeyYear" defaultValue={j.year} placeholder="Year" required />
              <Input name="journeyTitle" defaultValue={j.title} placeholder="Title" required />
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
              <Textarea name="journeyText" defaultValue={j.text} className="min-h-20 sm:col-span-3" required />
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
  return (
    <form action={action} className="space-y-5">
      <Section title="Heading">
        <Label label="Eyebrow"><Input name="eyebrow" defaultValue={content.eyebrow} required /></Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="title" defaultValue={content.title} required /></Label>
          <Label label="Muted title"><Input name="titleMuted" defaultValue={content.titleMuted} required /></Label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="CTA label"><Input name="ctaLabel" defaultValue={content.ctaLabel} required /></Label>
          <Label label="CTA link"><Input name="ctaHref" defaultValue={content.ctaHref} required /></Label>
        </div>
      </Section>
      <Section title="Collection cards">
        <p className="text-xs text-subtle">First card is the large featured tile. Slug must match a shop category (e.g. tempered-glass).</p>
        <div className="space-y-4">
          {content.items.map((item, i) => (
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
