"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK = "/products/glass-clear.jpg";

/** Product media with SVG passthrough + broken-image fallback. */
export function ProductImage({ src, alt, className, onError, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = failed || !src ? FALLBACK : src;
  const isSvg = typeof resolved === "string" && resolved.endsWith(".svg");

  return (
    <Image
      key={typeof resolved === "string" ? resolved : "fallback"}
      src={resolved}
      alt={alt}
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
