import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "@/components/ui/social-links";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { TrustBadges } from "@/components/sections/trust-badges";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent-2/10 blur-[140px]" />
      <div className="container-page relative">
        <div className="border-b border-line py-10">
          <TrustBadges compact />
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm text-muted">{siteConfig.description}</p>
            <div>
              <p className="mb-3 text-sm font-medium">Get 10% off your first order</p>
              <NewsletterForm className="max-w-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">{group.title}</p>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted transition-colors hover:text-fg">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 border-t border-line py-8 text-sm text-muted md:grid-cols-3">
          <p className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> {siteConfig.address}</p>
          <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:text-fg md:justify-center">
            <Phone size={14} className="text-accent" /> {siteConfig.phone}
          </a>
          <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-fg md:justify-end">
            <Mail size={14} className="text-accent" /> {siteConfig.email}
          </a>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-subtle md:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
