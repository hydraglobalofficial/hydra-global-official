import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Creature crest — header left + compact mark. */
export const MARK_SRC = "/products/Hydra_Mark.png";
export const CREST_SRC = "/products/Hydra_Animation.png";
/** Real brand wordmark: HYDRA + SMART ACCESSORIES. */
export const WORDMARK_SRC = "/products/Hydra.png";

/**
 * TM sits above the trailing A of HYDRA.
 * Inline `left` (not Tailwind) so the class can never fail to emit and park TM at 0% (crest).
 * 16px + scale avoids Chrome min-font blow-up/clip in the header pill.
 */
function TmMark() {
  return (
    <span
      data-logo-tm
      aria-hidden
      className="pointer-events-none absolute z-20 block select-none text-white"
      style={{
        top: 0,
        left: "72%",
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: "0.05em",
        lineHeight: 1,
        transform: "scale(0.45)",
        transformOrigin: "left top",
      }}
    >
      TM
    </span>
  );
}

/** Creature mark only — login, favicon-style spots. */
export function LogoMark({
  className,
  priority = false,
  sizes = "64px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span className={cn("relative inline-block size-10 shrink-0 overflow-hidden rounded-md bg-black sm:size-11 md:size-12", className)}>
      <Image
        src={MARK_SRC}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        quality={92}
        className="object-contain object-center p-0.5"
      />
    </span>
  );
}

/** Full real wordmark image. */
export function WordmarkImage({
  className,
  priority = false,
  sizes = "900px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      <Image
        src={WORDMARK_SRC}
        alt="HYDRA"
        fill
        sizes={sizes}
        priority={priority}
        quality={95}
        className="object-contain object-center brightness-0 invert"
      />
    </span>
  );
}

/**
 * Header / footer lockup: crest + Hydra.png wordmark + TM above the A.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group relative inline-flex shrink-0 items-center gap-0 overflow-visible", className)}
      aria-label="HYDRA home"
    >
      <span data-logo-crest className="relative block size-9 shrink-0 sm:size-11 md:size-12" style={{ marginRight: -4 }}>
        <Image
          src={MARK_SRC}
          alt=""
          fill
          sizes="48px"
          priority
          quality={95}
          className="object-contain object-center scale-[1.08]"
        />
      </span>

      <span
        data-logo-word
        className="relative block h-9 overflow-hidden pt-2 sm:h-11 sm:pt-2.5 md:h-[3.25rem] md:pt-3"
        style={{ width: "clamp(7.25rem, 46vw, 9.75rem)" }}
      >
        <span className="relative block h-full overflow-hidden" style={{ width: "114%", marginLeft: "-2%" }}>
          <Image
            src={WORDMARK_SRC}
            alt="HYDRA — Smart Accessories"
            width={6516}
            height={2172}
            priority
            quality={95}
            className="h-full w-full object-contain object-left brightness-0 invert transition-opacity duration-300 group-hover:opacity-90"
          />
        </span>
        <TmMark />
      </span>
    </Link>
  );
}
