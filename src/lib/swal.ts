"use client";

import type { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from "sweetalert2";

const base: SweetAlertOptions = {
  customClass: {
    popup: "swal-hydra",
    title: "swal-hydra-title",
    htmlContainer: "swal-hydra-text",
    confirmButton: "swal-hydra-confirm",
    cancelButton: "swal-hydra-cancel",
    actions: "swal-hydra-actions",
    icon: "swal-hydra-icon",
  },
  buttonsStyling: false,
  // Avoid CSS-var inheritance bugs inside the Swal portal — theme CSS owns colors.
  background: undefined,
  color: undefined,
  confirmButtonText: "Got it",
  reverseButtons: true,
};

/** Lazy-load SweetAlert2 so product/checkout pages stay light until an alert fires. */
async function getSwal() {
  const [{ default: Swal }] = await Promise.all([
    import("sweetalert2"),
    import("sweetalert2/dist/sweetalert2.min.css"),
  ]);
  return Swal;
}

async function fire(options: SweetAlertOptions): Promise<SweetAlertResult> {
  const Swal = await getSwal();
  return Swal.fire({ ...base, ...options } as SweetAlertOptions);
}

export function alertSuccess(title: string, text?: string, opts?: SweetAlertOptions) {
  return fire({
    icon: "success" as SweetAlertIcon,
    title,
    text,
    confirmButtonText: "Perfect",
    ...opts,
  });
}

export function alertError(title: string, text?: string, opts?: SweetAlertOptions) {
  return fire({
    icon: "error" as SweetAlertIcon,
    title,
    text,
    confirmButtonText: "Try again",
    ...opts,
  });
}

export function alertInfo(title: string, text?: string, opts?: SweetAlertOptions) {
  return fire({
    icon: "info" as SweetAlertIcon,
    title,
    text,
    ...opts,
  });
}

export async function alertToast(title: string, icon: SweetAlertIcon = "success") {
  const Swal = await getSwal();
  return Swal.fire({
    ...base,
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: {
      ...base.customClass,
      popup: "swal-hydra swal-hydra-toast",
    },
  });
}

/** Full-screen loading while an order / action is processing. */
export async function alertLoading(title = "Please wait…", text = "Working on it.") {
  const Swal = await getSwal();
  return Swal.fire({
    ...base,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export async function alertClose() {
  const Swal = await getSwal();
  Swal.close();
}

/** Checkout success — order verified & being prepared. */
export function alertOrderReady(opts: { name?: string; orderNumber: string }) {
  const who = opts.name?.trim() ? opts.name.trim().split(/\s+/)[0] : "there";
  return fire({
    icon: "success",
    title: `Thank you, ${who}!`,
    html: `
      <p class="swal-hydra-lead">আপনার অর্ডার verify হয়ে <strong>ready</strong> হচ্ছে।</p>
      <p class="swal-hydra-sub">Your order is confirmed — our team is verifying it and getting it ready to ship.</p>
      <p class="swal-hydra-order">Order <span>${opts.orderNumber}</span></p>
    `,
    confirmButtonText: "Awesome",
    timer: 9000,
    timerProgressBar: true,
  });
}

/** Map form action status → themed SweetAlert. */
export function alertFromFormStatus(status: "idle" | "success" | "error", message?: string) {
  if (status === "idle" || !message) return;
  if (status === "success") return alertSuccess("Done", message);
  return alertError("Something went wrong", message);
}

/** Beautiful danger confirm for admin delete / remove actions. */
export async function confirmDelete(opts: {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<SweetAlertResult> {
  return fire({
    icon: "warning",
    title: opts.title,
    text: opts.text ?? "This cannot be undone.",
    showCancelButton: true,
    focusCancel: true,
    confirmButtonText: opts.confirmText ?? "Yes, delete",
    cancelButtonText: opts.cancelText ?? "Keep it",
    customClass: {
      ...base.customClass,
      popup: "swal-hydra swal-hydra-danger",
      confirmButton: "swal-hydra-confirm swal-hydra-confirm-danger",
    },
  });
}
