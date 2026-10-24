"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";
import {
  applyTheme,
  DEFAULT_THEME,
  readStoredTheme,
  type Theme,
} from "@/lib/theme";

export type { Theme };
export { themeInitScript, applyTheme } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();
const emptySubscribe = () => () => {};

/**
 * Motion prints a dev warning whenever the OS asks for reduced motion.
 * The in-editor browser always reports that, so the Next.js issue badge
 * stays red even though MotionConfig already forces animations on.
 * Swallow only that one message, before any motion child renders.
 */
function quietReducedMotionWarning() {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return;
  const current = console.warn as typeof console.warn & { __hydraQuiet?: boolean };
  if (current.__hydraQuiet) return;
  const wrapped = ((...args: unknown[]) => {
    const first = args[0];
    if (typeof first === "string" && first.includes("Reduced Motion enabled")) return;
    current.apply(console, args as Parameters<typeof console.warn>);
  }) as typeof console.warn & { __hydraQuiet?: boolean };
  wrapped.__hydraQuiet = true;
  console.warn = wrapped;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function getClientTheme(): Theme {
  return readStoredTheme();
}

function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  quietReducedMotionWarning();
  const stored = useSyncExternalStore(subscribe, getClientTheme, getServerTheme);
  // Keep SSR + first client paint on the server default so ThemeToggle (etc.) don't hydrate-mismatch
  // when localStorage has a different theme. After mount, switch to the stored value.
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const theme = hydrated ? stored : getServerTheme();

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    const current: Theme = attr === "light" || attr === "dark" ? attr : DEFAULT_THEME;
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
    emit();
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
