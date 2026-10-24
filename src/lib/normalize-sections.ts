import {
  defaultAboutContent,
  defaultCollectionsContent,
  defaultHomeHeroContent,
  defaultHowItWorksContent,
  defaultNewsletterContent,
  defaultClarityContent,
  defaultShowcaseContent,
  defaultWhatsappWidgetContent,
  type AboutContent,
  type CollectionsContent,
  type HeroSlide,
  type HeroVisualKey,
  type HomeHeroContent,
  type HowItWorksContent,
  type NewsletterContent,
  type ClarityContent,
  type ShippingContent,
  type ShowcaseContent,
  type ShowcaseVideoItem,
  type WhatsappWidgetContent,
} from "@/content/site-sections";
import {
  asStringArray,
  clampText,
  safeInternalHref,
  safeMediaUrl,
  safeSlug,
  safeVideoUrl,
  safeYoutubeUrl,
} from "@/lib/content-safety";
import { defaultInstallationContent, type InstallationContent } from "@/content/installation";
import {
  defaultCurrencyContent,
  MONEY_PRESETS,
  type CurrencyContent,
  type MoneyPresetId,
} from "@/lib/money";

const HERO_VISUALS = new Set<HeroVisualKey>(["phone", "glass", "privacy", "image"]);

function normalizeHeroVisual(raw: unknown): HeroVisualKey {
  return typeof raw === "string" && HERO_VISUALS.has(raw as HeroVisualKey) ? (raw as HeroVisualKey) : "phone";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function normalizeAboutContent(raw: unknown): AboutContent {
  const data = isRecord(raw) ? raw : {};
  const hero = isRecord(data.hero) ? data.hero : {};
  const manifesto = isRecord(data.manifesto) ? data.manifesto : {};
  const mission = isRecord(data.mission) ? data.mission : {};
  const vision = isRecord(data.vision) ? data.vision : {};
  const valuesIntro = isRecord(data.valuesIntro) ? data.valuesIntro : {};
  const careers = isRecord(data.careers) ? data.careers : {};
  const partner = isRecord(data.partner) ? data.partner : {};
  const company = isRecord(data.company) ? data.company : {};

  const stats = Array.isArray(data.stats)
    ? data.stats
        .map((row) => {
          if (!isRecord(row)) return null;
          const value = clampText(row.value, 24);
          const label = clampText(row.label, 80);
          return value && label ? { value, label } : null;
        })
        .filter((row): row is { value: string; label: string } => !!row)
        .slice(0, 8)
    : [];

  const values = Array.isArray(data.values)
    ? data.values
        .map((row) => {
          if (!isRecord(row)) return null;
          const title = clampText(row.title, 80);
          const keyword = clampText(row.keyword, 40);
          const text = clampText(row.text, 600);
          return title && keyword && text ? { title, keyword, text } : null;
        })
        .filter((row): row is AboutContent["values"][number] => !!row)
        .slice(0, 12)
    : [];

  const divisions = Array.isArray(data.divisions)
    ? data.divisions
        .map((row) => {
          if (!isRecord(row)) return null;
          const title = clampText(row.title, 80);
          const text = clampText(row.text, 400);
          const href = safeInternalHref(row.href, "");
          return title && text && href ? { title, text, href } : null;
        })
        .filter((row): row is AboutContent["divisions"][number] => !!row)
        .slice(0, 6)
    : [];

  const journey: AboutContent["journey"] = Array.isArray(data.journey)
    ? data.journey
        .flatMap((row) => {
          if (!isRecord(row)) return [];
          const year = clampText(row.year, 24);
          const title = clampText(row.title, 120);
          const text = clampText(row.text, 600);
          if (!year || !title || !text) return [];
          const item: AboutContent["journey"][number] = { year, title, text };
          if (row.future === true) item.future = true;
          return [item];
        })
        .slice(0, 12)
    : [];

  return {
    hero: {
      eyebrow: clampText(hero.eyebrow, 60, defaultAboutContent.hero.eyebrow),
      title: clampText(hero.title, 120, defaultAboutContent.hero.title),
      titleAccent: clampText(hero.titleAccent, 80, defaultAboutContent.hero.titleAccent),
      description: clampText(hero.description, 800, defaultAboutContent.hero.description),
    },
    stats: stats.length > 0 ? stats : defaultAboutContent.stats,
    manifesto: {
      text: clampText(manifesto.text, 1200, defaultAboutContent.manifesto.text),
      highlight: asStringArray(manifesto.highlight, 24, 40),
    },
    mission: {
      title: clampText(mission.title, 80, defaultAboutContent.mission.title),
      body: clampText(mission.body, 800, defaultAboutContent.mission.body),
      bullets: (() => {
        const bullets = asStringArray(mission.bullets, 8, 200);
        return bullets.length > 0 ? bullets : defaultAboutContent.mission.bullets;
      })(),
    },
    vision: {
      title: clampText(vision.title, 80, defaultAboutContent.vision.title),
      body: clampText(vision.body, 800, defaultAboutContent.vision.body),
      bullets: (() => {
        const bullets = asStringArray(vision.bullets, 8, 200);
        return bullets.length > 0 ? bullets : defaultAboutContent.vision.bullets;
      })(),
    },
    valuesIntro: {
      title: clampText(valuesIntro.title, 80, defaultAboutContent.valuesIntro.title),
      titleMuted: clampText(valuesIntro.titleMuted, 80, defaultAboutContent.valuesIntro.titleMuted),
      description: clampText(valuesIntro.description, 400, defaultAboutContent.valuesIntro.description),
    },
    values: values.length > 0 ? values : defaultAboutContent.values,
    divisions: divisions.length > 0 ? divisions : defaultAboutContent.divisions,
    journey: journey.length > 0 ? journey : defaultAboutContent.journey,
    company: (() => {
      const defaults = defaultAboutContent.company;
      const commitments = Array.isArray(company.commitments)
        ? company.commitments
            .map((row) => {
              if (!isRecord(row)) return null;
              const title = clampText(row.title, 80);
              const text = clampText(row.text, 240);
              return title && text ? { title, text } : null;
            })
            .filter((row): row is AboutContent["company"]["commitments"][number] => !!row)
            .slice(0, 8)
        : [];
      const facts = Array.isArray(company.facts)
        ? company.facts
            .map((row) => {
              if (!isRecord(row)) return null;
              const label = clampText(row.label, 80);
              const value = clampText(row.value, 200);
              return label && value ? { label, value } : null;
            })
            .filter((row): row is AboutContent["company"]["facts"][number] => !!row)
            .slice(0, 16)
        : defaults.facts;
      return {
        visible: company.visible !== false,
        eyebrow: clampText(company.eyebrow, 60, defaults.eyebrow),
        title: clampText(company.title, 120, defaults.title),
        titleMuted: clampText(company.titleMuted, 80, defaults.titleMuted),
        description: clampText(company.description, 600, defaults.description),
        ctaLabel: clampText(company.ctaLabel, 60, defaults.ctaLabel),
        ctaHref: safeInternalHref(company.ctaHref, defaults.ctaHref),
        sheetTitle: clampText(company.sheetTitle, 80, defaults.sheetTitle),
        sheetBadge: clampText(company.sheetBadge, 40, defaults.sheetBadge),
        commitments: commitments.length > 0 ? commitments : defaults.commitments,
        facts,
      };
    })(),
    careers: {
      title: clampText(careers.title, 120, defaultAboutContent.careers.title),
      text: clampText(careers.text, 400, defaultAboutContent.careers.text),
      cta: clampText(careers.cta, 60, defaultAboutContent.careers.cta),
    },
    partner: {
      title: clampText(partner.title, 120, defaultAboutContent.partner.title),
      text: clampText(partner.text, 400, defaultAboutContent.partner.text),
      cta: clampText(partner.cta, 60, defaultAboutContent.partner.cta),
    },
  };
}

export function normalizeHowItWorksContent(raw: unknown): HowItWorksContent {
  const data = isRecord(raw) ? raw : {};
  const steps = Array.isArray(data.steps)
    ? data.steps
        .map((row) => {
          if (!isRecord(row)) return null;
          const title = clampText(row.title, 80);
          const text = clampText(row.text, 400);
          return title && text ? { title, text } : null;
        })
        .filter((row): row is HowItWorksContent["steps"][number] => !!row)
        .slice(0, 8)
    : [];

  return {
    eyebrow: clampText(data.eyebrow, 60, defaultHowItWorksContent.eyebrow),
    title: clampText(data.title, 120, defaultHowItWorksContent.title),
    titleMuted: clampText(data.titleMuted, 80, defaultHowItWorksContent.titleMuted),
    steps: steps.length > 0 ? steps : defaultHowItWorksContent.steps,
  };
}

export function normalizeNewsletterContent(raw: unknown): NewsletterContent {
  const data = isRecord(raw) ? raw : {};
  return {
    eyebrow: clampText(data.eyebrow, 60, defaultNewsletterContent.eyebrow),
    title: clampText(data.title, 80, defaultNewsletterContent.title),
    titleAccent: clampText(data.titleAccent, 40, defaultNewsletterContent.titleAccent),
    description: clampText(data.description, 400, defaultNewsletterContent.description),
  };
}

function digitsOnly(value: unknown, fallback: string) {
  const raw = typeof value === "string" ? value : String(value ?? "");
  const digits = raw.replace(/\D+/g, "");
  return digits.length >= 8 ? digits.slice(0, 18) : fallback;
}

export function normalizeWhatsappWidgetContent(raw: unknown): WhatsappWidgetContent {
  const data = isRecord(raw) ? raw : {};
  const rotateRaw = Number(data.rotateSeconds);
  const rotateSeconds = Number.isFinite(rotateRaw)
    ? Math.min(8, Math.max(2, Math.round(rotateRaw)))
    : defaultWhatsappWidgetContent.rotateSeconds;

  const staff = Array.isArray(data.staff)
    ? data.staff
        .map((row) => {
          if (!isRecord(row)) return null;
          const image = safeMediaUrl(row.image, "");
          // Product catalog images must never appear on the WhatsApp staff float.
          if (!image || image.startsWith("/products/")) return null;
          return {
            name: clampText(row.name, 60, ""),
            image,
          };
        })
        .filter((row): row is WhatsappWidgetContent["staff"][number] => !!row)
        .slice(0, 6)
    : [];

  return {
    enabled: data.enabled !== false && data.enabled !== "false" && data.enabled !== 0,
    phone: digitsOnly(data.phone, defaultWhatsappWidgetContent.phone),
    message: clampText(data.message, 200, defaultWhatsappWidgetContent.message),
    rotateSeconds,
    staff,
  };
}

export function normalizeInstallationContent(raw: unknown): InstallationContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultInstallationContent;

  const steps = Array.isArray(data.steps)
    ? data.steps
        .map((row, index) => {
          if (!isRecord(row)) return null;
          const title = clampText(row.title, 100);
          const body = clampText(row.body, 600);
          if (!title || !body) return null;
          const tip = clampText(row.tip, 240, "");
          const fallback = defaults.steps[index];
          const image = safeMediaUrl(row.image, "") || fallback?.image || "";
          return {
            title,
            body,
            ...(tip ? { tip } : {}),
            ...(image ? { image } : {}),
          };
        })
        .filter((row): row is InstallationContent["steps"][number] => !!row)
        .slice(0, 10)
    : [];

  const troubleshooting = Array.isArray(data.troubleshooting)
    ? data.troubleshooting
        .map((row) => {
          if (!isRecord(row)) return null;
          const problem = clampText(row.problem, 120);
          const fix = clampText(row.fix, 400);
          return problem && fix ? { problem, fix } : null;
        })
        .filter((row): row is InstallationContent["troubleshooting"][number] => !!row)
        .slice(0, 10)
    : [];

  const kit = asStringArray(data.kit, 12, 80);

  return {
    eyebrow: clampText(data.eyebrow, 60, defaults.eyebrow),
    title: clampText(data.title, 80, defaults.title),
    titleAccent: clampText(data.titleAccent, 80, defaults.titleAccent),
    intro: clampText(data.intro, 500, defaults.intro),
    duration: clampText(data.duration, 40, defaults.duration),
    videoUrl: safeVideoUrl(data.videoUrl, "") || defaults.videoUrl,
    brandsNote: clampText(data.brandsNote, 80, defaults.brandsNote),
    kit: kit.length > 0 ? kit : defaults.kit,
    steps: steps.length > 0 ? steps : defaults.steps,
    troubleshooting: troubleshooting.length > 0 ? troubleshooting : defaults.troubleshooting,
  };
}

export function normalizeCollectionsContent(raw: unknown): CollectionsContent {
  const data = isRecord(raw) ? raw : {};
  const items = Array.isArray(data.items)
    ? data.items
        .map((row) => {
          if (!isRecord(row)) return null;
          const slug = safeSlug(row.slug);
          const name = clampText(row.name, 80);
          const description = clampText(row.description, 240, "");
          const image = safeMediaUrl(row.image);
          return slug && name && image ? { slug, name, description, image } : null;
        })
        .filter((row): row is CollectionsContent["items"][number] => !!row)
        .slice(0, 8)
    : [];

  return {
    eyebrow: clampText(data.eyebrow, 60, defaultCollectionsContent.eyebrow),
    title: clampText(data.title, 120, defaultCollectionsContent.title),
    titleMuted: clampText(data.titleMuted, 80, defaultCollectionsContent.titleMuted),
    ctaLabel: clampText(data.ctaLabel, 40, defaultCollectionsContent.ctaLabel),
    ctaHref: safeInternalHref(data.ctaHref, defaultCollectionsContent.ctaHref),
    items: items.length > 0 ? items : defaultCollectionsContent.items,
  };
}

function normalizeHeroSlide(row: unknown, fallback?: HeroSlide): HeroSlide | null {
  if (!isRecord(row)) return null;
  const key = safeSlug(row.key) || clampText(row.key, 40).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const brand = clampText(row.brand, 40);
  const title = clampText(row.title, 80);
  const titleAccent = clampText(row.titleAccent, 80);
  const text = clampText(row.text, 280);
  const primaryLabel = clampText(row.primaryLabel, 40);
  const primaryHref = safeInternalHref(row.primaryHref, "/shop");
  const secondaryLabel = clampText(row.secondaryLabel, 40);
  const secondaryHref = safeInternalHref(row.secondaryHref, "/shop");
  const visual = normalizeHeroVisual(row.visual);
  const image = safeMediaUrl(row.image, "");

  if (!key || !brand || !title || !titleAccent || !text || !primaryLabel || !secondaryLabel) {
    return fallback ?? null;
  }
  if (visual === "image" && !image) return fallback ?? null;

  return {
    key,
    brand,
    title,
    titleAccent,
    text,
    primaryLabel,
    primaryHref,
    secondaryLabel,
    secondaryHref,
    visual,
    image,
  };
}

export function normalizeShowcaseContent(raw: unknown): ShowcaseContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultShowcaseContent;

  const videos: ShowcaseVideoItem[] = Array.isArray(data.videos)
    ? data.videos
        .map((row, i) => {
          if (!isRecord(row)) return null;
          const fallback = defaults.videos[i];
          const title = clampText(row.title, 100, fallback?.title ?? "");
          const caption = clampText(row.caption, 200, fallback?.caption ?? "");
          const duration = clampText(row.duration, 40, fallback?.duration ?? "");
          const poster = safeMediaUrl(row.poster, fallback?.poster ?? "");
          const videoUrl = safeYoutubeUrl(row.videoUrl, "") || safeYoutubeUrl(row.youtubeId, "");
          const href = safeInternalHref(row.href, fallback?.href ?? "/shop");
          if (!title || !caption || !duration || !poster) return null;
          return { title, caption, duration, poster, videoUrl, href };
        })
        .filter((row): row is ShowcaseVideoItem => !!row)
        .slice(0, 6)
    : [];

  return {
    eyebrow: clampText(data.eyebrow, 60, defaults.eyebrow),
    title: clampText(data.title, 80, defaults.title),
    titleMuted: clampText(data.titleMuted, 80, defaults.titleMuted),
    channelLabel: clampText(data.channelLabel, 40, defaults.channelLabel),
    channelHref: clampText(data.channelHref, 240, defaults.channelHref) || defaults.channelHref,
    videos: videos.length > 0 ? videos : defaults.videos,
  };
}

export function normalizeShippingContent(raw: unknown): ShippingContent {
  const data = isRecord(raw) ? raw : {};
  const mode = data.mode === "free" ? "free" : "paid";
  const amount = Math.min(1_000_000, Math.max(0, Math.round(Number(data.amount) || 0)));
  return { mode, amount: mode === "free" ? 0 : amount };
}

export function normalizeClarityContent(raw: unknown): ClarityContent {
  const data = isRecord(raw) ? raw : {};
  return {
    beforeImage: safeMediaUrl(data.beforeImage, ""),
    afterImage: safeMediaUrl(data.afterImage, ""),
    beforeLabel: clampText(data.beforeLabel, 40, defaultClarityContent.beforeLabel) || defaultClarityContent.beforeLabel,
    afterLabel: clampText(data.afterLabel, 40, defaultClarityContent.afterLabel) || defaultClarityContent.afterLabel,
  };
}

export function normalizeCurrencyContent(raw: unknown): CurrencyContent {
  const data = isRecord(raw) ? raw : {};
  const presetRaw = typeof data.preset === "string" ? data.preset : "bdt";
  const preset = (
    ["bdt", "bdt-taka", "usd", "eur", "custom"] as const
  ).includes(presetRaw as MoneyPresetId)
    ? (presetRaw as MoneyPresetId)
    : "bdt";

  if (preset !== "custom" && MONEY_PRESETS[preset]) {
    return { preset, ...MONEY_PRESETS[preset].format };
  }

  const position = data.position === "after" ? "after" : "before";
  const decimals = Math.min(2, Math.max(0, Number(data.decimals) || 0));
  const code = clampText(data.code, 8, defaultCurrencyContent.code).toUpperCase() || "BDT";
  const symbol = clampText(data.symbol, 12, defaultCurrencyContent.symbol) || "৳";
  const locale = clampText(data.locale, 16, defaultCurrencyContent.locale) || "en-BD";

  return { preset: "custom", code, symbol, position, locale, decimals };
}

export function normalizeHomeHeroContent(raw: unknown): HomeHeroContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultHomeHeroContent;

  const stats = Array.isArray(data.stats)
    ? data.stats
        .map((row) => {
          if (!isRecord(row)) return null;
          const value = clampText(row.value, 24);
          const label = clampText(row.label, 40);
          return value && label ? { value, label } : null;
        })
        .filter((row): row is HomeHeroContent["stats"][number] => !!row)
        .slice(0, 4)
    : [];

  const quickLinks = Array.isArray(data.quickLinks)
    ? data.quickLinks
        .map((row) => {
          if (!isRecord(row)) return null;
          const label = clampText(row.label, 40);
          const href = safeInternalHref(row.href, "");
          return label && href ? { label, href } : null;
        })
        .filter((row): row is HomeHeroContent["quickLinks"][number] => !!row)
        .slice(0, 6)
    : [];

  const slides = Array.isArray(data.slides)
    ? data.slides
        .map((row, i) => normalizeHeroSlide(row, defaults.slides[i]))
        .filter((row): row is HeroSlide => !!row)
        .slice(0, 6)
    : [];

  return {
    ratingLabel: clampText(data.ratingLabel, 80, defaults.ratingLabel),
    quickLinks: quickLinks.length > 0 ? quickLinks : defaults.quickLinks,
    stats: stats.length > 0 ? stats : defaults.stats,
    slides: slides.length > 0 ? slides : defaults.slides,
  };
}
