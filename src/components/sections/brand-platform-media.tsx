"use client";

import { useState } from "react";
import { BrandPhoneBack } from "@/components/sections/brand-phone-back";
import { cn } from "@/lib/utils";

/** Local originals — latest flagship camera / back plates. */
const DEFAULT_TILES: Record<string, string> = {
  iphone: "/brands/iphone.jpg",
  samsung: "/brands/samsung.jpg",
};

/**
 * Shop-by-device media: fills the right-hand slot with the brand’s
 * original phone-back photo. Falls back to an SVG phone if the photo fails.
 */
export function BrandPlatformMedia({
  slug,
  code,
  image,
  label,
  className,
}: {
  slug: string;
  code?: string;
  image?: string | null;
  label: string;
  className?: string;
}) {
  const photo = (image?.trim() || DEFAULT_TILES[slug] || "").trim();
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(photo) && !failed;

  return (
    <div
      className={cn(
        "relative z-[1] mx-auto w-44 shrink-0 sm:mx-0 sm:w-52 md:w-56 lg:w-64",
        className,
      )}
    >
      <div className="relative w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:rotate-[-2.5deg]">
        {showPhoto ? (
          <div className="relative overflow-hidden rounded-[1.65rem] bg-[#ececef] shadow-[0_28px_48px_rgba(0,0,0,0.22)] ring-1 ring-black/10 light:shadow-[0_20px_40px_rgba(0,0,0,0.12)] light:ring-black/10">
            {/* In-flow img so the slot gets real height (absolute-only boxes collapse). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`${label} back`}
              width={600}
              height={800}
              decoding="async"
              onError={() => setFailed(true)}
              style={{ aspectRatio: "3 / 4" }}
              className="h-auto w-full object-cover object-[28%_22%]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.65rem] ring-1 ring-inset ring-white/35" />
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[2%] h-10 rounded-[100%] bg-black/25 blur-2xl light:bg-black/10" />
          </div>
        ) : (
          <BrandPhoneBack
            slug={slug}
            code={code}
            className="drop-shadow-[0_28px_44px_rgba(0,0,0,0.35)] light:drop-shadow-[0_20px_36px_rgba(0,0,0,0.16)]"
          />
        )}
      </div>
    </div>
  );
}
