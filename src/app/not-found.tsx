import Link from "next/link";
import { LogoMark } from "@/components/layout/logo";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="relative space-y-6">
        <LogoMark className="mx-auto size-12" />
        <p className="font-mono text-fg text-8xl font-semibold tracking-tighter md:text-9xl">404</p>
        <h1 className="text-2xl font-semibold">This page cracked under pressure.</h1>
        <p className="mx-auto max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved. Unlike our glass, it didn&apos;t survive.</p>
        <div className="flex justify-center gap-3">
          <Link href="/" className={buttonStyles()}>Back home</Link>
          <Link href="/shop" className={buttonStyles({ variant: "outline" })}>Shop products</Link>
        </div>
      </div>
    </main>
  );
}
