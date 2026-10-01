import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/primitives";
import { brands } from "@/config/site";
import { installationGuides } from "@/content/installation";

export const metadata: Metadata = {
  title: "Installation Guides",
  description: "Step-by-step installation guides for HYDRA accessories on iPhone and Samsung Galaxy.",
  alternates: { canonical: "/installation" },
};

export default function InstallationIndexPage() {
  return (
    <>
      <PageHeader eyebrow="Installation" title="Perfect fit, first try." description="Every HYDRA box includes an alignment frame and clean-room kit. Pick your device for a guided walkthrough." />
      <section className="container-page grid gap-5 py-16 md:grid-cols-2">
        {Object.values(installationGuides).map((guide) => (
          <Link key={guide.brand} href={`/installation/${guide.brand}`} className="group border-gradient flex flex-col justify-between gap-10 rounded-3xl p-8 md:p-10">
            <div className="space-y-3">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                <Clock size={12} /> {guide.duration} · {guide.steps.length} steps
              </p>
              <h2 className="text-3xl font-semibold">{brands[guide.brand].label}</h2>
              <p className="text-muted">{guide.intro}</p>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium">
              Start guide <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
