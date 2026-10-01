"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderTree, Inbox, LayoutDashboard, Package, QrCode, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", short: "Home", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", short: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", short: "Products", icon: Package },
  { href: "/admin/catalog", label: "Categories & Devices", short: "Catalog", icon: FolderTree },
  { href: "/admin/reviews", label: "Reviews", short: "Reviews", icon: Star },
  { href: "/admin/inquiries", label: "Inquiries", short: "Inbox", icon: Inbox },
  { href: "/admin/verifications", label: "Verification", short: "Verify", icon: QrCode },
  { href: "/admin/content", label: "Content", short: "Content", icon: FileText },
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
              "group relative flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200 lg:gap-3 lg:px-3 lg:py-2.5",
              active
                ? "bg-accent/15 text-fg shadow-[inset_0_0_0_1px_rgba(30,64,175,0.35),0_0_24px_-8px_rgba(30,64,175,0.55)]"
                : "text-muted hover:bg-white/[0.04] hover:text-fg",
            )}
          >
            {active && <span className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-accent lg:block" aria-hidden />}
            <Icon size={16} className={cn("shrink-0 transition-colors", active ? "text-accent" : "text-subtle group-hover:text-muted")} />
            <span className="lg:hidden">{short}</span>
            <span className="hidden flex-1 lg:inline">{label}</span>
            {!!badge && (
              <span className="rounded-full bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-accent lg:ml-auto lg:px-2">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
