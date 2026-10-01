"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ProductImage } from "@/components/product/product-image";

const STORAGE_KEY = "hydra.newsletter.dismissedAt";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const DELAY_MS = 25_000;
const EXCLUDED = ["/cart", "/checkout", "/account", "/login", "/register"];

function snoozed() {
  try {
    const at = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(at) && Date.now() - at < SNOOZE_MS;
  } catch {
    return true;
  }
}

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (excluded || snoozed()) return;
    const show = () => {
      if (!snoozed()) setOpen(true);
    };
    const timer = setTimeout(show, DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [excluded]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && !excluded && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
            className="card-premium relative grid w-full max-w-3xl overflow-hidden rounded-[2rem] md:grid-cols-2"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative hidden min-h-80 overflow-hidden bg-[radial-gradient(circle_at_40%_40%,rgb(30_64_175/0.2),transparent_60%),radial-gradient(circle_at_70%_80%,rgb(255_255_255/0.05),transparent_60%)] md:block">
              <div className="bg-grid absolute inset-0 opacity-80" />
              <motion.div className="absolute inset-8" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <ProductImage src="/products/glass-privacy.svg" alt="" fill sizes="384px" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
              </motion.div>
            </div>
            <div className="relative space-y-5 p-8 md:p-10">
              <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-white/5 hover:text-fg">
                <X size={18} />
              </button>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Members only</p>
              <h2 id="newsletter-popup-title" className="text-3xl font-semibold tracking-tight text-balance">
                Get first access to <span className="text-muted">new drops.</span>
              </h2>
              <p className="text-sm text-muted">Launch alerts for new iPhone and Galaxy models, member-only offers and install tips. No spam — unsubscribe anytime.</p>
              <NewsletterForm />
              <button type="button" onClick={close} className="text-xs text-subtle underline-offset-4 hover:text-muted hover:underline">
                No thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
