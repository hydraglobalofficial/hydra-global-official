import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const icons = {
  facebook: "M14 8h3V4h-3c-2.8 0-4 1.7-4 4.2V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z",
  instagram:
    "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm4.5 5.1a4.9 4.9 0 1 0 .01 9.8 4.9 4.9 0 0 0-.01-9.8Zm0 1.9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm5.15-2.45a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  x: "M14.7 10.3 21.4 2.5h-1.6l-5.8 6.8L9.2 2.5H3.5l7 10.2L3.5 21.5h1.6l6.2-7.2 4.9 7.2h5.7l-7.2-10.2Zm-2.2 2.5-.7-1L5.7 3.8h2.4l4.6 6.6.7 1 6 8.6h-2.4l-4.9-7Z",
} as const;

type Network = keyof typeof icons;
const labels: Record<Network, string> = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", x: "X" };

export function SocialIcon({ network, size = 16 }: { network: Network; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d={icons[network]} />
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
