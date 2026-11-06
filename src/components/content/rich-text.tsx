import Link from "next/link";
import { Fragment, type ReactNode } from "react";

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("mailto:")) return href;
  try {
    const url = new URL(href);
    if (url.protocol === "https:" && (url.hostname === "hydraglobalofficial.com" || url.hostname === "www.hydraglobalofficial.com")) {
      return href;
    }
  } catch {
    return null;
  }
  return null;
}

/** Minimal, safe markdown subset: ##/### headings, lists, **bold**, and internal links. */
function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-fg">{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      if (href) {
        return (
          <Link key={i} href={href} className="text-fg underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
            {link[1]}
          </Link>
        );
      }
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function RichText({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);
  return (
    <div className="space-y-5 leading-relaxed text-muted">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("### ")) return <h3 key={i} className="pt-2 text-lg font-medium text-fg">{inline(block.slice(4))}</h3>;
        if (block.startsWith("## ")) return <h2 key={i} className="pt-6 text-2xl font-semibold tracking-tight text-fg">{inline(block.slice(3))}</h2>;
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{inline(l.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-0.5 w-5 shrink-0 font-mono text-xs text-accent">{j + 1}.</span>
                  <span>{inline(l.replace(/^\d+\.\s+/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}
