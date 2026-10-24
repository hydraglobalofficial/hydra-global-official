"use client";

import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SocialLinks } from "@/components/ui/social-links";
import { footerNav, type NavLink } from "@/config/navigation";
import type { SocialContent } from "@/content/site-sections";
import { siteConfig, type BrandRecord } from "@/config/site";
import { Logo } from "./logo";

function shopFooterLinks(brands: BrandRecord[]): NavLink[] {
  return [
    { label: "All Products", href: "/shop" },
    ...brands.map((b) => ({ label: b.shortLabel || b.label, href: `/shop/${b.slug}` })),
    { label: "Search", href: "/search" },
  ];
}

/** Premium footer — original HYDRA wordmark (not CSS text). */
export function SiteFooter({ brands = [], social }: { brands?: BrandRecord[]; social?: SocialContent }) {
  const groups = footerNav.map((group) =>
    group.title === "Shop" ? { ...group, links: shopFooterLinks(brands) } : group,
  );
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] sm:mt-24 md:mt-28">
      <div aria-hidden className="divider-glow absolute inset-x-0 top-0 light:hidden" />
      <div className="footer-wash pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#1e3a8a]/20 to-transparent light:hidden sm:h-72" />

      <div className="container-page relative pt-12 md:pt-20">
        <div className="grid gap-10 border-b border-line pb-10 sm:gap-12 sm:pb-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)] lg:gap-24">
          <div className="max-w-md space-y-5 sm:space-y-7">
            <Logo />
            <p className="text-sm leading-relaxed text-muted">{siteConfig.description}</p>
            <p className="text-sm text-muted">{siteConfig.address}</p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{siteConfig.slogan}</p>
            <div className="space-y-3">
              <p className="text-sm font-medium text-fg">Stay ahead of every drop</p>
              <NewsletterForm />
            </div>
            <SocialLinks links={social} />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-10">
            {groups.map((group) => (
              <div key={group.title} className="min-w-0">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-subtle sm:mb-5 sm:text-[11px] sm:tracking-[0.22em]">
                  {group.title}
                </p>
                <ul className="space-y-2.5 sm:space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted transition-colors duration-300 hover:text-fg">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 text-center text-[12px] text-muted sm:gap-4 sm:py-7 sm:text-[13px] md:flex-row md:items-center md:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved</p>
          <p className="tracking-wide uppercase text-[11px] text-zinc-500">{siteConfig.slogan}</p>
          <Link href="/legal/privacy-policy" className="transition-colors duration-300 hover:text-fg md:text-right">
            Privacy Policy
          </Link>
        </div>

        <div className="flex justify-center pb-8 md:pb-10">
          <a
            href="https://www.neoncode.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-zinc-500 transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-fg sm:text-[12px]"
          >
            <span className="text-zinc-600 transition-colors duration-300 group-hover:text-zinc-400">
              Developed by
            </span>
            <span className="font-semibold tracking-[0.2em] text-fg transition-colors duration-300 group-hover:text-accent">
              neoncode
            </span>
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-accent/70 transition-transform duration-300 group-hover:scale-125"
            />
          </a>
        </div>
      </div>

      <div className="relative select-none overflow-hidden bg-bg px-4 pb-2 pt-8 md:pt-12" aria-hidden>
        <div className="footer-wash pointer-events-none absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(ellipse_120%_55%_at_50%_100%,rgba(30,58,138,0.35),transparent_55%)] light:hidden" />
        <div className="relative mx-auto h-[clamp(4.5rem,18vw,14rem)] w-full max-w-5xl">
          <Image
            src="/products/Hydra.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 1100px, 100vw"
            quality={95}
            className="theme-mark-invert object-contain object-bottom opacity-95"
            priority={false}
          />
        </div>
      </div>

    </footer>
  );
}
