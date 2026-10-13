"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { applyTheme, type Theme } from "@/lib/theme";
import { useTheme } from "./theme-provider";

/** Icon-only theme switch — applies DOM theme immediately, then syncs React state. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        const attr = document.documentElement.getAttribute("data-theme");
        const current: Theme = attr === "light" || attr === "dark" ? attr : theme;
        const next: Theme = current === "dark" ? "light" : "dark";
        // DOM first so the UI flips even if React state is lagging.
        applyTheme(next);
        setTheme(next);
      }}
      className={cn(
        "touch-target grid place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg light:hover:bg-black/5",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light" : "Dark"}
    >
      {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}
