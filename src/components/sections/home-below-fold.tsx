"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { SectionDivider } from "@/components/ui/section-divider";
import { Reveal } from "@/components/motion/reveal";
import type { ClarityContent, HowItWorksContent, ImpactContent, ImpactLabContent, NewsletterContent, TechContent } from "@/content/site-sections";

const ImpactStat = dynamic(
  () => import("@/components/sections/impact-stat").then((m) => m.ImpactStat),
);
const DropTest = dynamic(
  () => import("@/components/sections/drop-test").then((m) => m.DropTest),
);
const ClarityCompare = dynamic(
  () => import("@/components/sections/clarity-compare").then((m) => m.ClarityCompare),
);
const Testimonials = dynamic(
  () => import("@/components/sections/testimonials-carousel").then((m) => m.Testimonials),
);
const TechGrid = dynamic(
  () => import("@/components/sections/home-sections").then((m) => m.TechGrid),
);
const HowItWorks = dynamic(
  () => import("@/components/sections/home-sections").then((m) => m.HowItWorks),
);
const NewsletterBlock = dynamic(
  () => import("@/components/sections/home-sections").then((m) => m.NewsletterBlock),
);

/** Below-fold motion / 3D blocks — code-split; bestsellers slot keeps original order. */
export function HomeBelowFold({
  howItWorks,
  tech,
  newsletter,
  clarity,
  impact,
  impactLab,
  bestsellers,
}: {
  howItWorks: HowItWorksContent;
  tech: TechContent;
  newsletter: NewsletterContent;
  clarity?: ClarityContent;
  impact?: ImpactContent;
  impactLab?: ImpactLabContent;
  bestsellers: ReactNode;
}) {
  return (
    <div>
      <ImpactStat images={impact?.images} />
      <DropTest content={impactLab} />
      {bestsellers}
      <SectionDivider />
      <Reveal>
        <ClarityCompare content={clarity} />
      </Reveal>
      <Testimonials />
      <SectionDivider />
      <TechGrid content={tech} />
      <HowItWorks content={howItWorks} />
      <NewsletterBlock content={newsletter} />
    </div>
  );
}
