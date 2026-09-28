"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number, options?: { openDrawer?: boolean }) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  remove: (productId: string, variantId: string | null) => void;
  clear: () => void;
};

const STORAGE_KEY = "hydra.cart.v1";
const MAX_PER_LINE = 20;
const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (l: CartLine, productId: string, variantId: string | null) =>
  l.productId === productId && l.variantId === variantId;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
      if (raw) setLines(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback<CartContextValue["add"]>((line, quantity = 1, options) => {
    setLines((prev) => {
      const limit = Math.min(MAX_PER_LINE, line.maxQuantity);
      const existing = prev.find((l) => sameLine(l, line.productId, line.variantId));
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, ...line, quantity: Math.min(limit, l.quantity + quantity) } : l,
        );
      }
      return [...prev, { ...line, quantity: Math.min(limit, quantity) }];
    });
    if (options?.openDrawer !== false) setIsOpen(true);
  }, []);

  const setQuantity = useCallback<CartContextValue["setQuantity"]>((productId, variantId, quantity) => {
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

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const clear = useCallback(() => setLines([]), []);

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
    }),
    [lines, hydrated, isOpen, open, close, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
