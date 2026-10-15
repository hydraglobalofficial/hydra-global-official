import type { Metadata } from "next";
import { LogoMark } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-12 sm:px-6">
      {/* Soft atmospheric backdrop — never pure black */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(37,99,235,0.18),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(14,165,233,0.12),transparent_45%),linear-gradient(165deg,#e8eef8_0%,#f4f6fa_45%,#eef2f7_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-[26rem]">
        <div className="rounded-[1.75rem] border border-slate-200/90 bg-white p-7 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] sm:p-9">
          <div className="mb-8 space-y-3 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm [&_.theme-mark-invert]:![filter:brightness(0)]">
              <LogoMark className="size-10 rounded-lg bg-transparent sm:size-10 md:size-10" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                Command center
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">HYDRA Admin</h1>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Sign in with your username or email to manage the store.
            </p>
          </div>
          <LoginForm next={typeof next === "string" ? next : undefined} />
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">Protected admin area · HYDRA</p>
      </div>
    </main>
  );
}
