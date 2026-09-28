"use client";

import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Premium card whose border and surface light up around the cursor. */
export function SpotlightCard({ className, onPointerMove, ...props }: ComponentPropsWithoutRef<"div">) {
  function track(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    onPointerMove?.(e);
  }

  return (
    <div
      {...props}
      onPointerMove={track}
      className={cn("card-premium spotlight rounded-3xl hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)]", className)}
    />
  );
}
