import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Creature crest — header left + compact mark. */
export const MARK_SRC = "/products/Hydra_Mark.png";
export const CREST_SRC = "/products/Hydra_Animation.png";
/** Real brand wordmark: HYDRA + SMART ACCESSORIES. */
export const WORDMARK_SRC = "/products/Hydra.png";

/**
 * TM sits at the top-right of the trailing A of HYDRA — same placement every breakpoint.
 * Zero-size host + scaled child: Chrome min-font safe, no unscaled white bar.
 */
function TmMark() {
  return (
    <span
      data-logo-tm
      aria-hidden
      className="pointer-events-none absolute z-20 select-none"
      style={{
        top: -2,
        left: "84%",
        width: 0,
        height: 0,
        overflow: "visible",
      }}
    >
      <span
        className="block whitespace-nowrap text-fg"
        style={{
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
    <span className={cn("relative inline-block size-10 shrink-0 overflow-hidden rounded-md bg-bg sm:size-11 md:size-12", className)}>
      <Image
        src={MARK_SRC}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        quality={92}
        className="theme-mark-invert object-contain object-center p-0.5"
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
        className="theme-mark-invert object-contain object-center"
      />
    </span>
  );
}

/**
 * Header / footer lockup: crest + Hydra.png wordmark + TM above the A.
 * Word box width tracks image aspect (≈3:1) so 84% stays on the A on phone + desktop.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group relative inline-flex shrink-0 items-center gap-0 overflow-visible", className)}
      aria-label="HYDRA home"
    >
      <span
        data-logo-crest
        className="relative block shrink-0"
        style={{ width: 40, height: 40, marginRight: -2 }}
      >
        <Image
          src={MARK_SRC}
          alt=""
          fill
          sizes="48px"
          priority
          quality={95}
          className="theme-mark-invert object-contain object-center scale-[1.08]"
        />
      </span>

      {/* Aspect ≈ 3:1 — box matches mark so TM @ 84% lands on the A. */}
      <span
        data-logo-word
        className="relative block shrink-0 overflow-visible"
        style={{ width: 120, height: 40 }}
      >
        <Image
          src={WORDMARK_SRC}
          alt="HYDRA — Smart Accessories"
          fill
          sizes="160px"
          priority
          quality={95}
          className="theme-mark-invert object-contain object-left transition-opacity duration-300 group-hover:opacity-90"
        />
        <TmMark />
      </span>
    </Link>
  );
}
