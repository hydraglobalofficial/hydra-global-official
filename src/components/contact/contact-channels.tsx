"use client";

import { ArrowUpRight, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { siteConfig } from "@/config/site";

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: `+${siteConfig.whatsapp.replace(/^(\d{3})(\d{4})(\d+)$/, "$1 $2-$3")}`,
    reply: "~15 min",
    href: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi HYDRA! I have a question.")}`,
    tone: "text-accent border-accent/25 bg-accent/10",
    badge: "Fastest",
  },
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.phone,
    reply: "Instant",
    href: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`,
    tone: "text-accent border-accent/25 bg-accent/10",
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    reply: "< 24 hrs",
    href: `mailto:${siteConfig.email}`,
    tone: "text-accent border-accent/25 bg-accent/10",
  },
  {
    icon: Send,
    label: "Messenger",
    value: "@hydraglobal",
    reply: "~1 hr",
    href: siteConfig.messenger,
    tone: "text-accent border-accent/25 bg-accent/10",
  },
];

export function ContactChannels() {
  return (
    <RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.08}>
      {channels.map(({ icon: Icon, label, value, reply, href, tone, badge }) => {
        const external = href.startsWith("http");
        return (
          <RevealItem key={label} className="h-full">
            <SpotlightCard className="group h-full">
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex h-full flex-col gap-6 p-5"
              >
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-xl border ${tone}`}>
                    <Icon size={19} />
                  </span>
                  <div className="flex items-center gap-2">
                    {badge && <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">{badge}</span>}
                    <ArrowUpRight size={16} className="text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="mt-1 truncate font-medium transition-colors group-hover:text-accent">{value}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                    Replies <span className="text-fg/80">{reply}</span>
                  </p>
                </div>
              </a>
            </SpotlightCard>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
