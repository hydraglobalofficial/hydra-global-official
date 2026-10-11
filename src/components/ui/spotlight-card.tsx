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
      className={cn(
        "card-premium spotlight rounded-3xl transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(0,0,0,0.55)] light:hover:shadow-[0_20px_40px_-28px_rgba(0,0,0,0.18)]",
        className,
      )}
    />
  );
}
