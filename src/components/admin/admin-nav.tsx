"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  Package,
  ShoppingCart,
  Star,
  Users,
  Wrench,
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

function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  active,
}: NavItem & { badge?: number; active: boolean }) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "group relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium tracking-tight transition-colors duration-100",
        active
          ? "bg-accent/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(30,64,175,0.32)]"
          : "text-zinc-400 hover:bg-white/[0.045] hover:text-zinc-100",
      )}
    >
      {active && (
        <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent" aria-hidden />
      )}
      <Icon
        size={17}
        strokeWidth={active ? 2.1 : 1.7}
        className={cn("shrink-0", active ? "text-blue-300" : "text-zinc-500 group-hover:text-zinc-300")}
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

/** Desktop sidebar nav (lg+). */
export function AdminNav({ badges }: { badges: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <nav className="space-y-6" aria-label="Admin">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink key={item.href} {...item} badge={badges[item.href]} active={isActive(item.href)} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
