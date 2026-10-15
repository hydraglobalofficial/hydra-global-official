"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { clientThrottle, throttleMessage } from "@/lib/client-throttle";
import { alertToast } from "@/lib/swal";

function isCheckoutPath(pathname: string | null) {
  return !!pathname && (pathname === "/checkout" || pathname.startsWith("/checkout/"));
}

export type CartLine = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantName: string | null;
  price: number;
  image: string | null;
  quantity: number;
  maxQuantity: number;
  /** Device slugs this line fits — drives cart upsells for THIS buyer only */
  deviceSlugs?: string[];
  deviceLabel?: string | null;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (
    line: Omit<CartLine, "quantity">,
    quantity?: number,
    options?: { openDrawer?: boolean },
  ) => { ok: boolean };
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  remove: (productId: string, variantId: string | null) => void;
  clear: () => void;
  /** Unique device slugs across cart lines (for suggestions). */
  cartDeviceSlugs: string[];
};

const STORAGE_KEY = "hydra.cart.v2";
const MAX_PER_LINE = 20;
const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (l: CartLine, productId: string, variantId: string | null) =>
  l.productId === productId && l.variantId === variantId;

function migrateLegacyCart(raw: string): CartLine[] {
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((l) => ({
      ...l,
      deviceSlugs: Array.isArray(l.deviceSlugs) ? l.deviceSlugs : [],
      deviceLabel: l.deviceLabel ?? null,
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onCheckout = isCheckoutPath(pathname);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("hydra.cart.v1");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
      if (raw) setLines(migrateLegacyCart(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("hydra.cart.v1");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  // Checkout page IS the checkout UI — never keep the bag drawer open over it.
  useEffect(() => {
    if (onCheckout) setIsOpen(false);
  }, [onCheckout]);

  const add = useCallback<CartContextValue["add"]>(
    (line, quantity = 1, options) => {
      const limited = clientThrottle("cart:add", 3, 60_000);
      if (!limited.ok) {
        void alertToast(throttleMessage(limited.retryAfterMs), "error");
        return { ok: false };
      }

      setLines((prev) => {
        const limit = Math.min(MAX_PER_LINE, line.maxQuantity);
        const existing = prev.find((l) => sameLine(l, line.productId, line.variantId));
        if (existing) {
          return prev.map((l) =>
            l === existing
              ? {
                  ...l,
                  ...line,
                  deviceSlugs: line.deviceSlugs?.length ? line.deviceSlugs : l.deviceSlugs,
                  deviceLabel: line.deviceLabel ?? l.deviceLabel,
                  quantity: Math.min(limit, l.quantity + quantity),
                }
              : l,
          );
        }
        return [
          ...prev,
          {
            ...line,
            deviceSlugs: line.deviceSlugs ?? [],
            quantity: Math.min(limit, quantity),
          },
        ];
      });
      track("add_to_cart", {
        items: [{ id: line.productId, name: line.name, variant: line.variantName, price: line.price, quantity }],
      });
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      if (options?.openDrawer !== false && !isCheckoutPath(path)) setIsOpen(true);
      return { ok: true };
    },
    [],
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>((productId, variantId, quantity) => {
    const limited = clientThrottle("cart:qty", 12, 60_000);
    if (!limited.ok) {
      void alertToast(throttleMessage(limited.retryAfterMs), "error");
      return;
    }
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !sameLine(l, productId, variantId))
        : prev.map((l) =>
            sameLine(l, productId, variantId)
              ? { ...l, quantity: Math.min(quantity, MAX_PER_LINE, l.maxQuantity) }
              : l,
          ),
    );
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((productId, variantId) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, variantId)));
  }, []);

  const open = useCallback(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    if (isCheckoutPath(path)) return;
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const clear = useCallback(() => setLines([]), []);

  const cartDeviceSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const l of lines) {
      for (const s of l.deviceSlugs ?? []) if (s) set.add(s);
    }
    return [...set];
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
      hydrated,
      isOpen,
      open,
      close,
      add,
      setQuantity,
      remove,
      clear,
      cartDeviceSlugs,
    }),
    [lines, hydrated, isOpen, open, close, add, setQuantity, remove, clear, cartDeviceSlugs],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
