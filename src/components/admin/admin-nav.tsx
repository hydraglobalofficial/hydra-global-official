"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderTree, Inbox, LayoutDashboard, Package, QrCode, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/catalog", label: "Categories & Devices", icon: FolderTree },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/verifications", label: "Verification", icon: QrCode },
  { href: "/admin/content", label: "Content", icon: FileText },
];

export function AdminNav({ badges }: { badges: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Admin">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        const badge = badges[href];
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active ? "bg-white/[0.06] text-fg" : "text-muted hover:bg-white/[0.03] hover:text-fg",
            )}
          >
            <Icon size={16} className={active ? "text-accent" : undefined} />
            <span className="flex-1">{label}</span>
            {!!badge && <span className="rounded-full bg-accent/15 px-2 font-mono text-[10px] text-accent">{badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
