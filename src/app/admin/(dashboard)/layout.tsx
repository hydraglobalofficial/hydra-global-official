import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut, Shield } from "lucide-react";
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

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#04060c] text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_-10%,rgba(30,64,175,0.28),transparent_55%),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(30,64,175,0.12),transparent_50%),radial-gradient(ellipse_50%_30%_at_50%_100%,rgba(30,64,175,0.08),transparent_60%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:grid-cols-[18.5rem_minmax(0,1fr)]">
        <aside className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#04060c]/80 backdrop-blur-2xl lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:border-white/[0.06] lg:bg-black/25">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 lg:mb-2 lg:px-5 lg:pb-2 lg:pt-6">
            <div className="min-w-0">
              <Logo />
              <p className="mt-1.5 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-accent lg:flex">
                <Shield size={10} className="shrink-0" /> Control room
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
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

          <div className="px-3 pb-3 sm:px-4 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-4">
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
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-transparent px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{session.name}</p>
                <p className="text-xs capitalize text-subtle">{session.role.toLowerCase()}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent/[0.07] to-transparent lg:h-56" />
          <div className="relative mx-auto w-full max-w-6xl xl:max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
