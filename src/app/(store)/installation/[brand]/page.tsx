import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Lightbulb, Package, Wrench } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/primitives";
import { brands, isBrandSlug } from "@/config/site";
import { installationGuides } from "@/content/installation";
import { JsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(installationGuides).map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: PageProps<"/installation/[brand]">): Promise<Metadata> {
  const { brand } = await params;
  if (!isBrandSlug(brand)) return {};
  return {
    title: `${installationGuides[brand].title} — Step-by-Step`,
    description: installationGuides[brand].intro,
    alternates: { canonical: `/installation/${brand}` },
  };
}

export default async function InstallationGuidePage({ params }: PageProps<"/installation/[brand]">) {
  const { brand } = await params;
  if (!isBrandSlug(brand)) notFound();
  const guide = installationGuides[brand];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: guide.title,
          totalTime: `PT${parseInt(guide.duration)}M`,
          tool: guide.kit.map((name) => ({ "@type": "HowToTool", name })),
          step: guide.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.body })),
        }}
      />
      <PageHeader eyebrow={`Installation · ${brands[brand].label}`} title={guide.title} description={guide.intro}>
        <p className="flex items-center gap-2 font-mono text-xs text-muted">
          <Clock size={14} className="text-accent" /> Approx. {guide.duration}
        </p>
      </PageHeader>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_20rem]">
        <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-[1.4rem] before:top-6 before:w-px before:bg-gradient-to-b before:from-accent before:to-accent-2/0">
          {guide.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-6">
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-accent/40 bg-black font-mono text-sm text-accent shadow-[0_0_20px_-4px_var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="glass flex-1 rounded-2xl p-6">
                <h2 className="text-lg font-medium">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
                {step.tip && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent/5 p-3 text-sm text-accent">
                    <Lightbulb size={16} className="mt-0.5 shrink-0" /> {step.tip}
                  </p>
                )}
              </div>
            </li>
          ))}
          <li className="relative flex gap-6">
            <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 size={20} />
            </span>
            <p className="self-center text-lg font-medium">Done — enjoy your armor.</p>
          </li>
        </ol>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-3xl p-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium"><Package size={16} className="text-accent" /> In the box</p>
            <ul className="space-y-2 text-sm text-muted">
              {guide.kit.map((k) => (
                <li key={k} className="flex items-center gap-2"><span className="size-1 rounded-full bg-accent" /> {k}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium"><Wrench size={16} className="text-accent" /> Troubleshooting</p>
            <div className="space-y-4">
              {guide.troubleshooting.map((t) => (
                <details key={t.problem} className="group">
                  <summary className="cursor-pointer list-none text-sm text-fg marker:hidden group-open:text-accent">{t.problem}</summary>
                  <p className="mt-2 text-sm text-muted">{t.fix}</p>
                </details>
              ))}
            </div>
          </div>
          <ButtonLink href="/support/contact" variant="outline" className="w-full">Still stuck? Contact support</ButtonLink>
        </aside>
      </div>
    </>
  );
}
