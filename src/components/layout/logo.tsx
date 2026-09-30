import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MARK_SRC = "/products/Hydra.png";

/**
 * HYDRA brand mark from `public/products/Hydra.png` (wordmark + tagline).
 * Pass className to override the default header size.
 */
export function LogoMark({
  className,
  priority = false,
  sizes = "280px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span className={cn("relative inline-block h-14 w-[10.5rem] shrink-0", className)}>
      <Image
        src={MARK_SRC}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain object-left brightness-0 invert"
      />
    </span>
  );
}

/** Site logo for header/footer: PNG wordmark only, with a small TM on the A. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group relative inline-flex max-w-[55vw] shrink-0 items-center sm:max-w-none", className)} aria-label="HYDRA home">
      <LogoMark
        priority
        className="h-9 w-[8.25rem] transition-opacity duration-300 group-hover:opacity-90 xs:h-10 sm:h-12 sm:w-[11rem] md:h-14 md:w-[13rem]"
      />
      <span
        className="pointer-events-none absolute right-[5%] top-[6%] select-none font-mono text-[4.5px] font-semibold leading-none tracking-wide text-fg/70 transition-colors group-hover:text-accent sm:right-[6%] sm:top-[8%] sm:text-[5.5px] md:right-[7%] md:top-[9%] md:text-[6.5px]"
        aria-hidden
      >
        TM
      </span>
    </Link>
  );
}
