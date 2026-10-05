"use client";

import dynamic from "next/dynamic";

/** Splash is client-only + heavy motion — keep it out of the SSR critical path. */
export const SplashScreen = dynamic(
  () => import("@/components/layout/splash-screen").then((m) => m.SplashScreen),
  { ssr: false },
);
