"use client";

import Image from "next/image";
import { BrandPhoneBack } from "@/components/sections/brand-phone-back";
import { cn } from "@/lib/utils";

/** Fallback photos when admin has not uploaded a brand image yet */
const PHOTO_BY_FAMILY: Record<string, string> = {
  iphone: "/brands/iphone18-back.jpg",
  apple: "/brands/iphone18-back.jpg",
  samsung: "/brands/samsung-s25-back.png",
  galaxy: "/brands/samsung-s25-back.png",
};

function fallbackPhoto(slug: string, code?: string) {
  const key = `${slug} ${code ?? ""}`.toLowerCase();
  for (const [token, src] of Object.entries(PHOTO_BY_FAMILY)) {
    if (key.includes(token)) return src;
  }
  return null;
}

/**
 * Shop-by-device media — prefers admin-uploaded brand.image, else family fallback.
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
  const uploaded = image?.trim() || null;
  const photo = uploaded || fallbackPhoto(slug, code);

  return (
    <div
      className={cn("relative z-[1] mx-auto flex shrink-0 items-center justify-center sm:mx-0", className)}
      style={{ width: "min(100%, 12.5rem)", flex: "0 0 auto" }}
    >
      <div
        className="relative w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:rotate-[-2deg]"
        style={{ aspectRatio: "3 / 4" }}
      >
        <div
          className="pointer-events-none absolute inset-x-[12%] bottom-[2%] h-7 rounded-[100%] bg-black/25 blur-xl light:bg-slate-900/12"
          aria-hidden
        />
        {photo ? (
          <Image
            src={photo}
            alt={label}
            fill
            sizes="200px"
            className="object-contain object-center drop-shadow-[0_24px_40px_rgba(15,23,42,0.32)] light:drop-shadow-[0_16px_28px_rgba(15,23,42,0.18)]"
            priority={false}
          />
        ) : (
          <BrandPhoneBack
            slug={slug}
            code={code}
            className="relative h-full w-full drop-shadow-[0_22px_36px_rgba(15,23,42,0.28)]"
          />
        )}
      </div>
    </div>
  );
}
