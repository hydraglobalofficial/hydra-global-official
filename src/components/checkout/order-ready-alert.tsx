"use client";

import { useEffect, useRef } from "react";
import { alertOrderReady } from "@/lib/swal";

/** One-shot SweetAlert on the checkout success page. */
export function OrderReadyAlert({
  orderNumber,
  customerName,
}: {
  orderNumber: string;
  customerName: string;
}) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    const key = `hydra.order-alert.${orderNumber}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
    void alertOrderReady({ orderNumber, name: customerName });
  }, [orderNumber, customerName]);

  return null;
}
