import { BadgeCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn, formatPrice } from "@/lib/utils";

const badges = [
  { icon: ShieldCheck, title: "12-Month Warranty", text: "Free replacement for defects" },
  { icon: BadgeCheck, title: "Verified Authentic", text: "Unique code on every box" },
  { icon: Truck, title: "Free Delivery", text: `On orders over ${formatPrice(siteConfig.freeShippingThreshold)}` },
  { icon: RefreshCcw, title: "7-Day Returns", text: "No-questions-asked policy" },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4", compact ? "gap-6" : "gap-3 md:gap-5")}>
      {badges.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className={cn("flex items-center gap-4", !compact && "glass rounded-2xl p-5 transition-colors hover:border-accent/30")}
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
