"use client";

import Link from "next/link";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Home, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useTypingPlaceholder } from "@/components/search/typing-placeholder";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonStyles } from "@/components/ui/button";
import { primaryNav, supportNav } from "@/config/navigation";
import { useHasMounted } from "@/hooks/use-has-mounted";
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
  const [searchFocused, setSearchFocused] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);
  const typingPlaceholder = useTypingPlaceholder(undefined, searchOpen && !searchFocused);

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

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const openMenu = (key: "shop" | "support") => {
    clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  return (
    <header
      className={cn(
        /* Announcement bar owns safe-area-top; only bump z when drawer open so it covers the marquee */
        "sticky top-0 z-40 px-2 pt-2 sm:px-3 sm:pt-3 md:px-5",
        mobileOpen && "z-[70]",
      )}
      onMouseLeave={scheduleClose}
    >
      <div
        className={cn(
          "relative mx-auto flex h-14 max-w-[88rem] items-center justify-between gap-2 overflow-visible rounded-2xl border border-line bg-bg/95 px-2 backdrop-blur-xl transition-all duration-500 sm:h-[4.25rem] sm:gap-4 sm:px-3 md:h-[4.75rem] md:gap-6 md:px-6",
          (scrolled || menu) && "border-line-strong shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95)] light:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.18)]",
        )}
      >
        <div aria-hidden className="divider-glow pointer-events-none absolute inset-x-6 -bottom-px opacity-60 light:hidden sm:inset-x-10" />
        <div className="flex min-w-0 items-center gap-2 overflow-visible sm:gap-4 md:gap-10">
          <button
            type="button"
            className="touch-target -ml-1 grid place-items-center rounded-full text-muted hover:text-fg lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Logo />
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => {
              const hasMenu = item.href === "/shop" ? "shop" : item.href === "/support" ? "support" : null;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
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

        <div className="flex items-center gap-0.5 sm:gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="touch-target grid place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg light:hover:bg-black/5"
            aria-label="Search"
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            onClick={open}
            className="touch-target relative grid place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg light:hover:bg-black/5"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={19} />
            {hydrated && count > 0 && (
              <span className="absolute right-1 top-1 grid min-w-4.5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold leading-4.5 text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop dropdowns */}
      <div
        className={cn(
          "absolute inset-x-3 top-full mx-auto mt-2 hidden max-w-[88rem] overflow-hidden rounded-2xl border border-line-strong bg-bg/95 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 light:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.2)] md:inset-x-5 lg:block",
          menu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
        onMouseEnter={() => clearTimeout(closeTimer.current)}
      >
        {menu === "shop" && <MegaMenu nav={nav} />}
        {menu === "support" && (
          <div className="container-page grid grid-cols-3 gap-3 py-8">
            {supportNav.map((item) => (
              <Link
                key={`desk-${item.href}`}
                href={item.href}
                className="group rounded-2xl border border-transparent p-4 hover:border-line hover:bg-white/[0.03] light:hover:bg-black/[0.03]"
              >
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
          "absolute inset-x-3 top-full mx-auto mt-2 max-w-[88rem] overflow-hidden rounded-2xl border border-line-strong bg-bg/95 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 light:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.2)] md:inset-x-5",
          searchOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Form action="/search" className="container-page flex items-center gap-2 py-3 sm:gap-4 sm:py-6">
          <Search className="shrink-0 text-accent" size={22} />
          <input
            ref={searchRef}
            name="q"
            type="search"
            required
            minLength={1}
            placeholder={typingPlaceholder}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-11 min-w-0 flex-1 bg-transparent text-base placeholder:text-subtle focus:outline-none sm:h-12 sm:text-lg"
            aria-label="Search products"
          />
          <button type="submit" className={buttonStyles({ size: "sm", className: "touch-target shrink-0 px-3 sm:px-4" })}>
            Search
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="touch-target grid shrink-0 place-items-center rounded-full text-muted hover:text-fg"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </Form>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} nav={nav} />
    </header>
  );
}

function MobileNav({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavigationData }) {
  // Mount-only: avoids SSR/client nav mismatches that regenerate the tree and
  // can wipe fixed widgets (WhatsApp float). Drawer is closed on first paint anyway.
  const mounted = useHasMounted();

  if (!mounted) return null;

  return (
    <div className={cn("fixed inset-0 z-[80] lg:hidden", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        className={cn("absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 light:bg-black/40", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <nav
        className={cn(
          "absolute inset-y-0 left-0 flex w-full max-w-[22rem] flex-col overflow-y-auto overscroll-contain border-r border-line bg-bg px-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-[max(1.5rem,calc(env(safe-area-inset-top,0px)+0.75rem))] shadow-[20px_0_60px_-20px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] light:shadow-[12px_0_40px_-16px_rgba(0,0,0,0.2)] sm:px-6",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile"
      >
        <div className="mb-7 flex items-center justify-between gap-3 sm:mb-8">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="touch-target grid shrink-0 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg light:hover:bg-black/5"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <Link
          href="/"
          onClick={onClose}
          className="mb-6 flex min-h-12 items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 text-base font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-3"
        >
          <Home size={18} className="shrink-0 text-muted" aria-hidden />
          Home
        </Link>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">Shop</p>
        <div className="mb-6 grid grid-cols-2 gap-2">
          {[
            { href: "/shop", label: "All Products" },
            ...nav.brands.map((b) => ({ href: `/shop/${b.slug}`, label: b.shortLabel || b.label })),
            ...nav.categories.slice(0, 3).map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="flex min-h-11 items-center rounded-xl border border-line bg-surface-2 px-3 py-3 text-sm"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {primaryNav
            .filter((item) => item.href !== "/" && item.href !== "/shop")
            .map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose} className="flex min-h-12 items-center py-3.5 text-lg">
                {item.label}
              </Link>
            ))}
        </div>
        <div className="mt-auto space-y-1 border-t border-line pt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">Support</p>
          {supportNav.map((item) => (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              onClick={onClose}
              className="flex min-h-11 items-center rounded-xl px-1 text-sm text-muted hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
