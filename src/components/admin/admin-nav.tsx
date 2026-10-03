"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  Inbox,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
};

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Overview", short: "Home", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Orders", short: "Orders", icon: ShoppingCart },
      { href: "/admin/inquiries", label: "Inquiries", short: "Inbox", icon: Inbox },
      { href: "/admin/reviews", label: "Reviews", short: "Reviews", icon: Star },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", short: "Products", icon: Package },
      { href: "/admin/catalog", label: "Categories", short: "Catalog", icon: FolderTree },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/content", label: "Content", short: "Content", icon: FileText },
      { href: "/admin/team", label: "Team", short: "Team", icon: Users },
    ],
  },
];

function NavLink({
  href,
  label,
  short,
  icon: Icon,
  badge,
}: NavItem & { badge?: number }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex shrink-0 items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium tracking-tight transition-colors duration-150",
        "lg:gap-3.5 lg:rounded-xl lg:px-3.5 lg:py-3",
        active
          ? "bg-accent/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(30,64,175,0.32)]"
          : "text-zinc-400 hover:bg-white/[0.045] hover:text-zinc-100",
      )}
    >
      {active && (
        <span
          className="absolute inset-y-2 left-0 hidden w-[3px] rounded-full bg-accent shadow-[0_0_10px_rgba(30,64,175,0.7)] lg:block"
          aria-hidden
        />
      )}
      <Icon
        size={17}
        strokeWidth={active ? 2.1 : 1.7}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-blue-300" : "text-zinc-500 group-hover:text-zinc-300",
        )}
      />
      <span className="lg:hidden">{short}</span>
      <span className="hidden min-w-0 flex-1 truncate lg:inline">{label}</span>
      {!!badge && (
        <span
          className={cn(
            "ml-auto grid min-w-[1.35rem] place-items-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums",
            active
              ? "bg-accent/40 text-blue-50"
              : "bg-white/[0.08] text-zinc-300",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export function AdminNav({ badges }: { badges: Partial<Record<string, number>> }) {
  const flat = groups.flatMap((g) => g.items);

  return (
    <>
      {/* Mobile / tablet: horizontal chips */}
      <nav
        className="admin-nav-scroll flex gap-2 overflow-x-auto pb-1 lg:hidden"
        aria-label="Admin"
      >
        {flat.map((item) => (
          <NavLink key={item.href} {...item} badge={badges[item.href]} />
        ))}
      </nav>

      {/* Desktop: grouped list */}
      <nav className="hidden space-y-8 lg:block" aria-label="Admin">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-3 px-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              {group.label}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => (
                <NavLink key={item.href} {...item} badge={badges[item.href]} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
