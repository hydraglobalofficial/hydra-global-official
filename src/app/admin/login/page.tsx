import type { Metadata } from "next";
import { LogoMark } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="glass relative w-full max-w-sm space-y-8 rounded-3xl p-8">
        <div className="space-y-3 text-center">
          <LogoMark className="mx-auto size-10" />
          <h1 className="text-xl font-semibold">HYDRA Admin</h1>
          <p className="text-sm text-muted">Sign in to manage the store.</p>
        </div>
        <LoginForm next={typeof next === "string" ? next : undefined} />
      </div>
    </main>
  );
}
