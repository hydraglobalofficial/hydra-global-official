import type { Metadata } from "next";
import { Eye, QrCode, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/primitives";
import { VerifyForm } from "@/components/forms/verify-form";

export const metadata: Metadata = {
  title: "Verify Your Product",
  description: "Check that your HYDRA screen protector is genuine using the unique code inside your box.",
  alternates: { canonical: "/verify" },
};

const steps = [
  { icon: Eye, title: "Find the label", text: "Look for the holographic seal on the inside flap of your HYDRA box." },
  { icon: QrCode, title: "Scratch or scan", text: "Scratch to reveal the 12-character code, or scan the QR to open this page pre-filled." },
  { icon: ShieldCheck, title: "Get instant results", text: "We confirm authenticity and show how many times the code has been checked." },
];

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const { code } = await searchParams;
  return (
    <>
      <PageHeader eyebrow="Authentication" title={<>Verify your <span className="text-gradient">HYDRA</span>.</>} description="Counterfeit protectors use cheap glass that cracks — and can damage your screen. Confirm yours is the real thing in seconds." />
      <section className="container-page max-w-4xl py-16">
        <VerifyForm defaultCode={typeof code === "string" ? code : undefined} />
        <p className="mt-4 text-center text-xs text-subtle">Try the demo code <span className="font-mono text-muted">HYD-DEMO-0001</span></p>
      </section>
      <section className="container-page grid gap-5 pb-8 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <Icon className="text-accent" />
              <span className="font-mono text-xs text-subtle">0{i + 1}</span>
            </div>
            <h2 className="mt-6 font-medium">{title}</h2>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
