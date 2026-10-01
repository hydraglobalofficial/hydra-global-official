import type { Metadata } from "next";
import { LogoMark } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.22),_transparent_55%),linear-gradient(180deg,#05070d_0%,#0a0f1a_100%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_0_80px_rgba(30,64,175,0.15)] backdrop-blur-xl">
        <div className="space-y-3 text-center">
          <LogoMark className="mx-auto size-11" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">Command center</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">HYDRA Admin</h1>
          </div>
          <p className="text-sm text-muted">Sign in with username or email.</p>
        </div>
        <LoginForm next={typeof next === "string" ? next : undefined} />
      </div>
    </main>
  );
}
