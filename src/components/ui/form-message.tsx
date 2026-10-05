"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { alertError, alertSuccess } from "@/lib/swal";

/** Fires a HYDRA SweetAlert when a server-action form resolves. */
export function FormMessage({
  status,
  message,
  toast = false,
}: {
  status: "idle" | "success" | "error";
  message?: string;
  /** Use a corner toast instead of a modal (good for admin saves). */
  toast?: boolean;
}) {
  const last = useRef<string>("");

  useEffect(() => {
    if (status === "idle" || !message) return;
    const key = `${status}:${message}`;
    if (last.current === key) return;
    last.current = key;

    if (toast) {
      void import("@/lib/swal").then(({ alertToast }) => {
        alertToast(message, status === "success" ? "success" : "error");
      });
      return;
    }

    if (status === "success") void alertSuccess("All set", message);
    else void alertError("Something went wrong", message);
  }, [status, message, toast]);

  if (status === "idle" || !message) return null;

  // Compact inline fallback for a11y / no-JS edge cases.
  return (
    <p
      role="status"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        status === "success" ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger",
      )}
    >
      {message}
    </p>
  );
}
