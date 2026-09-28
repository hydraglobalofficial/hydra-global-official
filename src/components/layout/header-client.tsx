"use client";

import Link from "next/link";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { primaryNav, supportNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { NavigationData } from "@/server/queries/catalog";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";

export function HeaderClient({ nav }: { nav: NavigationData }) {
  const pathname = usePathname();
  const { count, open, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<"shop" | "support" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close overlays on route change
    setMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const openMenu = (key: "shop" | "support") => {
    clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:px-5" onMouseLeave={scheduleClose}>
      <div
        className={cn(
          "relative mx-auto flex h-14 max-w-[88rem] items-center justify-between gap-6 rounded-2xl border px-3 transition-all duration-500 md:h-16 md:px-6",
          scrolled || menu
            ? "border-line-strong bg-black/75 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
            : "border-line bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md",
        )}
      >
        <div aria-hidden className="divider-glow pointer-events-none absolute inset-x-10 -bottom-px opacity-60" />
        <div className="flex items-center gap-10">
          <button
            type="button"
            className="-ml-2 rounded-full p-2 text-muted hover:text-fg lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Logo />
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => {
              const hasMenu = item.href === "/shop" ? "shop" : item.href === "/support" ? "support" : null;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <div key={item.href} onMouseEnter={() => (hasMenu ? openMenu(hasMenu) : scheduleClose())}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors",
                      active || (hasMenu && menu === hasMenu) ? "text-fg" : "text-muted hover:text-fg",
                    )}
                    aria-expanded={hasMenu ? menu === hasMenu : undefined}
                  >
                    {item.label}
                    {hasMenu && <ChevronDown size={14} className={cn("transition-transform", menu === hasMenu && "rotate-180")} />}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2.5 text-muted hover:bg-white/5 hover:text-fg"
            aria-label="Search"
          >
            <Search size={19} />
          </button>
          <button type="button" onClick={open} className="relative rounded-full p-2.5 text-muted hover:bg-white/5 hover:text-fg" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={19} />
            {hydrated && count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-4.5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold leading-4.5 text-black">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop dropdowns */}
      <div
        className={cn(
          "absolute inset-x-3 top-full mx-auto mt-2 hidden max-w-[88rem] overflow-hidden rounded-2xl border border-line-strong bg-black/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 md:inset-x-5 lg:block",
          menu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
        onMouseEnter={() => clearTimeout(closeTimer.current)}
      >
        {menu === "shop" && <MegaMenu nav={nav} />}
        {menu === "support" && (
          <div className="container-page grid grid-cols-3 gap-3 py-8">
            {supportNav.map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-2xl border border-transparent p-4 hover:border-line hover:bg-white/[0.03]">
                <p className="font-medium group-hover:text-accent">{item.label}</p>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Search overlay */}
      <div
        className={cn(
          "absolute inset-x-3 top-full mx-auto mt-2 max-w-[88rem] overflow-hidden rounded-2xl border border-line-strong bg-black/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 md:inset-x-5",
          searchOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Form action="/search" className="container-page flex items-center gap-4 py-6">
          <Search className="text-accent" size={22} />
          <input
            ref={searchRef}
            name="q"
            type="search"
            placeholder="Search by product or device — e.g. “iPhone 17 Pro privacy”"
            className="h-12 flex-1 bg-transparent text-lg placeholder:text-subtle focus:outline-none"
            aria-label="Search products"
          />
          <button type="button" onClick={() => setSearchOpen(false)} className="rounded-full p-2 text-muted hover:text-fg" aria-label="Close search">
            <X size={18} />
          </button>
        </Form>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} nav={nav} />
    </header>
  );
}

function MobileNav({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavigationData }) {
  return (
    <div className={cn("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-black/70 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <nav
        className={cn(
          "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto border-r border-line bg-surface p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile"
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:text-fg" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">Shop</p>
        <div className="mb-6 grid grid-cols-2 gap-2">
          {[
            { href: "/shop", label: "All Products" },
            { href: "/shop/iphone", label: "iPhone" },
            { href: "/shop/samsung", label: "Samsung" },
            ...nav.categories.slice(0, 3).map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
          ].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-line bg-surface-2 px-3 py-3 text-sm">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {primaryNav.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="py-4 text-lg">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
