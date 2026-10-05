"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK = "/products/glass-clear.jpg";

function resolveSrc(src: ImageProps["src"] | undefined, failed: boolean) {
  if (failed) return FALLBACK;
  if (typeof src === "string") {
    const trimmed = src.trim();
    return trimmed || FALLBACK;
  }
  return src || FALLBACK;
}

/** Product media with SVG passthrough + broken-image fallback. */
export function ProductImage({ src, alt, className, onError, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveSrc(src, failed);
  const isSvg = typeof resolved === "string" && resolved.endsWith(".svg");

  return (
    <Image
      key={typeof resolved === "string" ? resolved : "fallback"}
      src={resolved}
      alt={alt || "HYDRA product"}
      unoptimized={isSvg}
      className={cn(className)}
      onError={(e) => {
        if (!failed) setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
