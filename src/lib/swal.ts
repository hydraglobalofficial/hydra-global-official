"use client";

import type { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from "sweetalert2";

function isLightTheme() {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  return root.classList.contains("light") || root.getAttribute("data-theme") === "light";
}

function themeColors() {
  return isLightTheme()
    ? { background: "#ffffff", color: "#0a0a0c" }
    : { background: "#111114", color: "#f4f4f6" };
}

function themePopupClass(extra = "") {
  const mode = isLightTheme() ? "swal-hydra-light" : "swal-hydra-dark";
  return ["swal-hydra", mode, extra].filter(Boolean).join(" ");
}

/** Force readable text after Swal paints — beats CSS-var / theme races. */
function paintPopupContrast() {
  const popup = document.querySelector<HTMLElement>(".swal2-popup.swal-hydra");
  if (!popup) return;
  const light = isLightTheme();
  const fg = light ? "#0a0a0c" : "#f4f4f6";
  const muted = light ? "#3f3f46" : "#a1a1aa";
  const accent = light ? "#1e3a8a" : "#93c5fd";
  const bg = light ? "#ffffff" : "#111114";

  popup.style.setProperty("background", bg, "important");
  popup.style.setProperty("background-color", bg, "important");
  popup.style.setProperty("color", fg, "important");
  popup.style.setProperty("--swal2-background", bg);
  popup.style.setProperty("--swal2-color", fg);

  const title = popup.querySelector<HTMLElement>(".swal2-title");
  if (title) title.style.setProperty("color", fg, "important");

  popup.querySelectorAll<HTMLElement>(".swal-hydra-lead, .swal-hydra-lead strong").forEach((el) => {
    el.style.setProperty("color", fg, "important");
  });
  popup.querySelectorAll<HTMLElement>(".swal-hydra-sub").forEach((el) => {
    el.style.setProperty("color", muted, "important");
  });
  popup.querySelectorAll<HTMLElement>(".swal-hydra-order").forEach((el) => {
    el.style.setProperty("color", muted, "important");
  });
  popup.querySelectorAll<HTMLElement>(".swal-hydra-order span").forEach((el) => {
    el.style.setProperty("color", accent, "important");
  });
  popup.querySelectorAll<HTMLElement>(".swal2-html-container").forEach((el) => {
    el.style.setProperty("color", muted, "important");
  });

  const confirm = popup.querySelector<HTMLElement>(".swal-hydra-confirm:not(.swal-hydra-confirm-danger)");
  if (confirm) {
    confirm.style.setProperty("background", light ? "#0a0a0c" : "#3b82f6", "important");
    confirm.style.setProperty("color", "#ffffff", "important");
  }

  // Success checkmark: never fill the ring solid (Swal/theme can paint it opaque).
  const ring = popup.querySelector<HTMLElement>(".swal2-success-ring");
  if (ring) {
    ring.style.setProperty("background-color", "transparent", "important");
    ring.style.setProperty("border-color", "rgba(5, 150, 105, 0.35)", "important");
  }
  popup.querySelectorAll<HTMLElement>(".swal2-success-line-tip, .swal2-success-line-long").forEach((el) => {
    el.style.setProperty("background-color", "#059669", "important");
  });
  popup
    .querySelectorAll<HTMLElement>(
      ".swal2-success-circular-line-left, .swal2-success-circular-line-right, .swal2-success-fix-tip",
    )
    .forEach((el) => {
      el.style.setProperty("background-color", bg, "important");
    });
}

function extraPopupClasses(raw?: string) {
  if (!raw) return "";
  return raw
    .split(/\s+/)
    .filter((c) => c && c !== "swal-hydra" && c !== "swal-hydra-light" && c !== "swal-hydra-dark")
    .join(" ");
}

function mergeClass(
  overrides?: SweetAlertOptions["customClass"],
): NonNullable<SweetAlertOptions["customClass"]> {
  const base = {
    popup: themePopupClass(),
    title: "swal-hydra-title",
    htmlContainer: "swal-hydra-text",
    confirmButton: "swal-hydra-confirm",
    cancelButton: "swal-hydra-cancel",
    actions: "swal-hydra-actions",
    icon: "swal-hydra-icon",
  };
  if (!overrides || typeof overrides === "string") return base;
  const popupExtra = extraPopupClasses(
    typeof overrides.popup === "string" ? overrides.popup : undefined,
  );
  return {
    ...base,
    ...overrides,
    popup: themePopupClass(popupExtra),
    title: (overrides.title as string | undefined) ?? base.title,
    htmlContainer: (overrides.htmlContainer as string | undefined) ?? base.htmlContainer,
    confirmButton: (overrides.confirmButton as string | undefined) ?? base.confirmButton,
    cancelButton: (overrides.cancelButton as string | undefined) ?? base.cancelButton,
    actions: (overrides.actions as string | undefined) ?? base.actions,
    icon: (overrides.icon as string | undefined) ?? base.icon,
  };
}

/** Lazy-load SweetAlert2 so product/checkout pages stay light until an alert fires. */
async function getSwal() {
  const [{ default: Swal }] = await Promise.all([
    import("sweetalert2"),
    import("sweetalert2/dist/sweetalert2.min.css"),
  ]);
  return Swal;
}

async function fire(options: SweetAlertOptions = {}): Promise<SweetAlertResult> {
  const Swal = await getSwal();
  const colors = themeColors();
  const light = isLightTheme();
  const { customClass, didOpen, ...rest } = options;
  return Swal.fire({
    buttonsStyling: false,
    confirmButtonText: "Got it",
    reverseButtons: true,
    background: colors.background,
    color: colors.color,
    ...rest,
    // Sync SweetAlert2 v11 built-in theme tokens with site theme (cast — types lag behind)
    ...({ theme: light ? "light" : "dark" } as SweetAlertOptions),
    customClass: mergeClass(customClass),
    didOpen: (el) => {
      paintPopupContrast();
      didOpen?.(el);
    },
  } as SweetAlertOptions);
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
  return fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: {
      popup: "swal-hydra-toast",
    },
  });
}

/** Full-screen loading while an order / action is processing. */
export async function alertLoading(title = "Please wait…", text = "Working on it.") {
  const Swal = await getSwal();
  const colors = themeColors();
  const light = isLightTheme();
  return Swal.fire({
    buttonsStyling: false,
    background: colors.background,
    color: colors.color,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    customClass: mergeClass(),
    ...({ theme: light ? "light" : "dark" } as SweetAlertOptions),
    didOpen: () => {
      paintPopupContrast();
      Swal.showLoading();
    },
  } as SweetAlertOptions);
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
      <p class="swal-hydra-lead" style="color:inherit;opacity:1">আপনার অর্ডার verify হয়ে <strong style="color:inherit">ready</strong> হচ্ছে।</p>
      <p class="swal-hydra-sub" style="color:inherit;opacity:1">Your order is confirmed — our team is verifying it and getting it ready to ship.</p>
      <p class="swal-hydra-order">Order <span>${opts.orderNumber}</span></p>
    `,
    confirmButtonText: "Awesome",
    timer: 9000,
    timerProgressBar: true,
  });
}
/** Admin: order approved / confirmed — clear status for mail + courier. */
export function alertOrderApproved(opts: {
  orderNumber: string;
  mailOk: boolean;
  mailDetail?: string;
  courierDetail?: string;
}) {
  const mailLine = opts.mailOk
    ? `<p class="swal-hydra-lead">Invoice email <strong>sent</strong> to the customer.</p>`
    : `<p class="swal-hydra-lead">Invoice email <strong>not delivered</strong>.</p>
       <p class="swal-hydra-sub">${opts.mailDetail ?? "Open Courier → Test SMTP login, then Resend invoice."}</p>`;
  const courierLine = opts.courierDetail
    ? `<p class="swal-hydra-sub">${opts.courierDetail}</p>`
    : "";
  return fire({
    icon: opts.mailOk ? "success" : "warning",
    title: "Order approved",
    html: `
      ${mailLine}
      ${courierLine}
      <p class="swal-hydra-order">Order <span>${opts.orderNumber}</span></p>
    `,
    confirmButtonText: opts.mailOk ? "Done" : "Fix SMTP & retry",
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
      popup: "swal-hydra-danger",
      confirmButton: "swal-hydra-confirm swal-hydra-confirm-danger",
    },
  });
}
