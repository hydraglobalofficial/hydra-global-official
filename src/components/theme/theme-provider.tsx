"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "hydra-theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Critical light CSS — inlined so stale /_next/static caches cannot keep a dark hero. */
export const lightPureWhiteCss = `
html.light,html[data-theme="light"]{background-color:#ffffff!important;color-scheme:light;--color-bg:#ffffff!important;--color-surface:#ffffff!important;--color-surface-2:#ffffff!important;--color-surface-3:#f4f4f5!important;--color-line:rgb(0 0 0/.1)!important;--color-line-strong:rgb(0 0 0/.18)!important;--color-fg:#0a0a0c!important;--color-muted:#3f3f46!important;--color-subtle:#52525b!important;--color-accent:#1e3a8a!important;--hydra-card-top:#ffffff;--hydra-card-bottom:#ffffff;--hydra-grid:transparent;--hydra-dot:transparent;--hydra-vignette:transparent}
html.light body,html[data-theme="light"] body{background-color:#ffffff!important;color:#0a0a0c!important}
html.light .ambient-fx,
html[data-theme="light"] .ambient-fx,
html.light .install-hero-wash,
html.light .footer-wash,
html.light .divider-glow,
html[data-theme="light"] .install-hero-wash,
html[data-theme="light"] .footer-wash,
html[data-theme="light"] .divider-glow,
html.light .hero-stage-glow,
html.light .hero-stage-wash,
html.light .hero-stage-grid,
html.light .hero-visual-glow,
html.light .animate-hero-glow,
html.light .phone-visual-glow,
html.light .light-wash,
html.light .bg-grid,
html.light .bg-dots,
html.light .bg-noise,
html[data-theme="light"] .hero-stage-glow,
html[data-theme="light"] .hero-stage-wash,
html[data-theme="light"] .hero-stage-grid,
html[data-theme="light"] .hero-visual-glow,
html[data-theme="light"] .animate-hero-glow,
html[data-theme="light"] .phone-visual-glow,
html[data-theme="light"] .light-wash,
html[data-theme="light"] .bg-grid,
html[data-theme="light"] .bg-dots,
html[data-theme="light"] .bg-noise{display:none!important;opacity:0!important;visibility:hidden!important}
html.light .hero-stage-bg,
html[data-theme="light"] .hero-stage-bg,
html.light [aria-label="Featured collections"]>div:first-child,
html[data-theme="light"] [aria-label="Featured collections"]>div:first-child,
html.light [class*="03050a"],
html[data-theme="light"] [class*="03050a"]{background:#ffffff!important;background-color:#ffffff!important;background-image:none!important}
html.light .bento-scrim,
html[data-theme="light"] .bento-scrim{background:linear-gradient(to top,#ffffff 35%,rgba(255,255,255,.92) 70%,transparent)!important}
html.light .card-premium,
html[data-theme="light"] .card-premium{background:#ffffff!important;background-image:none!important;border-color:rgba(0,0,0,.1)!important;box-shadow:0 1px 0 rgba(0,0,0,.04),0 14px 36px -24px rgba(0,0,0,.2)!important}
html.light .spotlight::before,
html.light .spotlight::after,
html[data-theme="light"] .spotlight::before,
html[data-theme="light"] .spotlight::after{display:none!important;opacity:0!important}
html.light .install-title-accent,
html[data-theme="light"] .install-title-accent{background:none!important;-webkit-text-fill-color:#0a0a0c!important;color:#0a0a0c!important}
html.light .install-step-active,
html[data-theme="light"] .install-step-active{background:#f4f4f5!important;border-color:rgba(0,0,0,.18)!important;box-shadow:none!important}
.install-step-active{box-shadow:none!important}
html.light .product-media-stage,
html[data-theme="light"] .product-media-stage{background:#f4f4f5!important;background-image:none!important}
html.light .wa-glow,
html[data-theme="light"] .wa-glow{opacity:.35!important}
html.light .theme-mark-invert,
html[data-theme="light"] .theme-mark-invert{filter:brightness(0)!important}
html.light [class*="blur-"][class*="bg-accent"],
html[data-theme="light"] [class*="blur-"][class*="bg-accent"],
html.light [class*="rounded-full"][class*="bg-accent/"][class*="blur"],
html[data-theme="light"] [class*="rounded-full"][class*="bg-accent/"][class*="blur"],
html.light [class*="bg-blue-"][class*="blur"],
html[data-theme="light"] [class*="bg-blue-"][class*="blur"]{opacity:0!important;display:none!important}
.install-media-card{box-shadow:none!important}
`.replace(/\s+/g, " ").trim();

const LIGHT_STYLE_ID = "hydra-light-pure-white";

function syncInlineLightCss(theme: Theme) {
  if (typeof document === "undefined") return;
  let el = document.getElementById(LIGHT_STYLE_ID) as HTMLStyleElement | null;
  if (theme === "light") {
    if (!el) {
      el = document.createElement("style");
      el.id = LIGHT_STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = lightPureWhiteCss;
  } else {
    el?.remove();
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  // Readable dark tokens (navy accent is illegible on black)
  if (theme === "dark") {
    root.style.setProperty("--color-accent", "#3b82f6");
    root.style.setProperty("--color-muted", "#a1a1aa");
    root.style.setProperty("--color-subtle", "#71717a");
  } else {
    root.style.removeProperty("--color-accent");
    root.style.removeProperty("--color-muted");
    root.style.removeProperty("--color-subtle");
  }
  syncInlineLightCss(theme);
}

/** Blocking inline script — runs before paint to avoid FOUC + bypasses stale CSS caches. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t!=="light"&&t!=="dark")t="dark";var d=document.documentElement;d.classList.remove("dark","light");d.classList.add(t);d.setAttribute("data-theme",t);d.style.colorScheme=t;if(t==="dark"){d.style.setProperty("--color-accent","#3b82f6");d.style.setProperty("--color-muted","#a1a1aa");d.style.setProperty("--color-subtle","#71717a");}if(t==="light"){var s=document.createElement("style");s.id=${JSON.stringify(LIGHT_STYLE_ID)};s.textContent=${JSON.stringify(lightPureWhiteCss)};document.documentElement.appendChild(s);}}catch(e){var r=document.documentElement;r.classList.add("dark");r.setAttribute("data-theme","dark");r.style.colorScheme="dark";r.style.setProperty("--color-accent","#3b82f6");}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const next: Theme = stored === "light" || stored === "dark" ? stored : "dark";
    setThemeState(next);
    applyTheme(next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / private mode */
    }
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
