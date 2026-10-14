"use client";

import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/use-has-mounted";

const DEFAULT_PHRASES = [
  "iPhone 17 Pro privacy",
  "Galaxy S25 Ultra",
  "Camera lens",
  "Matte glass",
  "Privacy Armor",
] as const;

/** Cycles a typewriter-style placeholder when the input is empty and unfocused. */
export function useTypingPlaceholder(phrases: readonly string[] = DEFAULT_PHRASES, active = true) {
  const ready = useHasMounted();
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!ready || !active || phrases.length === 0) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const phrase = phrases[phraseIndex % phrases.length]!;
    let i = 0;
    let deleting = false;

    const tick = () => {
      if (cancelled) return;
      if (!deleting) {
        i += 1;
        setText(phrase.slice(0, i));
        if (i >= phrase.length) {
          deleting = true;
          timer = setTimeout(tick, 1400);
          return;
        }
        timer = setTimeout(tick, 70);
        return;
      }
      i -= 1;
      setText(phrase.slice(0, i));
      if (i <= 0) {
        deleting = false;
        setPhraseIndex((n) => (n + 1) % phrases.length);
        return;
      }
      timer = setTimeout(tick, 28);
    };

    timer = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, phraseIndex, phrases, ready]);

  if (!ready || !active || phrases.length === 0) {
    return "Search products or devices";
  }

  return text ? `Try “${text}”` : "Search products or devices";
}
