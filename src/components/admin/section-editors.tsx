"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  saveAboutSection,
  saveCollectionsSection,
  saveClaritySection,
  saveImpactSection,
  saveImpactLabSection,
  saveCurrencySection,
  saveHomeHeroSection,
  saveHowItWorksSection,
  saveTechSection,
  saveInstallationSection,
  saveNewsletterSection,
  saveShippingSection,
  saveSocialSection,
  saveTrackingSection,
  saveShowcaseSection,
  saveWhatsappWidgetSection,
} from "@/server/actions/admin";
import type {
  AboutContent,
  ClarityContent,
  ImpactContent,
  ImpactLabContent,
  CollectionsContent,
  HeroVisualKey,
  HomeHeroContent,
  HowItWorksContent,
  TechContent,
  NewsletterContent,
  ShippingContent,
  SocialContent,
  TrackingContent,
  ShowcaseContent,
  WhatsappWidgetContent,
} from "@/content/site-sections";
import type { InstallationContent } from "@/content/installation";
import { formatMoney, MONEY_PRESETS, type CurrencyContent, type MoneyPresetId } from "@/lib/money";
import { initialFormState } from "@/lib/validations";
import { ImageUrlField } from "@/components/admin/media-uploader";
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

function rowKey() {
  return `r-${Math.random().toString(36).slice(2, 10)}`;
}

type Keyed<T> = T & { key: string };

function toKeyed<T extends object>(rows: T[]): Keyed<T>[] {
  return rows.map((row) => ({ ...row, key: rowKey() }));
}

function ListHeader({
  hint,
  addLabel,
  onAdd,
  canAdd,
}: {
  hint: string;
  addLabel: string;
  onAdd: () => void;
  canAdd: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <p className="text-xs text-subtle">{hint}</p>
      <Button type="button" variant="secondary" size="sm" disabled={!canAdd} onClick={onAdd}>
        <Plus size={14} /> {addLabel}
      </Button>
    </div>
  );
}

function RemoveBtn({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        const { confirmDelete } = await import("@/lib/swal");
        const result = await confirmDelete({
          title: label,
          text: "This slot will be removed from the editor. Publish to save the change.",
          confirmText: "Yes, remove",
        });
        if (result.isConfirmed) onClick();
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted transition hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30"
      aria-label={label}
    >
      <Trash2 size={12} /> Remove
    </button>
  );
}

function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-white/10 px-3 py-5 text-center text-xs text-subtle">
      {children}
    </p>
  );
}

export function AboutSectionEditor({ content }: { content: AboutContent }) {
  const [state, action, pending] = useActionState(saveAboutSection, initialFormState);
  const [stats, setStats] = useState(() =>
    toKeyed(content.stats.length > 0 ? content.stats : [{ value: "", label: "" }]),
  );
  const [missionBullets, setMissionBullets] = useState(() =>
    toKeyed(
      (content.mission.bullets.length > 0 ? content.mission.bullets : [""]).map((value) => ({ value })),
    ),
  );
  const [visionBullets, setVisionBullets] = useState(() =>
    toKeyed((content.vision.bullets.length > 0 ? content.vision.bullets : [""]).map((value) => ({ value }))),
  );
  const [values, setValues] = useState(() =>
    toKeyed(content.values.length > 0 ? content.values : [{ title: "", keyword: "", text: "" }]),
  );
  const [divisions, setDivisions] = useState(() =>
    toKeyed(content.divisions.length > 0 ? content.divisions : [{ title: "", text: "", href: "" }]),
  );
  const [journey, setJourney] = useState(() =>
    toKeyed(content.journey.length > 0 ? content.journey : [{ year: "", title: "", text: "", future: false }]),
  );
  const [commitments, setCommitments] = useState(() =>
    toKeyed(content.company.commitments.length > 0 ? content.company.commitments : [{ title: "", text: "" }]),
  );
  const [facts, setFacts] = useState(() =>
    toKeyed(content.company.facts.length > 0 ? content.company.facts : [{ label: "", value: "" }]),
  );

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
        <ListHeader
          hint="Add or remove rows (blank rows skipped on publish)."
          addLabel="Add stat"
          canAdd={stats.length < 8}
          onAdd={() => setStats((prev) => (prev.length >= 8 ? prev : [...prev, { key: rowKey(), value: "", label: "" }]))}
        />
        {stats.length === 0 ? (
          <EmptyHint>No stats — click Add stat.</EmptyHint>
        ) : (
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={s.key} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] p-3 sm:flex-row sm:items-start">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Input name="statValue" defaultValue={s.value} placeholder="Value" />
                  <Input name="statLabel" defaultValue={s.label} placeholder="Label" />
                </div>
                <RemoveBtn
                  label={`Remove stat ${i + 1}`}
                  onClick={() => setStats((prev) => prev.filter((row) => row.key !== s.key))}
                />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="About page paragraph">
        <p className="text-xs text-subtle">
          This is the long text on the About page — the one that mentions Protection, Precision and Progression.
        </p>
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
        <ListHeader
          hint="Bullet points under mission."
          addLabel="Add bullet"
          canAdd={missionBullets.length < 8}
          onAdd={() =>
            setMissionBullets((prev) => (prev.length >= 8 ? prev : [...prev, { key: rowKey(), value: "" }]))
          }
        />
        {missionBullets.length === 0 ? (
          <EmptyHint>No bullets — click Add bullet.</EmptyHint>
        ) : (
          <div className="space-y-2">
            {missionBullets.map((b, i) => (
              <div key={b.key} className="flex gap-2">
                <Input name="missionBullet" defaultValue={b.value} placeholder={`Bullet ${i + 1}`} className="flex-1" />
                <RemoveBtn
                  label={`Remove mission bullet ${i + 1}`}
                  onClick={() =>
                    setMissionBullets((prev) => prev.filter((row) => row.key !== b.key))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Vision">
        <Label label="Title"><Input name="visionTitle" defaultValue={content.vision.title} required /></Label>
        <Label label="Body"><Textarea name="visionBody" defaultValue={content.vision.body} className="min-h-24" required /></Label>
        <ListHeader
          hint="Bullet points under vision."
          addLabel="Add bullet"
          canAdd={visionBullets.length < 8}
          onAdd={() =>
            setVisionBullets((prev) => (prev.length >= 8 ? prev : [...prev, { key: rowKey(), value: "" }]))
          }
        />
        {visionBullets.length === 0 ? (
          <EmptyHint>No bullets — click Add bullet.</EmptyHint>
        ) : (
          <div className="space-y-2">
            {visionBullets.map((b, i) => (
              <div key={b.key} className="flex gap-2">
                <Input name="visionBullet" defaultValue={b.value} placeholder={`Bullet ${i + 1}`} className="flex-1" />
                <RemoveBtn
                  label={`Remove vision bullet ${i + 1}`}
                  onClick={() =>
                    setVisionBullets((prev) => prev.filter((row) => row.key !== b.key))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Values intro">
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="valuesTitle" defaultValue={content.valuesIntro.title} required /></Label>
          <Label label="Muted title"><Input name="valuesTitleMuted" defaultValue={content.valuesIntro.titleMuted} required /></Label>
        </div>
        <Label label="Description"><Textarea name="valuesDescription" defaultValue={content.valuesIntro.description} className="min-h-24" required /></Label>
      </Section>

      <Section title="Values">
        <ListHeader
          hint="Blank cards are skipped. At least one complete value is required."
          addLabel="Add value"
          canAdd={values.length < 12}
          onAdd={() =>
            setValues((prev) =>
              prev.length >= 12 ? prev : [...prev, { key: rowKey(), title: "", keyword: "", text: "" }],
            )
          }
        />
        <div className="space-y-4">
          {values.map((v, i) => (
            <div key={v.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <div className="flex justify-end">
                <RemoveBtn
                  label={`Remove value ${i + 1}`}
                  onClick={() => setValues((prev) => prev.filter((row) => row.key !== v.key))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                <Input name="valueTitle" defaultValue={v.title} placeholder="Title" />
                <Input name="valueKeyword" defaultValue={v.keyword} placeholder="Keyword" />
                <Textarea name="valueText" defaultValue={v.text} className="min-h-20 sm:col-span-2" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Divisions">
        <ListHeader
          hint="Blank cards are skipped."
          addLabel="Add division"
          canAdd={divisions.length < 6}
          onAdd={() =>
            setDivisions((prev) =>
              prev.length >= 6 ? prev : [...prev, { key: rowKey(), title: "", text: "", href: "" }],
            )
          }
        />
        <div className="space-y-4">
          {divisions.map((d, i) => (
            <div key={d.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <div className="flex justify-end">
                <RemoveBtn
                  label={`Remove division ${i + 1}`}
                  onClick={() =>
                    setDivisions((prev) => prev.filter((row) => row.key !== d.key))
                  }
                />
              </div>
              <Input name="divisionTitle" defaultValue={d.title} placeholder="Title" />
              <Textarea name="divisionText" defaultValue={d.text} className="min-h-20" />
              <Input name="divisionHref" defaultValue={d.href} placeholder="/shop" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Journey">
        <ListHeader
          hint="Blank milestones are skipped."
          addLabel="Add milestone"
          canAdd={journey.length < 12}
          onAdd={() =>
            setJourney((prev) =>
              prev.length >= 12
                ? prev
                : [...prev, { key: rowKey(), year: "", title: "", text: "", future: false }],
            )
          }
        />
        <div className="space-y-4">
          {journey.map((j, i) => (
            <div key={j.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <div className="flex justify-end">
                <RemoveBtn
                  label={`Remove milestone ${i + 1}`}
                  onClick={() =>
                    setJourney((prev) => prev.filter((row) => row.key !== j.key))
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[6rem_1fr_auto]">
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
          <ListHeader
            hint="Commitments under company info."
            addLabel="Add commitment"
            canAdd={commitments.length < 8}
            onAdd={() =>
              setCommitments((prev) =>
                prev.length >= 8 ? prev : [...prev, { key: rowKey(), title: "", text: "" }],
              )
            }
          />
          {commitments.map((c, i) => (
            <div key={c.key} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] p-3 sm:flex-row sm:items-start">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <Input name="companyCommitmentTitle" defaultValue={c.title} placeholder="Title" />
                <Input name="companyCommitmentText" defaultValue={c.text} placeholder="Short text" />
              </div>
              <RemoveBtn
                label={`Remove commitment ${i + 1}`}
                onClick={() =>
                  setCommitments((prev) => prev.filter((row) => row.key !== c.key))
                }
              />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <ListHeader
            hint="Public overview rows (optional)."
            addLabel="Add fact"
            canAdd={facts.length < 16}
            onAdd={() =>
              setFacts((prev) => (prev.length >= 16 ? prev : [...prev, { key: rowKey(), label: "", value: "" }]))
            }
          />
          {facts.map((f, i) => (
            <div key={f.key} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] p-3 sm:flex-row sm:items-start">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <Input name="companyFactLabel" defaultValue={f.label} placeholder="Label" />
                <Input name="companyFactValue" defaultValue={f.value} placeholder="Value" />
              </div>
              <RemoveBtn
                label={`Remove fact ${i + 1}`}
                onClick={() => setFacts((prev) => prev.filter((row) => row.key !== f.key))}
              />
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

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish About
      </Button>
    </form>
  );
}

export function HowItWorksSectionEditor({ content }: { content: HowItWorksContent }) {
  const [state, action, pending] = useActionState(saveHowItWorksSection, initialFormState);
  const [steps, setSteps] = useState(() =>
    toKeyed(content.steps.length > 0 ? content.steps : [{ title: "", text: "" }]),
  );

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
        <ListHeader
          hint="Add or remove steps (1–8). Empty rows are skipped on publish."
          addLabel="Add step"
          canAdd={steps.length < 8}
          onAdd={() =>
            setSteps((prev) => (prev.length >= 8 ? prev : [...prev, { key: rowKey(), title: "", text: "" }]))
          }
        />
        {steps.length === 0 ? <EmptyHint>No steps — click Add step.</EmptyHint> : null}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <RemoveBtn
                  label={`Remove step ${i + 1}`}
                  onClick={() => setSteps((prev) => prev.filter((row) => row.key !== s.key))}
                />
              </div>
              <Input name="stepTitle" defaultValue={s.title} placeholder="Step title" />
              <Textarea name="stepText" defaultValue={s.text} className="min-h-20" />
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

export function TechSectionEditor({ content }: { content: TechContent }) {
  const [state, action, pending] = useActionState(saveTechSection, initialFormState);
  const cards = content.cards.slice(0, 6);

  return (
    <form action={action} className="space-y-5">
      <Section title="Heading">
        <p className="text-sm text-muted">
          These are the six cards under “Protection, re-engineered.” Each card can have its own background photo. Leave
          the photo empty to keep the plain card.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Label label="Small label">
            <Input name="eyebrow" defaultValue={content.eyebrow} required />
          </Label>
          <Label label="Title">
            <Input name="title" defaultValue={content.title} required />
          </Label>
          <Label label="Muted title">
            <Input name="titleMuted" defaultValue={content.titleMuted} required />
          </Label>
        </div>
        <Label label="Paragraph">
          <Textarea name="description" defaultValue={content.description} className="min-h-20" required />
        </Label>
      </Section>
      <Section title="Six cards">
        <div className="space-y-4">
          {cards.map((card, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-line p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Block {i + 1}</p>
              <Label label="Background photo" hint="A photo is already set. Upload another to replace it.">
                <ImageUrlField name="techImage" defaultValue={card.image} folder="content" placeholder="Upload a background" />
              </Label>
              <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                <Label label="Title">
                  <Input name="techTitle" defaultValue={card.title} maxLength={80} required />
                </Label>
                <Label label="Small stat">
                  <Input name="techStat" defaultValue={card.stat} maxLength={24} placeholder="5 layers" />
                </Label>
              </div>
              <Label label="Text">
                <Textarea name="techText" defaultValue={card.text} className="min-h-20" maxLength={280} required />
              </Label>
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish six cards
      </Button>
    </form>
  );
}

const emptyHeroSlide: {
  key: string;
  brand: string;
  title: string;
  titleAccent: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  visual: HeroVisualKey;
  image: string;
  imageMobile: string;
} = {
  key: "",
  brand: "",
  title: "",
  titleAccent: "",
  text: "",
  primaryLabel: "",
  primaryHref: "/shop",
  secondaryLabel: "",
  secondaryHref: "/about",
  visual: "phone",
  image: "",
  imageMobile: "",
};

type HeroSlideDraft = typeof emptyHeroSlide & { uid: string };

export function HomeHeroSectionEditor({ content }: { content: HomeHeroContent }) {
  const [state, action, pending] = useActionState(saveHomeHeroSection, initialFormState);
  const [slides, setSlides] = useState<HeroSlideDraft[]>(() =>
    (Array.isArray(content?.slides) && content.slides.length > 0 ? content.slides : [{ ...emptyHeroSlide }]).map(
      (s) => ({ ...emptyHeroSlide, ...s, uid: rowKey() }),
    ),
  );
  const [stats, setStats] = useState(() =>
    toKeyed(
      Array.isArray(content?.stats) && content.stats.length > 0
        ? content.stats
        : [{ value: "", label: "" }],
    ),
  );
  const [quickLinks, setQuickLinks] = useState(() =>
    toKeyed(
      Array.isArray(content?.quickLinks) && content.quickLinks.length > 0
        ? content.quickLinks
        : [{ label: "", href: "" }],
    ),
  );

  return (
    <form action={action} className="space-y-5">
      <Section title="Social proof & quick links">
        <Label label="Rating line" hint="Shown under the CTAs next to the stars.">
          <Input name="ratingLabel" defaultValue={content.ratingLabel} required />
        </Label>
        <ListHeader
          hint="Quick links under the hero CTAs (1–6)."
          addLabel="Add link"
          canAdd={quickLinks.length < 6}
          onAdd={() =>
            setQuickLinks((prev) =>
              prev.length >= 6 ? prev : [...prev, { key: rowKey(), label: "", href: "" }],
            )
          }
        />
        <div className="space-y-3">
          {quickLinks.map((link, i) => (
            <div key={link.key} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] p-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <Label label={`Link ${i + 1} label`}>
                  <Input name="linkLabel" defaultValue={link.label} />
                </Label>
                <Label label={`Link ${i + 1} href`}>
                  <Input name="linkHref" defaultValue={link.href} placeholder="/shop/iphone" />
                </Label>
              </div>
              <RemoveBtn
                label={`Remove link ${i + 1}`}
                onClick={() =>
                  setQuickLinks((prev) => prev.filter((row) => row.key !== link.key))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bottom stats bar">
        <ListHeader
          hint="Slim trust line directly under an image banner, or along the bottom of the split hero (1–4). A label of only “-” is hidden."
          addLabel="Add stat"
          canAdd={stats.length < 4}
          onAdd={() =>
            setStats((prev) => (prev.length >= 4 ? prev : [...prev, { key: rowKey(), value: "", label: "" }]))
          }
        />
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={stat.key} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] p-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <Label label={`Stat ${i + 1} value`}>
                  <Input name="statValue" defaultValue={stat.value} placeholder="9H+" />
                </Label>
                <Label label={`Stat ${i + 1} label`}>
                  <Input name="statLabel" defaultValue={stat.label} placeholder="Hardness" />
                </Label>
              </div>
              <RemoveBtn
                label={`Remove stat ${i + 1}`}
                onClick={() => setStats((prev) => prev.filter((row) => row.key !== stat.key))}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Hero slides">
        <ListHeader
          hint="Empty optional fields stay empty on the site. Clearing description hides it — the slide is not deleted. Upload a PC image and a separate mobile image so neither is cropped."
          addLabel="Add slide"
          canAdd={slides.length < 6}
          onAdd={() =>
            setSlides((prev) =>
              prev.length >= 6 ? prev : [...prev, { ...emptyHeroSlide, uid: rowKey() }],
            )
          }
        />
        <div className="space-y-4">
          {slides.map((slide, i) => (
            <div key={slide.uid} className="space-y-3 rounded-xl border border-white/[0.06] p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                  Slide {String(i + 1).padStart(2, "0")}
                </p>
                <RemoveBtn
                  label={`Remove slide ${i + 1}`}
                  onClick={() =>
                    setSlides((prev) => prev.filter((row) => row.uid !== slide.uid))
                  }
                />
              </div>
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
              <Label label="Supporting text" hint="Optional. Leave blank to hide this line on the storefront.">
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
              <Label label="Stage visual">
                <Select name="slideVisual" defaultValue={slide.visual}>
                  <option value="phone">Phone (default)</option>
                  <option value="glass">Clarity glass lift</option>
                  <option value="privacy">Privacy glass</option>
                  <option value="image">Custom image</option>
                </Select>
              </Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="PC image" hint="16:9 · 1920×1080">
                  <ImageUrlField name="slideImage" defaultValue={slide.image} folder="hero" />
                </Label>
                <Label label="Mobile image" hint="16:9 · 1920×1080 · optional">
                  <ImageUrlField name="slideImageMobile" defaultValue={slide.imageMobile} folder="hero" />
                </Label>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
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
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

const MAX_WHATSAPP_STAFF = 6;

export function WhatsappWidgetSectionEditor({ content }: { content: WhatsappWidgetContent }) {
  const [state, action, pending] = useActionState(saveWhatsappWidgetSection, initialFormState);
  const [staff, setStaff] = useState(() =>
    toKeyed(
      content.staff.length > 0
        ? content.staff
        : [{ name: "", image: "" }],
    ),
  );

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Section title="Chat button">
        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={content.enabled}
            className="accent-[var(--color-accent)]"
          />
          Show on storefront
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="WhatsApp number" hint="Digits with country code — no + or spaces.">
            <Input name="phone" defaultValue={content.phone} required className="font-mono" placeholder="8801635992804" />
          </Label>
          <Label label="Rotate every (seconds)" hint="Each staff photo shows for this long (2–8).">
            <Input
              name="rotateSeconds"
              type="number"
              min={2}
              max={8}
              defaultValue={content.rotateSeconds}
              required
            />
          </Label>
        </div>
        <Label label="Greeting message" hint="Prefills the WhatsApp chat when someone taps the button.">
          <Input name="message" defaultValue={content.message} maxLength={200} />
        </Label>
      </Section>

      <Section title="Staff photos">
        <ListHeader
          hint={`Upload 1–${MAX_WHATSAPP_STAFF} real staff photos. Storefront shows only these images + names (rotates). No photo = button hidden.`}
          addLabel="Add photo"
          canAdd={staff.length < MAX_WHATSAPP_STAFF}
          onAdd={() =>
            setStaff((prev) =>
              prev.length >= MAX_WHATSAPP_STAFF ? prev : [...prev, { key: rowKey(), name: "", image: "" }],
            )
          }
        />
        {staff.length === 0 ? (
          <EmptyHint>No staff photos — click Add photo to create a slot.</EmptyHint>
        ) : (
          <div className="space-y-3">
            {staff.map((person, i) => (
              <div key={person.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Photo {i + 1}</p>
                  <RemoveBtn
                    label={`Remove staff photo ${i + 1}`}
                    onClick={() => setStaff((prev) => prev.filter((row) => row.key !== person.key))}
                  />
                </div>
                <Label label="Name" hint="Shown on the float under the photo.">
                  <Input name="staffName" defaultValue={person.name} placeholder="Ayesha Rahman" />
                </Label>
                <Label
                  label="Staff photo"
                  hint="Upload a real face from your device (R2). Product images are blocked — square crop looks best."
                >
                  <ImageUrlField name="staffImage" defaultValue={person.image} folder="whatsapp" />
                </Label>
              </div>
            ))}
          </div>
        )}
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

const MAX_SHOWCASE_VIDEOS = 6;

function emptyShowcaseVideo() {
  return {
    key: `v-${Math.random().toString(36).slice(2, 9)}`,
    title: "",
    caption: "",
    duration: "",
    poster: "",
    videoUrl: "",
    href: "/shop",
  };
}

export function ShowcaseSectionEditor({ content }: { content: ShowcaseContent }) {
  const [state, action, pending] = useActionState(saveShowcaseSection, initialFormState);
  const [videos, setVideos] = useState(() => {
    const rows =
      content.videos.length > 0
        ? content.videos.map((v) => ({ ...v, key: `v-${Math.random().toString(36).slice(2, 9)}` }))
        : [emptyShowcaseVideo(), emptyShowcaseVideo(), emptyShowcaseVideo()];
    return rows;
  });

  return (
    <form action={action} className="space-y-5">
      <Section title="Heading">
        <Label label="Eyebrow">
          <Input name="eyebrow" defaultValue={content.eyebrow} required />
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title">
            <Input name="title" defaultValue={content.title} required />
          </Label>
          <Label label="Muted title">
            <Input name="titleMuted" defaultValue={content.titleMuted} required />
          </Label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Channel button label">
            <Input name="channelLabel" defaultValue={content.channelLabel} required />
          </Label>
          <Label label="Channel URL">
            <Input name="channelHref" defaultValue={content.channelHref} required />
          </Label>
        </div>
      </Section>

      <Section title="Video cards">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-xs text-subtle">
            Each card needs a poster image and a YouTube link. Upload the poster, then paste the YouTube URL. These cards
            show on the homepage.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={videos.length >= MAX_SHOWCASE_VIDEOS}
            onClick={() =>
              setVideos((prev) => (prev.length >= MAX_SHOWCASE_VIDEOS ? prev : [...prev, emptyShowcaseVideo()]))
            }
          >
            <Plus size={14} /> Add card
          </Button>
        </div>
        {videos.length === 0 ? <EmptyHint>No video cards — click Add card.</EmptyHint> : null}
        <div className="space-y-6">
          {videos.map((v, i) => (
            <div key={v.key} className="space-y-3 rounded-2xl border border-line p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Card {i + 1}</p>
                <RemoveBtn
                  label={`Remove card ${i + 1}`}
                  onClick={() => setVideos((prev) => prev.filter((row) => row.key !== v.key))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Title">
                  <Input name="videoTitle" defaultValue={v.title} placeholder="Video title" />
                </Label>
                <Label label="Duration label">
                  <Input name="videoDuration" defaultValue={v.duration} placeholder="Guide · 2 min" />
                </Label>
              </div>
              <Label label="Caption">
                <Input name="videoCaption" defaultValue={v.caption} placeholder="Short caption" />
              </Label>
              <Label label="Poster image" hint="Shown before play">
                <ImageUrlField name="videoPoster" defaultValue={v.poster} folder="content" />
              </Label>
              <Label label="YouTube link" hint="https://www.youtube.com/watch?v=… or youtu.be/…">
                <Input
                  name="videoUrl"
                  defaultValue={v.videoUrl}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className="font-mono text-xs"
                />
              </Label>
              <Label label="Fallback link" hint="Used when no YouTube link is set">
                <Input name="videoHref" defaultValue={v.href} placeholder="/installation" />
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

export function CollectionsSectionEditor({ content }: { content: CollectionsContent }) {
  const [state, action, pending] = useActionState(saveCollectionsSection, initialFormState);
  const [items, setItems] = useState(() =>
    toKeyed(
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : [{ slug: "", name: "", description: "", image: "" }],
    ),
  );

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
        <ListHeader
          hint="First card is the large featured tile. Slug must match a shop category (e.g. tempered-glass). Max 8."
          addLabel="Add card"
          canAdd={items.length < 8}
          onAdd={() =>
            setItems((prev) =>
              prev.length >= 8
                ? prev
                : [...prev, { key: rowKey(), slug: "", name: "", description: "", image: "" }],
            )
          }
        />
        {items.length === 0 ? <EmptyHint>No collection cards — click Add card.</EmptyHint> : null}
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={item.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                  {String(i + 1).padStart(2, "0")} {i === 0 ? "· Featured" : ""}
                </p>
                <RemoveBtn
                  label={`Remove collection ${i + 1}`}
                  onClick={() =>
                    setItems((prev) => prev.filter((row) => row.key !== item.key))
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Name"><Input name="itemName" defaultValue={item.name} /></Label>
                <Label label="Slug"><Input name="itemSlug" defaultValue={item.slug} /></Label>
              </div>
              <Label label="Description">
                <Textarea name="itemDescription" defaultValue={item.description} className="min-h-16" />
              </Label>
              <Label label="Image" hint="Upload from device (Cloudflare R2) or paste a public URL / path.">
                <ImageUrlField
                  name="itemImage"
                  defaultValue={item.image}
                  folder="collections"
                  placeholder="/products/glass-clear.jpg"
                />
              </Label>
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish
      </Button>
    </form>
  );
}

type InstallStepDraft = {
  key: string;
  title: string;
  body: string;
  tip: string;
  image: string;
};

type TroubleDraft = { key: string; problem: string; fix: string };

const emptyStep = (): InstallStepDraft => ({
  key: crypto.randomUUID(),
  title: "",
  body: "",
  tip: "",
  image: "",
});

const emptyTrouble = (): TroubleDraft => ({
  key: crypto.randomUUID(),
  problem: "",
  fix: "",
});

const MAX_INSTALL_STEPS = 16;
const MAX_TROUBLES = 12;

const MAX_KIT_ITEMS = 20;

export function InstallationSectionEditor({ content }: { content: InstallationContent }) {
  const [state, action, pending] = useActionState(saveInstallationSection, initialFormState);
  const [kit, setKit] = useState(() =>
    toKeyed((content.kit.length > 0 ? content.kit : [""]).map((value) => ({ value }))),
  );
  const [steps, setSteps] = useState<InstallStepDraft[]>(() =>
    content.steps.length > 0
      ? content.steps.map((s) => ({
          key: crypto.randomUUID(),
          title: s.title,
          body: s.body,
          tip: s.tip ?? "",
          image: s.image ?? "",
        }))
      : [emptyStep(), emptyStep()],
  );
  const [troubles, setTroubles] = useState<TroubleDraft[]>(() =>
    content.troubleshooting.length > 0
      ? content.troubleshooting.map((t) => ({
          key: crypto.randomUUID(),
          problem: t.problem,
          fix: t.fix,
        }))
      : [emptyTrouble()],
  );

  const installState = JSON.stringify({
    steps: steps.map(({ title, body, tip, image }) => ({ title, body, tip, image })),
    kit: kit.map((item) => item.value),
    troubleshooting: troubles.map(({ problem, fix }) => ({ problem, fix })),
  });

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="installState" value={installState} />
      <Section title="Hero">
        <p className="text-xs text-subtle">
          One shared guide for Apple & Samsung — no separate brand pages needed.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Eyebrow"><Input name="eyebrow" defaultValue={content.eyebrow} required /></Label>
          <Label label="Duration"><Input name="duration" defaultValue={content.duration} required /></Label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title"><Input name="title" defaultValue={content.title} required /></Label>
          <Label label="Title accent"><Input name="titleAccent" defaultValue={content.titleAccent} required /></Label>
        </div>
        <Label label="Intro"><Textarea name="intro" defaultValue={content.intro} className="min-h-24" required /></Label>
        <Label label="Brands note" hint={'Shown as a badge, e.g. "Same process for Apple & Samsung"'}>
          <Input name="brandsNote" defaultValue={content.brandsNote} required />
        </Label>
      </Section>

      <Section title="Walkthrough video (bottom of page)">
        <p className="text-xs text-subtle">
          One link only — shows as an in-page player under the steps. Paste a YouTube or Google Drive share link (Drive file must be set to “Anyone with the link”). R2 mp4/webm also works.
        </p>
        <Label label="Video link" hint="YouTube watch/share, Google Drive file link, or https://….r2.dev/….mp4">
          <Input
            name="videoUrl"
            defaultValue={content.videoUrl}
            placeholder="https://www.youtube.com/watch?v=… or https://drive.google.com/file/d/…/view"
            className="font-mono text-xs"
          />
        </Label>
      </Section>

      <Section title="Kit (in the box)">
        <ListHeader
          hint="Add or remove box items anytime. Empty rows are skipped on publish."
          addLabel="Add item"
          canAdd={kit.length < MAX_KIT_ITEMS}
          onAdd={() =>
            setKit((prev) =>
              prev.length >= MAX_KIT_ITEMS ? prev : [...prev, { key: rowKey(), value: "" }],
            )
          }
        />
        {kit.length === 0 ? (
          <EmptyHint>No kit items — click Add item.</EmptyHint>
        ) : (
          <div className="space-y-2">
            {kit.map((item, i) => (
              <div key={item.key} className="flex gap-2">
                <Input
                  name="kitItem"
                  value={item.value}
                  placeholder={`Item ${i + 1}`}
                  className="flex-1"
                  onChange={(e) => {
                    const v = e.target.value;
                    setKit((prev) => prev.map((row) => (row.key === item.key ? { ...row, value: v } : row)));
                  }}
                />
                <RemoveBtn
                  label={`Remove kit item ${i + 1}`}
                  onClick={() => setKit((prev) => prev.filter((row) => row.key !== item.key))}
                />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Steps">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-xs text-subtle">
            Only the field you change is published. Everything else stays as it is.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={steps.length >= MAX_INSTALL_STEPS}
            onClick={() => setSteps((prev) => (prev.length >= MAX_INSTALL_STEPS ? prev : [...prev, emptyStep()]))}
          >
            <Plus size={14} /> Add step
          </Button>
        </div>
        {steps.length === 0 ? <EmptyHint>No steps — click Add step.</EmptyHint> : null}
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.key} className="space-y-3 rounded-xl border border-white/[0.06] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <RemoveBtn
                  label={`Remove step ${i + 1}`}
                  disabled={steps.length <= 1}
                  onClick={() =>
                    setSteps((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.key !== step.key)))
                  }
                />
              </div>
              <Input
                name="stepTitle"
                value={step.title}
                placeholder="Step title"
                onChange={(e) => {
                  const v = e.target.value;
                  setSteps((prev) => prev.map((s) => (s.key === step.key ? { ...s, title: v } : s)));
                }}
              />
              <Textarea
                name="stepBody"
                value={step.body}
                className="min-h-20"
                placeholder="What to do"
                onChange={(e) => {
                  const v = e.target.value;
                  setSteps((prev) => prev.map((s) => (s.key === step.key ? { ...s, body: v } : s)));
                }}
              />
              <Input
                name="stepTip"
                value={step.tip}
                placeholder="Optional tip"
                onChange={(e) => {
                  const v = e.target.value;
                  setSteps((prev) => prev.map((s) => (s.key === step.key ? { ...s, tip: v } : s)));
                }}
              />
              <Label label="Step image" hint="Optional — R2 upload or paste URL">
                <ImageUrlField
                  name="stepImage"
                  defaultValue={step.image}
                  folder="content"
                  placeholder="/products/glass-clear.jpg"
                  onValueChange={(url) =>
                    setSteps((prev) => prev.map((s) => (s.key === step.key ? { ...s, image: url } : s)))
                  }
                />
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Troubleshooting">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-xs text-subtle">Add common issues — or remove ones you don&apos;t need.</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={troubles.length >= MAX_TROUBLES}
            onClick={() =>
              setTroubles((prev) => (prev.length >= MAX_TROUBLES ? prev : [...prev, emptyTrouble()]))
            }
          >
            <Plus size={14} /> Add issue
          </Button>
        </div>
        {troubles.length === 0 ? <EmptyHint>No issues — click Add issue.</EmptyHint> : null}
        <div className="space-y-3">
          {troubles.map((t, i) => (
            <div key={t.key} className="grid gap-2 rounded-xl border border-white/[0.06] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                  Issue {String(i + 1).padStart(2, "0")}
                </p>
                <RemoveBtn
                  label={`Remove issue ${i + 1}`}
                  onClick={() => setTroubles((prev) => prev.filter((x) => x.key !== t.key))}
                />
              </div>
              <Input
                name="troubleProblem"
                value={t.problem}
                placeholder="Problem"
                onChange={(e) => {
                  const v = e.target.value;
                  setTroubles((prev) => prev.map((x) => (x.key === t.key ? { ...x, problem: v } : x)));
                }}
              />
              <Textarea
                name="troubleFix"
                value={t.fix}
                className="min-h-16"
                placeholder="Fix"
                onChange={(e) => {
                  const v = e.target.value;
                  setTroubles((prev) => prev.map((x) => (x.key === t.key ? { ...x, fix: v } : x)));
                }}
              />
            </div>
          ))}
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish installation
      </Button>
    </form>
  );
}

export function CurrencySectionEditor({ content }: { content: CurrencyContent }) {
  const [state, action, pending] = useActionState(saveCurrencySection, initialFormState);
  const [preset, setPreset] = useState<MoneyPresetId>(content.preset);
  const [symbol, setSymbol] = useState(content.symbol);
  const [code, setCode] = useState(content.code);
  const [position, setPosition] = useState<"before" | "after">(content.position);
  const [locale, setLocale] = useState(content.locale);
  const [decimals, setDecimals] = useState(content.decimals);

  const live =
    preset !== "custom" && MONEY_PRESETS[preset]
      ? { preset, ...MONEY_PRESETS[preset].format }
      : { preset: "custom" as const, symbol, code, position, locale, decimals };

  const pickPreset = (id: MoneyPresetId) => {
    setPreset(id);
    if (id !== "custom" && MONEY_PRESETS[id]) {
      const f = MONEY_PRESETS[id].format;
      setSymbol(f.symbol);
      setCode(f.code);
      setPosition(f.position);
      setLocale(f.locale);
      setDecimals(f.decimals);
    }
  };

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="preset" value={live.preset} />
      <input type="hidden" name="symbol" value={live.symbol} />
      <input type="hidden" name="code" value={live.code} />
      <input type="hidden" name="position" value={live.position} />
      <input type="hidden" name="locale" value={live.locale} />
      <input type="hidden" name="decimals" value={live.decimals} />

      <Section title="Price display format">
        <p className="text-sm text-muted">
          Product amounts stay as plain numbers in the database. This only changes how they look on the store and in
          admin — pick Taka, Dollar, or a custom symbol.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(MONEY_PRESETS) as Exclude<MoneyPresetId, "custom">[]).map((id) => {
            const p = MONEY_PRESETS[id];
            const active = preset === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => pickPreset(id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active ? "border-accent bg-accent/10" : "border-line hover:border-accent/40"
                }`}
              >
                <p className="text-sm font-medium text-fg">{p.label}</p>
                <p className="mt-1 font-mono text-lg tabular-nums text-fg">{formatMoney(p.example, p.format)}</p>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => pickPreset("custom")}
            className={`rounded-2xl border px-4 py-3 text-left transition sm:col-span-2 ${
              preset === "custom" ? "border-accent bg-accent/10" : "border-line hover:border-accent/40"
            }`}
          >
            <p className="text-sm font-medium text-fg">Custom symbol</p>
            <p className="mt-1 text-xs text-muted">Set any prefix/suffix — e.g. TK, BDT, Rs</p>
          </button>
        </div>
      </Section>

      {preset === "custom" ? (
        <Section title="Custom format">
          <div className="grid gap-4 sm:grid-cols-2">
            <Label label="Symbol">
              <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="৳ or $" maxLength={12} />
            </Label>
            <Label label="Code (invoices)">
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="BDT" maxLength={8} />
            </Label>
            <Label label="Position">
              <Select
                value={position}
                onChange={(e) => setPosition(e.target.value === "after" ? "after" : "before")}
              >
                <option value="before">Before number (৳1200)</option>
                <option value="after">After number (1200 টাকা)</option>
              </Select>
            </Label>
            <Label label="Decimals">
              <Select value={String(decimals)} onChange={(e) => setDecimals(Number(e.target.value) || 0)}>
                <option value="0">0 — 1,200</option>
                <option value="2">2 — 1,200.00</option>
              </Select>
            </Label>
            <Label label="Locale (grouping)" hint="en-BD → 1,200 · de-DE → 1.200">
              <Input value={locale} onChange={(e) => setLocale(e.target.value)} placeholder="en-BD" maxLength={16} />
            </Label>
          </div>
        </Section>
      ) : null}

      <Section title="Live preview">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Product card</p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{formatMoney(2490, live)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Compare-at</p>
            <p className="mt-1 font-mono text-lg text-muted line-through tabular-nums">{formatMoney(3200, live)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Cart total</p>
            <p className="mt-1 font-mono text-xl tabular-nums">{formatMoney(4980, live)}</p>
          </div>
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish price format
      </Button>
    </form>
  );
}

export function ShippingSectionEditor({ content }: { content: ShippingContent }) {
  const [state, action, pending] = useActionState(saveShippingSection, initialFormState);
  const [mode, setMode] = useState<"free" | "paid">(content.mode);
  const [amount, setAmount] = useState(String(content.amount || ""));
  const preview = mode === "free" ? 0 : Math.max(0, Math.round(Number(amount) || 0));

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="amount" value={mode === "free" ? "0" : String(preview)} />

      <Section title="Delivery fee">
        <p className="text-sm text-muted">
          This is the shipping line on checkout, the cart, the invoice, and the confirmation email. The order total is
          subtotal plus this amount.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("free")}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              mode === "free" ? "border-accent bg-accent/10" : "border-line hover:border-accent/40"
            }`}
          >
            <p className="text-sm font-medium text-fg">Free</p>
            <p className="mt-1 font-mono text-lg tabular-nums">৳0</p>
            <p className="mt-1 text-xs text-muted">No delivery charge on any order.</p>
          </button>
          <button
            type="button"
            onClick={() => setMode("paid")}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              mode === "paid" ? "border-accent bg-accent/10" : "border-line hover:border-accent/40"
            }`}
          >
            <p className="text-sm font-medium text-fg">Paid</p>
            <p className="mt-1 text-xs text-muted">Charge one flat amount on every order.</p>
          </button>
        </div>
        {mode === "paid" ? (
          <Label label="Shipping amount" hint="Whole taka. Example: 80">
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="80"
              required
            />
          </Label>
        ) : null}
        <div className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Customer sees</p>
          <p className="mt-1 font-mono text-xl tabular-nums">Shipping {formatMoney(preview)}</p>
          <p className="mt-1 text-xs text-muted">Added to the product subtotal before they place the order.</p>
        </div>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish shipping
      </Button>
    </form>
  );
}

export function SocialSectionEditor({ content }: { content: SocialContent }) {
  const [state, action, pending] = useActionState(saveSocialSection, initialFormState);

  return (
    <form action={action} className="space-y-5">
      <Section title="Profiles">
        <p className="text-sm text-muted">
          These open from the footer and the contact page. Paste a full https link for each network.
        </p>
        <Label label="Facebook" hint="facebook.com">
          <Input name="facebook" type="url" defaultValue={content.facebook} required />
        </Label>
        <Label label="Instagram" hint="instagram.com">
          <Input name="instagram" type="url" defaultValue={content.instagram} required />
        </Label>
        <Label label="YouTube" hint="youtube.com or youtu.be">
          <Input name="youtube" type="url" defaultValue={content.youtube} required />
        </Label>
        <Label label="X" hint="x.com">
          <Input name="x" type="url" defaultValue={content.x} required />
        </Label>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish social links
      </Button>
    </form>
  );
}

const MAX_IMPACT_PHOTOS = 10;

export function ImpactSectionEditor({ content }: { content: ImpactContent }) {
  const [state, action, pending] = useActionState(saveImpactSection, initialFormState);
  const [images, setImages] = useState(() =>
    toKeyed(
      content.images.length > 0
        ? content.images
        : [{ url: "", alt: "" }],
    ),
  );

  return (
    <form action={action} className="space-y-5">
      <Section title="Photos around 20,000+">
        <ListHeader
          hint="These photos sit around the big 20,000+ number on the homepage. They land in different spots, not a straight row. Up to 10."
          addLabel="Add photo"
          canAdd={images.length < MAX_IMPACT_PHOTOS}
          onAdd={() =>
            setImages((prev) =>
              prev.length >= MAX_IMPACT_PHOTOS ? prev : [...prev, { key: rowKey(), url: "", alt: "" }],
            )
          }
        />
        {images.length === 0 ? <EmptyHint>No photos yet — click Add photo.</EmptyHint> : null}
        <div className="space-y-4">
          {images.map((photo, i) => (
            <div key={photo.key} className="space-y-3 rounded-2xl border border-line p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Photo {i + 1}</p>
                <RemoveBtn
                  label={`Remove photo ${i + 1}`}
                  onClick={() => setImages((prev) => prev.filter((row) => row.key !== photo.key))}
                />
              </div>
              <Label label="Image" hint="Upload from your device, or paste an image link.">
                <ImageUrlField name="impactImage" defaultValue={photo.url} folder="impact" placeholder="Upload a photo" />
              </Label>
              <Label label="Short description" hint="Optional. Used if the photo cannot be seen.">
                <Input name="impactAlt" defaultValue={photo.alt} maxLength={80} placeholder="Customer holding HYDRA glass" />
              </Label>
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish photos
      </Button>
    </form>
  );
}

export function ImpactLabSectionEditor({ content }: { content: ImpactLabContent }) {
  const [state, action, pending] = useActionState(saveImpactLabSection, initialFormState);
  const cards = content.cards.length > 0 ? content.cards : [{ value: "", label: "", image: "" }];

  return (
    <form action={action} className="space-y-5">
      <Section title="Heading">
        <p className="text-sm text-muted">
          These four blocks sit under the Impact lab heading. On a phone they show two per row. Each card draws its own
          diagram for the stat — drop, hardness, strength, or touch.
        </p>
        <Label label="Small label">
          <Input name="eyebrow" defaultValue={content.eyebrow} required />
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label label="Title">
            <Input name="title" defaultValue={content.title} required />
          </Label>
          <Label label="Muted title">
            <Input name="titleMuted" defaultValue={content.titleMuted} required />
          </Label>
        </div>
        <Label label="Paragraph">
          <Textarea name="text" defaultValue={content.text} className="min-h-20" required />
        </Label>
      </Section>
      <Section title="Four blocks">
        <div className="space-y-4">
          {cards.slice(0, 4).map((card, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-line p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Block {i + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Label label="Big text">
                  <Input name="labValue" defaultValue={card.value} placeholder="2 m" maxLength={16} />
                </Label>
                <Label label="Line under it">
                  <Input name="labLabel" defaultValue={card.label} placeholder="Drop-tested onto granite" maxLength={80} />
                </Label>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish four blocks
      </Button>
    </form>
  );
}

export function ClaritySectionEditor({ content }: { content: ClarityContent }) {
  const [state, action, pending] = useActionState(saveClaritySection, initialFormState);

  return (
    <form action={action} className="space-y-5">
      <Section title="Two slider images">
        <p className="text-sm text-muted">
          These are the two photos on the homepage block “Clarity you can feel.” Drag the slider to compare them. Upload
          from your device, or paste an image link. Publish to update the live page.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-line p-4">
            <p className="text-sm font-medium">1 · Left image</p>
            <p className="text-xs text-muted">Shown on the left of the slider. Usually the ordinary, scratched glass.</p>
            <ImageUrlField
              name="beforeImage"
              defaultValue={content.beforeImage}
              folder="clarity"
              placeholder="Upload the left image"
            />
            <Label label="Left label">
              <Input name="beforeLabel" defaultValue={content.beforeLabel} maxLength={40} />
            </Label>
          </div>
          <div className="space-y-3 rounded-2xl border border-line p-4">
            <p className="text-sm font-medium">2 · Right image</p>
            <p className="text-xs text-muted">Shown on the right of the slider. Usually the clear HYDRA glass.</p>
            <ImageUrlField
              name="afterImage"
              defaultValue={content.afterImage}
              folder="clarity"
              placeholder="Upload the right image"
            />
            <Label label="Right label">
              <Input name="afterLabel" defaultValue={content.afterLabel} maxLength={40} />
            </Label>
          </div>
        </div>
      </Section>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Publish both images
      </Button>
    </form>
  );
}

function TrackingStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className={`mt-1 font-mono text-sm ${value ? "text-emerald-600" : "text-muted"}`}>
        {value || "Not connected"}
      </p>
    </div>
  );
}

export function TrackingSectionEditor({ content }: { content: TrackingContent }) {
  const [state, action, pending] = useActionState(saveTrackingSection, initialFormState);

  return (
    <form action={action} className="space-y-5">
      <Section title="Connected to the store">
        <p className="text-sm text-muted">
          Paste the ID or the full code Google / Facebook gives you. Publish — it loads on every store page.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <TrackingStatus label="GTM" value={content.gtmId} />
          <TrackingStatus label="Google Analytics" value={content.ga4Id} />
          <TrackingStatus label="Meta Pixel" value={content.metaPixelId} />
        </div>
      </Section>

      <Section title="Google Tag Manager">
        <Label
          label="GTM code"
          hint="Paste GTM-XXXXXXX, or the whole GTM script. We pull the ID and attach it to the site."
        >
          <Textarea
            name="gtmId"
            defaultValue={content.gtmId}
            placeholder={"GTM-XXXXXXX\nor paste the full Google Tag Manager snippet"}
            className="min-h-32 font-mono text-xs"
            autoComplete="off"
          />
        </Label>
      </Section>

      <Section title="Google Analytics">
        <Label
          label="GA4 code"
          hint="Paste G-XXXXXXXX, or the full gtag snippet. Skip this if GA4 already lives inside GTM."
        >
          <Textarea
            name="ga4Id"
            defaultValue={content.ga4Id}
            placeholder={"G-XXXXXXXX\nor paste the full Google Analytics snippet"}
            className="min-h-32 font-mono text-xs"
            autoComplete="off"
          />
        </Label>
      </Section>

      <Section title="Meta Pixel">
        <Label
          label="Pixel code"
          hint="Paste the numeric Pixel ID, or the full Facebook Pixel script from Events Manager."
        >
          <Textarea
            name="metaPixelId"
            defaultValue={content.metaPixelId}
            placeholder={"1234567890\nor paste the full Meta Pixel snippet"}
            className="min-h-32 font-mono text-xs"
            autoComplete="off"
          />
        </Label>
      </Section>

      <Section title="Optional">
        <Label label="TikTok Pixel" hint="ID or full TikTok snippet.">
          <Textarea
            name="tiktokPixelId"
            defaultValue={content.tiktokPixelId}
            placeholder="CXXXXXXXXXXXXXXX"
            className="min-h-24 font-mono text-xs"
            autoComplete="off"
          />
        </Label>
        <Label label="Google Search Console" hint="Verification code or the full meta tag.">
          <Textarea
            name="googleVerification"
            defaultValue={content.googleVerification}
            placeholder='google-site-verification=… or <meta name="google-site-verification" content="…">'
            className="min-h-24 font-mono text-xs"
            autoComplete="off"
          />
        </Label>
        <Label label="Bing Webmaster" hint="Optional.">
          <Input name="bingVerification" defaultValue={content.bingVerification} placeholder="msvalidate.01 code" autoComplete="off" />
        </Label>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="requireConsent" defaultChecked={content.requireConsent} className="mt-1" />
          <span>Ask visitors before loading these scripts. Leave off so they connect immediately.</span>
        </label>
      </Section>

      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Connect to site
      </Button>
    </form>
  );
}
