"use client";

import dynamic from "next/dynamic";

export const WhatsappFloat = dynamic(
  () => import("@/components/layout/whatsapp-float").then((m) => m.WhatsappFloat),
  { ssr: false },
);
