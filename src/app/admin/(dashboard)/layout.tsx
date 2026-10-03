import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
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
  const initials = session.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#03050a] text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_0%_-15%,rgba(30,64,175,0.34),transparent_55%),radial-gradient(ellipse_55%_40%_at_100%_0%,rgba(30,64,175,0.16),transparent_50%),radial-gradient(ellipse_50%_35%_at_50%_100%,rgba(30,64,175,0.1),transparent_60%)]" />
      <div className="admin-aurora pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full bg-accent/20 blur-[120px]" />
      <div className="admin-aurora-delay pointer-events-none absolute -right-24 top-40 size-[22rem] rounded-full bg-accent/10 blur-[110px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.28]" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col lg:grid lg:grid-cols-[18.5rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070e]/90 backdrop-blur-2xl lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:border-white/[0.05] lg:bg-gradient-to-b lg:from-[#0a1020]/95 lg:via-[#05070e]/90 lg:to-[#05070e]/85">
          {/* Brand */}
          <div className="px-4 py-3.5 sm:px-5 lg:px-5 lg:pb-5 lg:pt-6">
            <div className="flex items-center justify-between gap-3">
              <Logo className="origin-left scale-[0.9]" />
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-200 ring-1 ring-accent/25">
                  {session.role}
                </span>
                <form action={logout} className="lg:hidden">
                  <button
                    type="submit"
                    className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/15 hover:text-fg"
                    aria-label="Sign out"
                  >
                    <LogOut size={15} />
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-4 hidden items-center gap-2 lg:flex">
              <span className="relative flex size-1.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/45" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              <p className="min-w-0 truncate text-[11px] leading-none text-zinc-500">
                {attention > 0 ? (
                  <>
                    Live
                    <span className="mx-1.5 text-zinc-700">·</span>
                    <span className="text-amber-300/85">{attention} need attention</span>
                  </>
                ) : (
                  <>
                    Systems live
                    <span className="mx-1.5 text-zinc-700">·</span>
                    <span className="text-emerald-300/85">all clear</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Nav */}
          <div className="px-3 pb-3 sm:px-4 lg:flex-1 lg:overflow-y-auto lg:px-4 lg:pb-6 lg:pt-1">
            <AdminNav badges={badges} />
          </div>

          {/* Footer */}
          <div className="mt-auto hidden border-t border-white/[0.05] p-4 lg:block lg:px-4 lg:pb-5 lg:pt-4">
            <Link
              href="/"
              target="_blank"
              className="mb-3 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] text-zinc-500 transition-colors hover:bg-white/[0.03] hover:text-zinc-200"
            >
              <ExternalLink size={14} />
              View store
            </Link>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 pl-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/20 font-mono text-[11px] font-semibold tracking-wide text-blue-100">
                {initials || "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-zinc-100">{session.name}</p>
                <p className="truncate text-[11px] capitalize text-zinc-500">{session.role.toLowerCase()}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
                  aria-label="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </form>
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
