import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut, Radio, Shield } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/layout/logo";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { logout } from "@/server/actions/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · HYDRA Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();
  const [pendingOrders, newInquiries, pendingReviews] = await Promise.all([
    db.order.count({ where: { status: "PENDING" } }),
    db.inquiry.count({ where: { status: "NEW" } }),
    db.review.count({ where: { status: "PENDING" } }),
  ]);

  const badges = {
    "/admin/orders": pendingOrders,
    "/admin/inquiries": newInquiries,
    "/admin/reviews": pendingReviews,
  };

  const attention = pendingOrders + newInquiries + pendingReviews;

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#03050a] text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_0%_-15%,rgba(30,64,175,0.34),transparent_55%),radial-gradient(ellipse_55%_40%_at_100%_0%,rgba(30,64,175,0.16),transparent_50%),radial-gradient(ellipse_50%_35%_at_50%_100%,rgba(30,64,175,0.1),transparent_60%)]" />
      <div className="admin-aurora pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full bg-accent/20 blur-[120px]" />
      <div className="admin-aurora-delay pointer-events-none absolute -right-24 top-40 size-[22rem] rounded-full bg-accent/10 blur-[110px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.28]" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#03050a]/85 backdrop-blur-2xl lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:border-white/[0.06] lg:bg-black/30">
          <div className="relative overflow-hidden px-4 py-3.5 sm:px-5 lg:mb-1 lg:px-5 lg:pb-3 lg:pt-6">
            <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Logo />
                <p className="mt-2 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-accent lg:flex">
                  <Shield size={10} className="shrink-0" /> Control room
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent shadow-[0_0_20px_-8px_rgba(30,64,175,0.8)]">
                  {session.role}
                </span>
                <form action={logout} className="lg:hidden">
                  <button
                    type="submit"
                    className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-white/20 hover:text-fg"
                    aria-label="Sign out"
                  >
                    <LogOut size={15} />
                  </button>
                </form>
              </div>
            </div>

            <div className="relative mt-3 hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 lg:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Systems live
                {attention > 0 ? (
                  <span className="ml-2 text-warning">· {attention} need attention</span>
                ) : (
                  <span className="ml-2 text-success">· clear</span>
                )}
              </p>
            </div>
          </div>

          <div className="px-3 pb-3 sm:px-4 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-4">
            <p className="mb-2 hidden px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-subtle lg:block">Navigate</p>
            <AdminNav badges={badges} />
          </div>

          <div className="mt-auto hidden space-y-3 border-t border-white/[0.06] p-4 lg:block lg:p-5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-muted transition-colors hover:bg-white/[0.03] hover:text-fg"
            >
              <ExternalLink size={14} /> View store
            </Link>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-accent/15 via-white/[0.04] to-transparent px-3 py-3">
              <div className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-accent/25 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{session.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs capitalize text-subtle">
                    <Radio size={10} className="text-accent" />
                    {session.role.toLowerCase()}
                  </p>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-black/30 text-muted transition-colors hover:border-white/20 hover:text-fg"
                    aria-label="Sign out"
                  >
                    <LogOut size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-accent/[0.1] to-transparent lg:h-64" />
          <div className="relative mx-auto w-full max-w-6xl xl:max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
