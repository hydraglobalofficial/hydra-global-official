"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ShippingContent } from "@/content/site-sections";
import { defaultShippingContent } from "@/content/site-sections";

const ShippingContext = createContext<ShippingContent>(defaultShippingContent);

export function ShippingProvider({ value, children }: { value: ShippingContent; children: ReactNode }) {
  return <ShippingContext.Provider value={value}>{children}</ShippingContext.Provider>;
}

export function useShipping() {
  return useContext(ShippingContext);
}
