"use client";

import { createContext, useContext, type ReactNode } from "react";
import { bindMoneyFormat, type MoneyFormat } from "@/lib/money";

const MoneyContext = createContext<MoneyFormat | null>(null);

/** Publishes admin-chosen currency format to client trees (cart, shop, etc.). */
export function MoneyProvider({ format, children }: { format: MoneyFormat; children: ReactNode }) {
  // Sync module binding during render so formatPrice() works without a hook.
  bindMoneyFormat(format);
  return <MoneyContext.Provider value={format}>{children}</MoneyContext.Provider>;
}

export function useMoneyFormat(): MoneyFormat {
  const ctx = useContext(MoneyContext);
  if (!ctx) {
    throw new Error("useMoneyFormat must be used within MoneyProvider");
  }
  return ctx;
}
