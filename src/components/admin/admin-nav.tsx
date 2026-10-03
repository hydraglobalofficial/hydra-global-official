"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderTree, Inbox, LayoutDashboard, Package, ShoppingCart, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", short: "Home", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", short: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", short: "Products", icon: Package },
  { href: "/admin/catalog", label: "Categories & Devices", short: "Catalog", icon: FolderTree },
  { href: "/admin/reviews", label: "Reviews", short: "Reviews", icon: Star },
  { href: "/admin/inquiries", label: "Inquiries", short: "Inbox", icon: Inbox },
  { href: "/admin/content", label: "Content", short: "Content", icon: FileText },
  { href: "/admin/team", label: "Team", short: "Team", icon: Users },
];

export function AdminNav({ badges }: { badges: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav-scroll flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0" aria-label="Admin">
      {items.map(({ href, label, short, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        const badge = badges[href];
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200 lg:gap-3 lg:px-3.5 lg:py-2.5",
              active
                ? "bg-gradient-to-r from-accent/20 to-accent/[0.06] text-fg shadow-[inset_0_0_0_1px_rgba(30,64,175,0.4),0_0_28px_-10px_rgba(30,64,175,0.65)]"
                : "text-muted hover:bg-white/[0.045] hover:text-fg",
            )}
          >
            {active && (
              <span
                className="absolute inset-y-2 left-0 hidden w-1 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] lg:block"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-xl border transition-colors",
                active
                  ? "border-accent/35 bg-accent/15 text-accent"
                  : "border-transparent bg-white/[0.03] text-subtle group-hover:border-white/10 group-hover:text-muted",
              )}
            >
              <Icon size={15} />
            </span>
            <span className="lg:hidden">{short}</span>
            <span className="hidden flex-1 lg:inline">{label}</span>
            {!!badge && (
              <span className="rounded-full bg-accent/25 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-accent lg:ml-auto lg:px-2">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
