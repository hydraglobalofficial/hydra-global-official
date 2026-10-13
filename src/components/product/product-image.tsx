"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK_DARK = "/products/glass-clear.jpg";
const FALLBACK_LIGHT = "/products/glass-clear-light.png";

/** Local catalog shots with a transparent `-light.png` plate for the white site. */
const LIGHT_PLATES = new Set([
  "box",
  "camera-lens",
  "case-clear",
  "glass-clear",
  "glass-matte",
  "glass-privacy",
]);

function lightPlateSrc(src: string): string | null {
  const match = src.trim().match(/^(\/products\/)([^/?#]+?)(\.(?:jpe?g|png|webp))$/i);
  if (!match) return null;
  const base = match[2].replace(/-light$/i, "");
  if (!LIGHT_PLATES.has(base)) return null;
  return `${match[1]}${base}-light.png`;
}

function resolveSrc(src: ImageProps["src"] | undefined, failed: boolean, preferLight: boolean) {
  if (failed) return preferLight ? FALLBACK_LIGHT : FALLBACK_DARK;
  if (typeof src === "string") {
    const trimmed = src.trim();
    if (!trimmed) return preferLight ? FALLBACK_LIGHT : FALLBACK_DARK;
    if (preferLight) {
      const light = lightPlateSrc(trimmed);
      if (light) return light;
    }
    return trimmed;
  }
  return src || (preferLight ? FALLBACK_LIGHT : FALLBACK_DARK);
}

function readIsLight() {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  return root.classList.contains("light") || root.getAttribute("data-theme") === "light";
}

/** Product media with SVG passthrough + broken-image fallback. */
export function ProductImage({ src, alt, className, onError, priority, loading, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const [preferLight, setPreferLight] = useState(false);
  const resolved = resolveSrc(src, failed, preferLight);
  const isSvg = typeof resolved === "string" && resolved.endsWith(".svg");
  // Above-the-fold product/LCP images must be eager (Next warns when priority is omitted).
  const eager = priority === true || loading === "eager";

  useEffect(() => {
    const sync = () => setPreferLight(readIsLight());
    sync();
    const root = document.documentElement;
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Image
      key={`${typeof resolved === "string" ? resolved : "fallback"}:${preferLight ? "light" : "dark"}`}
      src={resolved}
      alt={alt || "HYDRA product"}
      unoptimized={isSvg}
      priority={priority}
      loading={eager ? "eager" : loading}
      className={cn(className)}
      onError={(e) => {
        if (!failed) setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
