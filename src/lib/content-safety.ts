/**
 * Validate CMS / admin-authored URLs so the storefront never renders open redirects
 * or next/image hosts that will blow up SSR.
 */

const MAX_HREF = 200;
const MAX_IMAGE = 400;
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
    if (parsed.protocol !== "https:") return fallback;
    const host = parsed.hostname.toLowerCase();
    const allowed =
      host === "i.ibb.co" ||
      host === "ibb.co" ||
      host === "imagebb.com" ||
      host.endsWith(".ibb.co") ||
      host.endsWith(".imagebb.com") ||
      host.endsWith(".r2.dev") ||
      host.endsWith(".amazonaws.com");
    return allowed ? parsed.toString() : fallback;
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
