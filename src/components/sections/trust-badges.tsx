import { BadgeCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { ShippingContent } from "@/content/site-sections";
import { cn, formatPrice } from "@/lib/utils";

export function TrustBadges({
  compact = false,
  shipping,
}: {
  compact?: boolean;
  shipping?: ShippingContent;
}) {
  const delivery =
    shipping?.mode === "paid"
      ? { title: "Delivery", text: `${formatPrice(shipping.amount)} on every order` }
      : { title: "Free delivery", text: `${formatPrice(0)} shipping on every order` };
  const badges = [
    { icon: ShieldCheck, title: "Precision Cut", text: "Device-specific ±0.05 mm fit" },
    { icon: BadgeCheck, title: "100% Genuine", text: "Official HYDRA quality" },
    { icon: Truck, title: delivery.title, text: delivery.text },
    { icon: RefreshCcw, title: "7-Day Returns", text: "No-questions-asked policy" },
  ];

  return (
    <RevealGroup className={cn("grid grid-cols-2 lg:grid-cols-4", compact ? "gap-6" : "gap-3 md:gap-5")} stagger={0.08}>
      {badges.map(({ icon: Icon, title, text }) => {
        const content = (
          <>
            <span className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
              <span className="absolute inset-0 rounded-xl bg-accent/25 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
              <Icon size={20} className="relative" />
            </span>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </div>
          </>
        );
        return (
          <RevealItem key={title} className="h-full">
            {compact ? (
              <div className="flex items-center gap-4">{content}</div>
            ) : (
              <SpotlightCard className="group flex h-full items-center gap-4 rounded-2xl p-5">{content}</SpotlightCard>
            )}
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
