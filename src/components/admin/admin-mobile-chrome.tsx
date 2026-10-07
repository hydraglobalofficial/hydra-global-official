"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  ExternalLink,
  FileText,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Star,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/catalog", label: "Categories", icon: FolderTree },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/content", label: "Content", icon: FileText },
      { href: "/admin/collections", label: "Collections", icon: LayoutGrid },
      { href: "/admin/about", label: "About", icon: BookOpen },
      { href: "/admin/installation", label: "Installation", icon: Wrench },
      { href: "/admin/team", label: "Team", icon: Users },
    ],
  },
];

const PANEL_BG = "#070a12";
const SCRIM_BG = "rgba(0,0,0,0.78)";

function MobileNavLink({
  href,
  label,
  icon: Icon,
  badge,
  active,
  onNavigate,
}: NavItem & { badge?: number; active: boolean; onNavigate: () => void }) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium tracking-tight transition-colors",
        active
          ? "bg-accent/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(30,64,175,0.32)]"
          : "text-zinc-400 hover:bg-white/[0.045] hover:text-zinc-100",
      )}
    >
      <Icon
        size={17}
        strokeWidth={active ? 2.1 : 1.7}
        className={cn("shrink-0", active ? "text-blue-300" : "text-zinc-500")}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {!!badge && (
        <span
          className={cn(
            "ml-auto grid min-w-[1.35rem] place-items-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums",
            active ? "bg-accent/40 text-blue-50" : "bg-white/[0.08] text-zinc-300",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

/** Compact sticky top bar + portaled slide-over menu for viewports below lg. */
export function AdminMobileChrome({
  brand,
  role,
  badges,
  attention,
  userFooter,
  logoutAction,
}: {
  brand: ReactNode;
  role: string;
  badges: Partial<Record<string, number>>;
  attention: ReactNode;
  userFooter: ReactNode;
  logoutAction: (formData: FormData) => void | Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const close = () => setOpen(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="admin-drawer-scrim absolute inset-0"
              style={{ backgroundColor: SCRIM_BG }}
              aria-label="Close menu"
              onClick={close}
            />
            <aside
              className="admin-drawer-panel absolute inset-y-0 left-0 flex w-[min(312px,88vw)] max-w-full flex-col border-r border-white/10 shadow-2xl shadow-black/60"
              style={{ backgroundColor: PANEL_BG }}
            >
              <div
                className="admin-drawer-panel flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3.5"
                style={{ backgroundColor: PANEL_BG }}
              >
                <div className="min-w-0">
                  <p id={titleId} className="text-sm font-semibold tracking-tight text-white">
                    Admin menu
                  </p>
                  <div className="mt-0.5 text-[11px] text-zinc-400">{attention}</div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.1] text-zinc-300 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              <nav
                className="admin-drawer-panel min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-2.5 py-4"
                style={{ backgroundColor: PANEL_BG }}
                aria-label="Admin"
              >
                {groups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <MobileNavLink
                          key={item.href}
                          {...item}
                          badge={badges[item.href]}
                          active={isActive(item.href)}
                          onNavigate={close}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div
                className="admin-drawer-panel border-t border-white/[0.08] p-3"
                style={{ backgroundColor: PANEL_BG }}
              >
                <Link
                  href="/"
                  target="_blank"
                  prefetch={false}
                  onClick={close}
                  className="mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-zinc-500 transition-colors hover:bg-white/[0.03] hover:text-zinc-200"
                >
                  <ExternalLink size={14} />
                  View store
                </Link>
                {userFooter}
              </div>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#05070e] px-3 py-2.5 sm:px-4">
        {brand}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden rounded-full bg-accent/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-200 ring-1 ring-accent/25 sm:inline-flex">
            {role}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors hover:border-white/15 hover:text-fg"
            aria-label="Open admin menu"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <Menu size={16} />
          </button>
          <form action={logoutAction}>
            <button
              type="submit"
              className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/15 hover:text-fg"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </header>
      {drawer}
    </div>
  );
}
