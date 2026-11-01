import {
  defaultAboutContent,
  defaultCollectionsContent,
  defaultHomeHeroContent,
  defaultHowItWorksContent,
  defaultTechContent,
  defaultNewsletterContent,
  defaultClarityContent,
  defaultImpactContent,
  defaultImpactLabContent,
  defaultShowcaseContent,
  defaultSocialContent,
  defaultWhatsappWidgetContent,
  type AboutContent,
  type CollectionsContent,
  type HeroSlide,
  type HeroVisualKey,
  type HomeHeroContent,
  type HowItWorksContent,
  type TechContent,
  type NewsletterContent,
  type ClarityContent,
  type ImpactContent,
  type ImpactLabContent,
  type ShippingContent,
  type SocialContent,
  type TrackingContent,
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
  safeSocialUrl,
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

function hasOwn(data: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(data, key) && data[key] != null;
}

/** Saved blank stays blank. Seed copy is used only when that field was never stored. */
function textField(data: Record<string, unknown>, key: string, max: number, fallback = "") {
  if (!hasOwn(data, key)) return clampText(fallback, max);
  return clampText(data[key], max, "");
}

function hrefField(data: Record<string, unknown>, key: string, fallback = "") {
  if (!hasOwn(data, key)) return fallback;
  return safeInternalHref(data[key], "");
}

function mediaField(data: Record<string, unknown>, key: string, fallback = "") {
  if (!hasOwn(data, key)) return fallback;
  return safeMediaUrl(data[key], "");
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
          if (!value && !label) return null;
          return { value, label };
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
          if (!title && !keyword && !text) return null;
          return { title, keyword, text };
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
          if (!title && !text && !href) return null;
          return { title, text, href };
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
          if (!year && !title && !text) return [];
          const item: AboutContent["journey"][number] = { year, title, text };
          if (row.future === true) item.future = true;
          return [item];
        })
        .slice(0, 12)
    : [];

  return {
    hero: {
      eyebrow: textField(hero, "eyebrow", 60, defaultAboutContent.hero.eyebrow),
      title: textField(hero, "title", 120, defaultAboutContent.hero.title),
      titleAccent: textField(hero, "titleAccent", 80, defaultAboutContent.hero.titleAccent),
      description: textField(hero, "description", 800, defaultAboutContent.hero.description),
    },
    stats: Array.isArray(data.stats) ? stats : defaultAboutContent.stats,
    manifesto: {
      text: textField(manifesto, "text", 1200, defaultAboutContent.manifesto.text),
      highlight: Array.isArray(manifesto.highlight)
        ? asStringArray(manifesto.highlight, 24, 40)
        : defaultAboutContent.manifesto.highlight,
    },
    mission: {
      title: textField(mission, "title", 80, defaultAboutContent.mission.title),
      body: textField(mission, "body", 800, defaultAboutContent.mission.body),
      bullets: Array.isArray(mission.bullets)
        ? asStringArray(mission.bullets, 8, 200)
        : defaultAboutContent.mission.bullets,
    },
    vision: {
      title: textField(vision, "title", 80, defaultAboutContent.vision.title),
      body: textField(vision, "body", 800, defaultAboutContent.vision.body),
      bullets: Array.isArray(vision.bullets)
        ? asStringArray(vision.bullets, 8, 200)
        : defaultAboutContent.vision.bullets,
    },
    valuesIntro: {
      title: textField(valuesIntro, "title", 80, defaultAboutContent.valuesIntro.title),
      titleMuted: textField(valuesIntro, "titleMuted", 80, defaultAboutContent.valuesIntro.titleMuted),
      description: textField(valuesIntro, "description", 400, defaultAboutContent.valuesIntro.description),
    },
    values: Array.isArray(data.values) ? values : defaultAboutContent.values,
    divisions: Array.isArray(data.divisions) ? divisions : defaultAboutContent.divisions,
    journey: Array.isArray(data.journey) ? journey : defaultAboutContent.journey,
    company: (() => {
      const defaults = defaultAboutContent.company;
      const commitments = Array.isArray(company.commitments)
        ? company.commitments
            .map((row) => {
              if (!isRecord(row)) return null;
              const title = clampText(row.title, 80);
              const text = clampText(row.text, 240);
              if (!title && !text) return null;
              return { title, text };
            })
            .filter((row): row is AboutContent["company"]["commitments"][number] => !!row)
            .slice(0, 8)
        : defaults.commitments;
      const facts = Array.isArray(company.facts)
        ? company.facts
            .map((row) => {
              if (!isRecord(row)) return null;
              const label = clampText(row.label, 80);
              const value = clampText(row.value, 200);
              if (!label && !value) return null;
              return { label, value };
            })
            .filter((row): row is AboutContent["company"]["facts"][number] => !!row)
            .slice(0, 16)
        : defaults.facts;
      return {
        visible: hasOwn(company, "visible") ? company.visible !== false && company.visible !== "false" : defaults.visible,
        eyebrow: textField(company, "eyebrow", 60, defaults.eyebrow),
        title: textField(company, "title", 120, defaults.title),
        titleMuted: textField(company, "titleMuted", 80, defaults.titleMuted),
        description: textField(company, "description", 600, defaults.description),
        ctaLabel: textField(company, "ctaLabel", 60, defaults.ctaLabel),
        ctaHref: hrefField(company, "ctaHref", defaults.ctaHref),
        sheetTitle: textField(company, "sheetTitle", 80, defaults.sheetTitle),
        sheetBadge: textField(company, "sheetBadge", 40, defaults.sheetBadge),
        commitments,
        facts,
      };
    })(),
    careers: {
      title: textField(careers, "title", 120, defaultAboutContent.careers.title),
      text: textField(careers, "text", 400, defaultAboutContent.careers.text),
      cta: textField(careers, "cta", 60, defaultAboutContent.careers.cta),
    },
    partner: {
      title: textField(partner, "title", 120, defaultAboutContent.partner.title),
      text: textField(partner, "text", 400, defaultAboutContent.partner.text),
      cta: textField(partner, "cta", 60, defaultAboutContent.partner.cta),
    },
  };
}

export function normalizeTechContent(raw: unknown): TechContent {
  const data = isRecord(raw) ? raw : {};
  const cards = Array.isArray(data.cards)
    ? data.cards.slice(0, 6).map((row) => {
        const item = isRecord(row) ? row : {};
        return {
          title: clampText(item.title, 80, ""),
          text: clampText(item.text, 280, ""),
          stat: clampText(item.stat, 24, ""),
          image: safeMediaUrl(item.image, ""),
        };
      })
    : defaultTechContent.cards;
  return {
    eyebrow: textField(data, "eyebrow", 40, defaultTechContent.eyebrow),
    title: textField(data, "title", 80, defaultTechContent.title),
    titleMuted: textField(data, "titleMuted", 80, defaultTechContent.titleMuted),
    description: textField(data, "description", 240, defaultTechContent.description),
    cards,
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
          if (!title && !text) return null;
          return { title, text };
        })
        .filter((row): row is HowItWorksContent["steps"][number] => !!row)
        .slice(0, 8)
    : [];

  return {
    eyebrow: textField(data, "eyebrow", 60, defaultHowItWorksContent.eyebrow),
    title: textField(data, "title", 120, defaultHowItWorksContent.title),
    titleMuted: textField(data, "titleMuted", 80, defaultHowItWorksContent.titleMuted),
    steps: Array.isArray(data.steps) ? steps : defaultHowItWorksContent.steps,
  };
}

export function normalizeNewsletterContent(raw: unknown): NewsletterContent {
  const data = isRecord(raw) ? raw : {};
  return {
    eyebrow: textField(data, "eyebrow", 60, defaultNewsletterContent.eyebrow),
    title: textField(data, "title", 80, defaultNewsletterContent.title),
    titleAccent: textField(data, "titleAccent", 40, defaultNewsletterContent.titleAccent),
    description: textField(data, "description", 400, defaultNewsletterContent.description),
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
          const name = clampText(row.name, 60, "");
          const photo = image.startsWith("/products/") ? "" : image;
          if (!name && !photo) return null;
          return { name, image: photo };
        })
        .filter((row): row is WhatsappWidgetContent["staff"][number] => !!row)
        .slice(0, 6)
    : [];

  return {
    enabled: data.enabled !== false && data.enabled !== "false" && data.enabled !== 0,
    phone: hasOwn(data, "phone") ? digitsOnly(data.phone, "") : defaultWhatsappWidgetContent.phone,
    message: textField(data, "message", 200, defaultWhatsappWidgetContent.message),
    rotateSeconds,
    staff,
  };
}

function parseInstallSteps(raw: unknown): InstallationContent["steps"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!isRecord(row)) return null;
      const title = clampText(row.title, 100, "");
      const body = clampText(row.body, 600, "");
      const tip = clampText(row.tip, 240, "");
      const image = safeMediaUrl(row.image, "");
      if (!title && !body && !image) return null;
      return {
        title,
        body,
        ...(tip ? { tip } : {}),
        ...(image ? { image } : {}),
      };
    })
    .filter((row): row is InstallationContent["steps"][number] => !!row)
    .slice(0, 16);
}

function parseInstallTroubles(raw: unknown): InstallationContent["troubleshooting"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!isRecord(row)) return null;
      const problem = clampText(row.problem, 120, "");
      const fix = clampText(row.fix, 400, "");
      return problem || fix ? { problem, fix } : null;
    })
    .filter((row): row is InstallationContent["troubleshooting"][number] => !!row)
    .slice(0, 12);
}

/** Read path: saved CMS as-is. Seed defaults only when a field was never stored. */
export function normalizeInstallationContent(raw: unknown): InstallationContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultInstallationContent;
  const steps = Array.isArray(data.steps) ? parseInstallSteps(data.steps) : defaults.steps;
  const troubleshooting = Array.isArray(data.troubleshooting)
    ? parseInstallTroubles(data.troubleshooting)
    : defaults.troubleshooting;
  const kit = Array.isArray(data.kit) ? asStringArray(data.kit, 20, 80) : defaults.kit;

  return {
    eyebrow: textField(data, "eyebrow", 60, defaults.eyebrow),
    title: textField(data, "title", 80, defaults.title),
    titleAccent: textField(data, "titleAccent", 80, defaults.titleAccent),
    intro: textField(data, "intro", 500, defaults.intro),
    duration: textField(data, "duration", 40, defaults.duration),
    videoUrl: hasOwn(data, "videoUrl") ? safeVideoUrl(data.videoUrl, "") : defaults.videoUrl,
    brandsNote: textField(data, "brandsNote", 80, defaults.brandsNote),
    kit,
    steps,
    troubleshooting,
  };
}

/** Publish path: keep the live guide; only overwrite fields the editor actually sent. */
export function mergeInstallationContent(
  incoming: unknown,
  previous: InstallationContent,
): InstallationContent {
  const data = isRecord(incoming) ? incoming : {};
  const steps = parseInstallSteps(data.steps);
  const troubleshooting = Array.isArray(data.troubleshooting)
    ? parseInstallTroubles(data.troubleshooting)
    : previous.troubleshooting;
  const kit = Array.isArray(data.kit) ? asStringArray(data.kit, 20, 80) : previous.kit;

  return {
    eyebrow: textField(data, "eyebrow", 60, previous.eyebrow),
    title: textField(data, "title", 80, previous.title),
    titleAccent: textField(data, "titleAccent", 80, previous.titleAccent),
    intro: textField(data, "intro", 500, previous.intro),
    duration: textField(data, "duration", 40, previous.duration),
    videoUrl: hasOwn(data, "videoUrl") ? safeVideoUrl(data.videoUrl, "") : previous.videoUrl,
    brandsNote: textField(data, "brandsNote", 80, previous.brandsNote),
    kit,
    steps: Array.isArray(data.steps) ? steps : previous.steps,
    troubleshooting,
  };
}

export function normalizeCollectionsContent(raw: unknown): CollectionsContent {
  const data = isRecord(raw) ? raw : {};
  const items = Array.isArray(data.items)
    ? data.items
        .map((row) => {
          if (!isRecord(row)) return null;
          const slug = safeSlug(row.slug);
          const name = clampText(row.name, 80, "");
          const description = clampText(row.description, 240, "");
          const image = safeMediaUrl(row.image, "");
          if (!slug && !name && !description && !image) return null;
          return { slug, name, description, image };
        })
        .filter((row): row is CollectionsContent["items"][number] => !!row)
        .slice(0, 8)
    : [];

  return {
    eyebrow: textField(data, "eyebrow", 60, defaultCollectionsContent.eyebrow),
    title: textField(data, "title", 120, defaultCollectionsContent.title),
    titleMuted: textField(data, "titleMuted", 80, defaultCollectionsContent.titleMuted),
    ctaLabel: textField(data, "ctaLabel", 40, defaultCollectionsContent.ctaLabel),
    ctaHref: hrefField(data, "ctaHref", defaultCollectionsContent.ctaHref),
    items: Array.isArray(data.items) ? items : defaultCollectionsContent.items,
  };
}

function normalizeHeroSlide(row: unknown): HeroSlide | null {
  if (!isRecord(row)) return null;
  const key = safeSlug(row.key) || clampText(row.key, 40).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const brand = clampText(row.brand, 40);
  const title = clampText(row.title, 80);
  const titleAccent = clampText(row.titleAccent, 80);
  const text = clampText(row.text, 280);
  const primaryLabel = clampText(row.primaryLabel, 40);
  const primaryHref = safeInternalHref(row.primaryHref, "");
  const secondaryLabel = clampText(row.secondaryLabel, 40);
  const secondaryHref = safeInternalHref(row.secondaryHref, "");
  const visual = normalizeHeroVisual(row.visual);
  const image = safeMediaUrl(row.image, "");
  const imageMobile = safeMediaUrl(row.imageMobile, "");

  const blank = !brand && !title && !titleAccent && !text && !primaryLabel && !secondaryLabel && !image && !imageMobile;
  if (!key || blank) return null;

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
    imageMobile,
  };
}

export function normalizeShowcaseContent(raw: unknown): ShowcaseContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultShowcaseContent;

  const videos: ShowcaseVideoItem[] = Array.isArray(data.videos)
    ? data.videos
        .map((row) => {
          if (!isRecord(row)) return null;
          const title = clampText(row.title, 100, "");
          const caption = clampText(row.caption, 200, "");
          const duration = clampText(row.duration, 40, "");
          const poster = safeMediaUrl(row.poster, "");
          const videoUrl = safeYoutubeUrl(row.videoUrl, "") || safeYoutubeUrl(row.youtubeId, "");
          const href = safeInternalHref(row.href, "");
          if (!title && !caption && !duration && !poster && !videoUrl) return null;
          return { title, caption, duration, poster, videoUrl, href };
        })
        .filter((row): row is ShowcaseVideoItem => !!row)
        .slice(0, 6)
    : defaults.videos;

  return {
    eyebrow: textField(data, "eyebrow", 60, defaults.eyebrow),
    title: textField(data, "title", 80, defaults.title),
    titleMuted: textField(data, "titleMuted", 80, defaults.titleMuted),
    channelLabel: textField(data, "channelLabel", 40, defaults.channelLabel),
    channelHref: textField(data, "channelHref", 240, defaults.channelHref),
    videos,
  };
}

export function normalizeShippingContent(raw: unknown): ShippingContent {
  const data = isRecord(raw) ? raw : {};
  const mode = data.mode === "free" ? "free" : "paid";
  const amount = Math.min(1_000_000, Math.max(0, Math.round(Number(data.amount) || 0)));
  return { mode, amount: mode === "free" ? 0 : amount };
}

function socialField(
  data: Record<string, unknown>,
  key: "facebook" | "instagram" | "youtube" | "x",
  fallback: string,
) {
  if (!hasOwn(data, key)) return fallback;
  const raw = typeof data[key] === "string" ? data[key].trim() : "";
  if (!raw) return "";
  return safeSocialUrl(key, raw, "");
}

export function normalizeSocialContent(raw: unknown): SocialContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultSocialContent;
  return {
    facebook: socialField(data, "facebook", defaults.facebook),
    instagram: socialField(data, "instagram", defaults.instagram),
    youtube: socialField(data, "youtube", defaults.youtube),
    x: socialField(data, "x", defaults.x),
  };
}

function snippetText(raw: unknown) {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, 12_000);
}

function sanitizeGtmId(raw: unknown) {
  const match = snippetText(raw).match(/GTM-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : "";
}

function sanitizeGa4Id(raw: unknown) {
  const match = snippetText(raw).match(/(?:^|[^A-Z0-9-])(G-[A-Z0-9]{6,12})\b/i);
  return match ? match[1].toUpperCase() : "";
}

function sanitizeMetaPixelId(raw: unknown) {
  const text = snippetText(raw);
  const fromInit = text.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d{5,20})['"]/i);
  if (fromInit?.[1]) return fromInit[1];
  const fromTr = text.match(/facebook\.com\/tr\?id=(\d{5,20})/i);
  if (fromTr?.[1]) return fromTr[1];
  const digits = text.replace(/\s/g, "");
  return /^\d{5,20}$/.test(digits) ? digits : "";
}

function sanitizeTiktokPixelId(raw: unknown) {
  const text = snippetText(raw);
  const fromLoad = text.match(/ttq\.load\s*\(\s*['"]([A-Z0-9]{10,30})['"]/i);
  if (fromLoad?.[1]) return fromLoad[1];
  return /^[A-Z0-9]{10,30}$/i.test(text) ? text : "";
}

function sanitizeVerification(raw: unknown) {
  const text = snippetText(raw);
  const tagged = text.match(/content\s*=\s*["']([^"']+)["']/i);
  const value = (tagged?.[1] || text).trim();
  return /^[A-Za-z0-9_-]{8,120}$/.test(value) ? value : "";
}

export function normalizeTrackingContent(raw: unknown): TrackingContent {
  const data = isRecord(raw) ? raw : {};
  return {
    gtmId: sanitizeGtmId(data.gtmId),
    metaPixelId: sanitizeMetaPixelId(data.metaPixelId),
    tiktokPixelId: sanitizeTiktokPixelId(data.tiktokPixelId),
    ga4Id: sanitizeGa4Id(data.ga4Id),
    googleVerification: sanitizeVerification(data.googleVerification),
    bingVerification: sanitizeVerification(data.bingVerification),
    requireConsent: data.requireConsent === true || data.requireConsent === "true" || data.requireConsent === "on",
  };
}

export function normalizeImpactContent(raw: unknown): ImpactContent {
  const data = isRecord(raw) ? raw : {};
  const images = Array.isArray(data.images)
    ? data.images
        .map((row) => {
          if (!isRecord(row)) return null;
          const url = safeMediaUrl(row.url, "");
          if (!url) return null;
          return { url, alt: clampText(row.alt, 80, "") };
        })
        .filter((row): row is ImpactContent["images"][number] => !!row)
        .slice(0, 10)
    : defaultImpactContent.images;
  return { images };
}

export function normalizeImpactLabContent(raw: unknown): ImpactLabContent {
  const data = isRecord(raw) ? raw : {};
  const defaults = defaultImpactLabContent;
  const cards = Array.isArray(data.cards)
    ? data.cards
        .map((row) => {
          if (!isRecord(row)) return null;
          const value = clampText(row.value, 16, "");
          const label = clampText(row.label, 80, "");
          const image = safeMediaUrl(row.image, "");
          if (!value && !label && !image) return null;
          return { value, label, image };
        })
        .filter((row): row is ImpactLabContent["cards"][number] => !!row)
        .slice(0, 4)
    : defaults.cards;
  return {
    eyebrow: textField(data, "eyebrow", 40, defaults.eyebrow),
    title: textField(data, "title", 80, defaults.title),
    titleMuted: textField(data, "titleMuted", 80, defaults.titleMuted),
    text: textField(data, "text", 280, defaults.text),
    cards,
  };
}

export function normalizeClarityContent(raw: unknown): ClarityContent {
  const data = isRecord(raw) ? raw : {};
  return {
    beforeImage: mediaField(data, "beforeImage"),
    afterImage: mediaField(data, "afterImage"),
    beforeLabel: textField(data, "beforeLabel", 40, defaultClarityContent.beforeLabel),
    afterLabel: textField(data, "afterLabel", 40, defaultClarityContent.afterLabel),
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
          if (!value && !label) return null;
          return { value, label };
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
          if (!label && !href) return null;
          return { label, href };
        })
        .filter((row): row is HomeHeroContent["quickLinks"][number] => !!row)
        .slice(0, 6)
    : [];

  const slides = Array.isArray(data.slides)
    ? data.slides
        .map((row) => normalizeHeroSlide(row))
        .filter((row): row is HeroSlide => !!row)
        .slice(0, 6)
    : [];

  return {
    ratingLabel: textField(data, "ratingLabel", 80, defaults.ratingLabel),
    quickLinks: Array.isArray(data.quickLinks) ? quickLinks : defaults.quickLinks,
    stats: Array.isArray(data.stats) ? stats : defaults.stats,
    slides: Array.isArray(data.slides) ? slides : defaults.slides,
  };
}
