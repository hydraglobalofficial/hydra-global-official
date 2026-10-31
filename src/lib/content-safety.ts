/**
 * Validate CMS / admin-authored URLs so the storefront never renders open redirects
 * or next/image hosts that will blow up SSR.
 */

const MAX_HREF = 200;
const MAX_IMAGE = 500;
const MAX_VIDEO = 500;
const MAX_SLUG = 80;

/** Relative site paths only: /shop, /about#team — not //evil, javascript:, https://… */
export function safeInternalHref(raw: unknown, fallback = "/"): string {
  if (typeof raw !== "string") return fallback;
  const href = raw.trim();
  if (!href || href.length > MAX_HREF) return fallback;
  if (!href.startsWith("/")) return fallback;
  if (href.startsWith("//")) return fallback;
  if (href.includes("://")) return fallback;
  if (/[\u0000-\u001F\u007F]/.test(href)) return fallback;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return fallback;
  return href;
}

function hostnameFromEnv(name: string): string {
  const base = process.env[name]?.trim();
  if (!base) return "";
  try {
    return new URL(base).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function r2PublicHost(): string {
  return hostnameFromEnv("R2_PUBLIC_URL");
}

function siteHost(): string {
  return hostnameFromEnv("NEXT_PUBLIC_SITE_URL");
}

function isAllowedMediaHost(host: string) {
  const configuredR2 = r2PublicHost();
  const configuredSite = siteHost();
  return (
    host === "i.ibb.co" ||
    host === "ibb.co" ||
    host === "imagebb.com" ||
    host.endsWith(".ibb.co") ||
    host.endsWith(".imagebb.com") ||
    host.endsWith(".r2.dev") ||
    host.endsWith(".amazonaws.com") ||
    (configuredR2 !== "" && host === configuredR2) ||
    (configuredSite !== "" && host === configuredSite)
  );
}

/** Local /public paths or allowlisted remote image hosts (see next.config.ts). */
export function safeMediaUrl(raw: unknown, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const url = raw.trim();
  if (!url || url.length > MAX_IMAGE) return fallback;
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("://")) {
    if (/[\u0000-\u001F\u007F]/.test(url)) return fallback;
    return url;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return fallback;
    if (parsed.protocol === "http:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
      return fallback;
    }
    const host = parsed.hostname.toLowerCase();
    return isAllowedMediaHost(host) || host === "localhost" || host === "127.0.0.1"
      ? parsed.toString()
      : fallback;
  } catch {
    return fallback;
  }
}

/** YouTube, Google Drive, allowlisted https media (R2 mp4/webm), or same-origin /public video paths. */
export function safeVideoUrl(raw: unknown, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const url = raw.trim();
  if (!url || url.length > MAX_VIDEO) return fallback;

  // Local public asset — e.g. /brand/hydra-animation.mp4
  if (url.startsWith("/") && !url.startsWith("//") && /\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return url.split("?")[0] ?? url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return fallback;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "youtu.be" ||
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "www.youtube-nocookie.com"
    ) {
      return parsed.toString();
    }
    if (host === "drive.google.com" || host === "docs.google.com") {
      return parsed.toString();
    }
    const allowed =
      isAllowedMediaHost(host) || host === "localhost" || host === "127.0.0.1";
    return allowed ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

/** YouTube watch/share/embed links only (homepage showcase). */
export function safeYoutubeUrl(raw: unknown, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const url = raw.trim();
  if (!url || url.length > MAX_VIDEO) return fallback;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return fallback;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "youtu.be" ||
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "www.youtube-nocookie.com"
    ) {
      return parsed.toString();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

const SOCIAL_HOSTS = {
  facebook: ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.com", "www.fb.com"],
  instagram: ["instagram.com", "www.instagram.com"],
  youtube: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  x: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
} as const;

/** https link for one social network. Anything else falls back. */
export function safeSocialUrl(network: keyof typeof SOCIAL_HOSTS, raw: unknown, fallback: string): string {
  if (typeof raw !== "string") return fallback;
  const url = raw.trim();
  if (!url || url.length > 400) return fallback;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return fallback;
    const host = parsed.hostname.toLowerCase();
    const allowed: readonly string[] = SOCIAL_HOSTS[network];
    return allowed.includes(host) ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function safeSlug(raw: unknown, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const slug = raw.trim().toLowerCase();
  if (!slug || slug.length > MAX_SLUG) return fallback;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fallback;
  return slug;
}

export function clampText(raw: unknown, max: number, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const text = raw.trim();
  if (!text) return fallback;
  return text.length > max ? text.slice(0, max) : text;
}

export function asStringArray(raw: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => clampText(item, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}
