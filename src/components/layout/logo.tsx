import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Creature crest (Hydra_Animation) for compact mark. */
export const MARK_SRC = "/products/Hydra_Mark.png";
export const CREST_SRC = "/products/Hydra_Animation.png";
/** Full HYDRA wordmark + tagline (real brand PNG). */
export const WORDMARK_SRC = "/products/Hydra.png";

/** Creature mark — from Hydra_Animation.png */
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

/** Real HYDRA wordmark image (includes SMART ACCESSORIES). */
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
 * Brand lockup: crest + full HYDRA wordmark, TM tucked on the A (not far away).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex max-w-[70vw] shrink-0 items-center gap-1.5 sm:max-w-none sm:gap-2",
        className,
      )}
      aria-label="HYDRA home"
    >
      <span className="relative block size-9 shrink-0 sm:size-10 md:size-11">
        <Image
          src={MARK_SRC}
          alt=""
          fill
          sizes="48px"
          priority
          quality={92}
          className="object-contain object-center"
        />
      </span>

      <span className="relative block h-9 w-[7.5rem] sm:h-11 sm:w-[9.25rem] md:h-12 md:w-[10.5rem]">
        <Image
          src={WORDMARK_SRC}
          alt="HYDRA"
          fill
          sizes="200px"
          priority
          quality={95}
          className="object-contain object-left brightness-0 invert transition-opacity duration-300 group-hover:opacity-90"
        />
        {/* Sit on the A — left% beats right-edge padding in the PNG */}
        <span
          className="pointer-events-none absolute left-[86%] top-0 select-none font-sans text-[7px] font-extrabold leading-none tracking-tighter text-white sm:left-[87%] sm:text-[8px] md:left-[88%] md:text-[9px]"
          aria-hidden
        >
          TM
        </span>
      </span>
    </Link>
  );
}
