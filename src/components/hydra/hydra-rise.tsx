import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { HydraMark } from "@/components/hydra/hydra-mark";

type HydraRiseProps = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  /** Home uses h2 so the slider keeps the page h1. */
  heading?: "h1" | "h2";
  secondaryHref?: string;
  secondaryLabel?: string;
};

/** Shared black film — About hero and homepage use this the same way. */
export function HydraRise({
  eyebrow,
  title,
  titleAccent,
  description,
  heading = "h2",
  secondaryHref,
  secondaryLabel,
}: HydraRiseProps) {
  const Heading = heading;

  return (
    <section className="hydra-film-block relative overflow-hidden bg-black text-white" aria-label="The HYDRA story">
      <div className="container-page grid items-center gap-6 py-10 sm:gap-8 sm:py-12 md:grid-cols-[0.95fr_1.15fr] md:gap-6 md:py-14 lg:gap-10">
        <div className="min-w-0 space-y-4 sm:space-y-5 md:pr-4 md:space-y-6 [&_h1]:text-white [&_h1_span]:text-white [&_h2]:text-white [&_h2_span]:text-white [&_p]:text-white/75">
          <Eyebrow className="text-white/55">{eyebrow}</Eyebrow>
          <Heading className="text-balance text-[2.35rem] font-semibold tracking-tight sm:text-5xl md:text-7xl lg:text-[5.25rem] lg:leading-[0.95]">
            {title}
            <br />
            <span className="text-white">{titleAccent}</span>
          </Heading>
          <p className="max-w-xl text-base text-pretty leading-relaxed text-white/70 sm:text-lg md:text-xl">{description}</p>
          {secondaryLabel && secondaryHref ? (
            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink
                href="/shop"
                size="lg"
                className="border border-white/40 bg-transparent text-white shadow-none hover:border-white hover:bg-white/10"
              >
                Shop accessories <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href={secondaryHref} size="lg" variant="outline" className="border-white/35 text-white hover:border-white hover:bg-white/10">
                {secondaryLabel} <ArrowRight size={18} />
              </ButtonLink>
            </div>
          ) : (
            <Link
              href="/shop"
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white"
            >
              Shop accessories <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <div className="min-w-0">
          <HydraMark />
        </div>
      </div>
    </section>
  );
}
