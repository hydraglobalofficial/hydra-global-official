/** Shared theme helpers — safe for server + client. No React. */

export type Theme = "dark" | "light";

/** Used when the visitor has not chosen a theme yet. */
export const DEFAULT_THEME: Theme = "light";

export const THEME_STORAGE_KEY = "hydra-theme";
export const THEME_STYLE_ID = "hydra-theme-live";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** Live stylesheet swapped on every theme change (beats stale Tailwind caches). */
export function themeVarsCss(theme: Theme): string {
  if (theme === "light") {
    return `
html,html.light,html[data-theme="light"]{
  color-scheme:light!important;
  background-color:#ffffff!important;
  --color-bg:#ffffff!important;
  --color-surface:#ffffff!important;
  --color-surface-2:#ffffff!important;
  --color-surface-3:#f4f4f5!important;
  --color-line:rgb(0 0 0/.1)!important;
  --color-line-strong:rgb(0 0 0/.18)!important;
  --color-fg:#0a0a0c!important;
  --color-muted:#3f3f46!important;
  --color-subtle:#52525b!important;
  --color-accent:#1e3a8a!important;
  --hydra-card-top:#DCEEF9!important;
  --hydra-card-bottom:#DCEEF9!important;
  --hydra-glass-top:#ffffff!important;
  --hydra-glass-bottom:#ffffff!important;
  --hydra-grid:transparent!important;
  --hydra-dot:transparent!important;
  --hydra-vignette:transparent!important;
}
html body,html.light body,html[data-theme="light"] body{
  background-color:#ffffff!important;
  color:#0a0a0c!important;
}
html.light .card-premium,html[data-theme="light"] .card-premium,
html.light .spotlight.card-premium,html[data-theme="light"] .spotlight.card-premium{
  background:#DCEEF9!important;
  background-image:none!important;
  border:1px solid #C5E0F3!important;
  box-shadow:0 1px 0 rgb(255 255 255/.8),0 14px 36px -24px rgb(30 64 120/.22)!important;
  color:#0a0a0c!important;
}
html.light .card-premium.product-card,html[data-theme="light"] .card-premium.product-card{
  background:transparent!important;
  background-image:none!important;
}
html.light .install-media-card,html[data-theme="light"] .install-media-card{
  background:#ffffff!important;
  background-image:none!important;
}
html.light .admin-drawer-panel,html[data-theme="light"] .admin-drawer-panel{
  background:#ffffff!important;
  color:#0a0a0c!important;
}
html.light .bento-fill.card-premium,html[data-theme="light"] .bento-fill.card-premium{
  background:transparent!important;
  background-image:none!important;
  border:0!important;
  box-shadow:none!important;
}
html.light .ambient-fx,html[data-theme="light"] .ambient-fx,
html.light .hero-stage-glow,html.light .hero-stage-wash,html.light .hero-stage-grid,
html.light .hero-visual-glow,html.light .animate-hero-glow,html.light .phone-visual-glow,
html.light .light-wash,html.light .bg-grid,html.light .bg-dots,html.light .bg-noise,
html.light .install-hero-wash,html.light .footer-wash,html.light .divider-glow,
html[data-theme="light"] .hero-stage-glow,html[data-theme="light"] .hero-stage-wash,
html[data-theme="light"] .hero-stage-grid,html[data-theme="light"] .hero-visual-glow,
html[data-theme="light"] .animate-hero-glow,html[data-theme="light"] .phone-visual-glow,
html[data-theme="light"] .light-wash,html[data-theme="light"] .bg-grid,
html[data-theme="light"] .bg-dots,html[data-theme="light"] .bg-noise,
html[data-theme="light"] .install-hero-wash,html[data-theme="light"] .footer-wash,
html[data-theme="light"] .divider-glow,html[data-theme="light"] .ambient-fx{
  display:none!important;opacity:0!important;visibility:hidden!important;
}
html.light .hero-stage-bg,html[data-theme="light"] .hero-stage-bg,
html.light [aria-label="Featured collections"]>div:first-child:not(.hero-film),
html[data-theme="light"] [aria-label="Featured collections"]>div:first-child:not(.hero-film){
  background:#ffffff!important;background-image:none!important;
}
.hero-film{aspect-ratio:16/9!important;height:auto!important}
html.light .hero-film,html[data-theme="light"] .hero-film,
html.light .hydra-film-block,html[data-theme="light"] .hydra-film-block{
  background:#000!important;background-image:none!important;color:#fff!important;
}
html.light .spotlight::before,html.light .spotlight::after,
html[data-theme="light"] .spotlight::before,html[data-theme="light"] .spotlight::after{
  display:none!important;opacity:0!important;
}
html.light .bento-scrim,html[data-theme="light"] .bento-scrim{
  background:linear-gradient(to top,#ffffff 35%,rgb(255 255 255/.92) 70%,transparent)!important;
  background-image:linear-gradient(to top,#ffffff 35%,rgb(255 255 255/.92) 70%,transparent)!important;
}
html.light .product-media-stage,html[data-theme="light"] .product-media-stage{
  background:transparent!important;
  background-image:none!important;
  box-shadow:none!important;
}
html.light .product-media-stage .bg-dots,html.light .product-media-stage .bg-grid,
html[data-theme="light"] .product-media-stage .bg-dots,html[data-theme="light"] .product-media-stage .bg-grid{
  opacity:0!important;display:none!important;
}
html.light .admin-card,html[data-theme="light"] .admin-card{
  background:#ffffff!important;
  border-color:rgb(0 0 0/.1)!important;
  box-shadow:0 1px 0 rgb(0 0 0/.04),0 12px 28px -22px rgb(0 0 0/.14)!important;
  color:#0a0a0c!important;
}
html.light .admin-field,html[data-theme="light"] .admin-field{
  background:#f4f4f5!important;
  border-color:rgb(0 0 0/.12)!important;
  color:#0a0a0c!important;
}
html.light .admin-field::placeholder,html[data-theme="light"] .admin-field::placeholder{color:#71717a!important}
html.light .theme-mark-invert,html[data-theme="light"] .theme-mark-invert{filter:brightness(0)!important}
html.light .hydra-crest-ink img,html[data-theme="light"] .hydra-crest-ink img,
html.light img.hydra-mark-ink,html[data-theme="light"] img.hydra-mark-ink{filter:brightness(0)!important}
`.replace(/\s+/g, " ").trim();
  }

  return `
html,html.dark,html[data-theme="dark"]{
  color-scheme:dark!important;
  background-color:#000000!important;
  --color-bg:#000000!important;
  --color-surface:#0a0a0c!important;
  --color-surface-2:#111114!important;
  --color-surface-3:#18181c!important;
  --color-line:rgb(255 255 255/.08)!important;
  --color-line-strong:rgb(255 255 255/.16)!important;
  --color-fg:#f4f4f6!important;
  --color-muted:#a1a1aa!important;
  --color-subtle:#71717a!important;
  --color-accent:#3b82f6!important;
}
html body,html.dark body,html[data-theme="dark"] body{
  background-color:#000000!important;
  color:#f4f4f6!important;
}
html.dark .admin-card,html[data-theme="dark"] .admin-card{
  background:#0a0a0c!important;
  border-color:rgb(255 255 255/.08)!important;
  box-shadow:inset 0 1px 0 rgb(255 255 255/.04)!important;
  color:#f4f4f6!important;
}
html.dark .admin-field,html[data-theme="dark"] .admin-field{
  background:#111114!important;
  border-color:rgb(255 255 255/.1)!important;
  color:#f4f4f6!important;
}
html.dark .admin-field::placeholder,html[data-theme="dark"] .admin-field::placeholder{color:#71717a!important}
`.replace(/\s+/g, " ").trim();
}

/** Apply theme to the document. Call from click handlers + boot script. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  // Clear any leftover inline var overrides from older theme code.
  for (const prop of [
    "--color-bg",
    "--color-surface",
    "--color-surface-2",
    "--color-surface-3",
    "--color-line",
    "--color-line-strong",
    "--color-fg",
    "--color-muted",
    "--color-subtle",
    "--color-accent",
  ]) {
    root.style.removeProperty(prop);
  }
  root.style.removeProperty("background-color");
  if (document.body) {
    document.body.style.removeProperty("background-color");
    document.body.style.removeProperty("color");
  }

  // Drop legacy style tags from older theme implementations.
  document.querySelectorAll("#hydra-light-pure-white").forEach((n) => n.remove());

  let el = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = THEME_STYLE_ID;
    (document.head || root).appendChild(el);
  }
  el.textContent = themeVarsCss(theme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

/**
 * Blocking boot script — static string so SSR + client always match
 * (avoids hydration mismatch from generated template literals).
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var id=${JSON.stringify(THEME_STYLE_ID)};var fallback=${JSON.stringify(DEFAULT_THEME)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark")t=fallback;var d=document.documentElement;d.classList.remove("dark","light");d.classList.add(t);d.setAttribute("data-theme",t);d.style.colorScheme=t;var css=t==="light"?${JSON.stringify(themeVarsCss("light"))}:${JSON.stringify(themeVarsCss("dark"))};var s=document.getElementById(id);if(!s){s=document.createElement("style");s.id=id;(document.head||d).appendChild(s);}s.textContent=css;}catch(e){var r=document.documentElement;r.classList.remove("dark","light");r.classList.add("light");r.setAttribute("data-theme","light");r.style.colorScheme="light";}})();`;
