import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MARK_SRC = "/products/Hydra_Animation.png";
const WORDMARK_SRC = "/products/Hydra.png";

/** Creature mark — silver/black original on black plate. */
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
      <Image src={MARK_SRC} alt="" fill sizes={sizes} priority={priority} className="object-contain object-center p-0.5" />
    </span>
  );
}

/** Original HYDRA brand PNG for footer / large lockups. */
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
    <span className={cn("relative inline-block bg-black", className)}>
      <Image src={WORDMARK_SRC} alt="" fill sizes={sizes} priority={priority} className="object-contain object-center" />
    </span>
  );
}

/**
 * Header lockup: mark | HYDRA wordmark + TM (closer).
 * Silver + black only; black logo plate.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex max-w-[70vw] shrink-0 items-center gap-2 rounded-lg bg-black px-1.5 py-1 sm:max-w-none sm:gap-2.5 sm:px-2",
        className,
      )}
      aria-label="HYDRA home"
    >
      <LogoMark priority className="size-9 sm:size-10 md:size-11" />
      <span className="relative inline-flex items-start gap-0.5">
        <span className="text-[1.15rem] font-semibold tracking-[0.14em] text-zinc-200 transition-colors group-hover:text-white sm:text-[1.35rem] sm:tracking-[0.16em] md:text-[1.55rem]">
          HYDRA
        </span>
        <span
          className="mt-[0.15em] select-none font-mono text-[5px] font-semibold leading-none tracking-wide text-zinc-400 transition-colors group-hover:text-zinc-200 sm:text-[6px] md:text-[7px]"
          aria-hidden
        >
          TM
        </span>
      </span>
    </Link>
  );
}
