"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SocialLinks } from "@/components/ui/social-links";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";

/** Premium footer — NEXFEM-inspired giant wordmark (static, responsive). */
export function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-line bg-black sm:mt-24 md:mt-28">
      <div aria-hidden className="divider-glow absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-accent/[0.07] to-transparent sm:h-72" />

      <div className="container-page relative pt-12 md:pt-20">
        <div className="grid gap-10 border-b border-line pb-10 sm:gap-12 sm:pb-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)] lg:gap-24">
          <div className="max-w-md space-y-5 sm:space-y-7">
            <Logo />
            <p className="text-sm leading-relaxed text-muted">{siteConfig.description}</p>
            <div className="space-y-3">
              <p className="text-sm font-medium text-fg">Stay ahead of every drop</p>
              <NewsletterForm />
            </div>
            <SocialLinks />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-10">
            {footerNav.map((group) => (
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
          <p>© {new Date().getFullYear()} All rights reserved</p>
          <p className="tracking-wide">
            A <span className="font-semibold text-accent">HYDRA</span> original · engineered in Dhaka
          </p>
          <Link href="/legal/privacy-policy" className="transition-colors duration-300 hover:text-fg md:text-right">
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="relative select-none overflow-hidden pt-6 md:pt-14" aria-hidden>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(ellipse_120%_55%_at_50%_100%,rgba(56,189,248,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute bottom-[-12%] left-1/2 h-28 w-[70%] max-w-3xl -translate-x-1/2 rounded-[100%] bg-accent/35 blur-[70px] sm:h-40 sm:blur-[90px]" />

        <p className="footer-wordmark relative -mb-[3%] w-full whitespace-nowrap text-center font-black leading-[0.82] tracking-[-0.055em]">
          HYDRA
        </p>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 grid size-10 place-items-center rounded-lg border border-line-strong bg-fg text-bg shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition hover:bg-accent hover:text-bg sm:bottom-5 sm:right-5 sm:size-11"
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} strokeWidth={2.25} />
      </button>
    </footer>
  );
}
