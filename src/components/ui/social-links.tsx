import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const icons = {
  facebook: "M14 8h3V4h-3c-2.8 0-4 1.7-4 4.2V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z",
  instagram:
    "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1C5.6 3.2 3.2 5.6 3.1 8.3 3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 2.7 2.5 5.1 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c2.7-.1 5.1-2.5 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-2.7-2.5-5.1-5.2-5.2C14.7 3 14.4 3 12 3Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  tiktok: "M16.5 3c.3 2.2 1.6 3.6 3.9 3.8v3.1a7 7 0 0 1-3.9-1.2v6.1a5.7 5.7 0 1 1-5.7-5.7l.9.1v3.2a2.6 2.6 0 1 0 1.7 2.4V3h3.1Z",
} as const;

type Network = keyof typeof icons;
const labels: Record<Network, string> = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", tiktok: "TikTok" };

export function SocialIcon({ network, size = 16 }: { network: Network; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={icons[network]} />
    </svg>
  );
}

export function SocialLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {(Object.keys(labels) as Network[]).map((network) => (
        <a
          key={network}
          href={siteConfig.social[network]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels[network]}
          className={cn("grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/40 hover:text-fg", itemClassName)}
        >
          <SocialIcon network={network} />
        </a>
      ))}
    </div>
  );
}
