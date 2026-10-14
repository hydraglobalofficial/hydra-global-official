"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  saveAboutSection,
  saveCollectionsSection,
  saveHomeHeroSection,
  saveHowItWorksSection,
  saveInstallationSection,
  saveNewsletterSection,
  saveShowcaseSection,
  saveWhatsappWidgetSection,
} from "@/server/actions/admin";
import type {
  AboutContent,
  CollectionsContent,
  HeroVisualKey,
  HomeHeroContent,
  HowItWorksContent,
  NewsletterContent,
  ShowcaseContent,
  WhatsappWidgetContent,
} from "@/content/site-sections";
import type { InstallationContent } from "@/content/installation";
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
};

type HeroSlideDraft = typeof emptyHeroSlide & { uid: string };

export function HomeHeroSectionEditor({ content }: { content: HomeHeroContent }) {
  const [state, action, pending] = useActionState(saveHomeHeroSection, initialFormState);
  const [slides, setSlides] = useState<HeroSlideDraft[]>(() =>
    (Array.isArray(content?.slides) && content.slides.length > 0 ? content.slides : [{ ...emptyHeroSlide }]).map(
      (s) => ({ ...s, uid: rowKey() }),
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
          hint="Hardness / fit / warranty strip under the hero (1–4)."
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
          hint="Each slide has left copy + right stage. Blank slides skipped. Visual: phone / glass / privacy / custom image."
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
                <Label label="Custom image" hint="Upload from device (Cloudflare R2) or paste a URL. Required when visual is Custom image.">
                  <ImageUrlField
                    name="slideImage"
                    defaultValue={slide.image}
                    folder="hero"
                    placeholder="/products/glass-clear.jpg"
                  />
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
            Add or remove cards anytime (1–{MAX_SHOWCASE_VIDEOS}). YouTube link only — no MP4. Poster required. Empty
            YouTube → card opens the fallback link.
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

  return (
    <form action={action} className="space-y-5">
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
                  defaultValue={item.value}
                  placeholder={`Item ${i + 1}`}
                  className="flex-1"
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
            Add or remove steps anytime. Each step can have a still image. The walkthrough video is set once above. Empty rows are skipped on publish.
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
                  onClick={() => setSteps((prev) => prev.filter((s) => s.key !== step.key))}
                />
              </div>
              <Input
                name="stepTitle"
                defaultValue={step.title}
                placeholder="Step title"
                onChange={(e) => {
                  const v = e.target.value;
                  setSteps((prev) => prev.map((s) => (s.key === step.key ? { ...s, title: v } : s)));
                }}
              />
              <Textarea
                name="stepBody"
                defaultValue={step.body}
                className="min-h-20"
                placeholder="What to do"
                onChange={(e) => {
                  const v = e.target.value;
                  setSteps((prev) => prev.map((s) => (s.key === step.key ? { ...s, body: v } : s)));
                }}
              />
              <Input
                name="stepTip"
                defaultValue={step.tip}
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
                defaultValue={t.problem}
                placeholder="Problem"
                onChange={(e) => {
                  const v = e.target.value;
                  setTroubles((prev) => prev.map((x) => (x.key === t.key ? { ...x, problem: v } : x)));
                }}
              />
              <Textarea
                name="troubleFix"
                defaultValue={t.fix}
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
