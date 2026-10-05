import type { Metadata } from "next";
import { InstallExperience } from "@/components/installation/install-experience";
import { getInstallationContent } from "@/server/queries/content";
import { JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Installation Guide",
  description:
    "One HYDRA install for iPhone and Samsung Galaxy — alignment frame, clean kit, step-by-step with optional video.",
  alternates: { canonical: "/installation" },
};

export default async function InstallationPage() {
  const content = await getInstallationContent();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `${content.title} ${content.titleAccent}`.trim(),
          description: content.intro,
          totalTime: "PT3M",
          tool: content.kit.map((name) => ({ "@type": "HowToTool", name })),
          step: content.steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
            ...(s.image ? { image: s.image } : {}),
          })),
          ...(content.videoUrl
            ? { video: { "@type": "VideoObject", name: "HYDRA installation", contentUrl: content.videoUrl } }
            : {}),
        }}
      />
      <InstallExperience content={content} />
    </>
  );
}
