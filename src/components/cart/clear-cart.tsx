"use client";

import { useEffect } from "react";
import { useCart } from "./cart-provider";

export function ClearCart() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
