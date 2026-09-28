import type { Metadata } from "next";
import { ArrowRight, Cpu, Globe2, ShieldCheck, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/ui/primitives";
import { TrustBadges } from "@/components/sections/trust-badges";

export const metadata: Metadata = {
  title: "About HYDRA",
  description: "The story behind HYDRA — engineered screen protection built in Bangladesh for flagship phones.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Cpu, title: "Engineering first", text: "Every product starts in CAD against real device scans, not generic templates." },
  { icon: ShieldCheck, title: "Radical authenticity", text: "Unique, verifiable codes on every box. If it isn't verifiable, it isn't HYDRA." },
  { icon: Users, title: "Customer obsessed", text: "Local support team, 12-month warranty, and replacements shipped in 24 hours." },
  { icon: Globe2, title: "Global standard", text: "Materials sourced from the same suppliers as the world's top protection brands." },
];

const timeline = [
  { year: "2023", text: "Founded in Dhaka after too many cracked screens and too many fake protectors." },
  { year: "2024", text: "Launched first tempered glass line for iPhone; 10,000 units sold in six months." },
  { year: "2025", text: "Introduced the authenticity verification system and expanded to Samsung Galaxy." },
  { year: "2026", text: "50,000+ customers, privacy armor range and nationwide 24-hour Dhaka delivery." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About HYDRA"
        title={<>Protection shouldn&apos;t be an <span className="text-gradient">afterthought.</span></>}
        description="We started HYDRA because the market was flooded with lookalike glass that cracked on the first drop. So we built the protector we wanted — and made it provably genuine."
      />

      <section className="container-page grid gap-12 py-24 lg:grid-cols-2">
        <div className="space-y-6 text-lg leading-relaxed text-muted">
          <p>
            Your phone is the most expensive thing you carry every day. Yet most people protect it with a ৳150 piece of glass of unknown origin. We thought that was backwards.
          </p>
          <p>
            HYDRA pairs premium materials with precision manufacturing and a transparent anti-counterfeit system — so every customer knows exactly what they&apos;re getting.
          </p>
          <ButtonLink href="/shop" size="lg">Explore products <ArrowRight size={18} /></ButtonLink>
        </div>
        <ol className="relative space-y-8 border-l border-line pl-8">
          {timeline.map((t) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[2.35rem] top-1 size-3 rounded-full border-2 border-black bg-accent shadow-[0_0_12px_var(--color-accent)]" />
              <p className="font-mono text-sm text-accent">{t.year}</p>
              <p className="mt-1 text-muted">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page py-12">
        <SectionHeading align="center" eyebrow="What we stand for" title="Built on four principles." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-3xl p-7">
              <Icon className="text-accent" />
              <h3 className="mt-6 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <TrustBadges />
      </section>
    </>
  );
}
