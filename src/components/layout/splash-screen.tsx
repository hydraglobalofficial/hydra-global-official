"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo";

const SEEN_KEY = "hydra.splash.seen";

/** Brand intro shown once per browser session. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "hide" | "done">("show");

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip intro for returning visitors
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    const hide = setTimeout(() => setPhase("hide"), 1400);
    const done = setTimeout(() => setPhase("done"), 2100);
    return () => {
      clearTimeout(hide);
      clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-black transition-opacity duration-700 [html[data-splash=seen]_&]:hidden",
        phase === "hide" && "pointer-events-none opacity-0",
      )}
      aria-hidden
    >
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/40 blur-2xl animate-pulse-glow" />
          <LogoMark className="relative size-16" />
        </div>
        <p className="shimmer-text text-2xl font-semibold tracking-[0.5em]">HYDRA</p>
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <div className="h-full w-full origin-left animate-[fade-up_1.3s_ease-out] bg-gradient-to-r from-accent to-accent-2" />
        </div>
      </div>
    </div>
  );
}
