import "server-only";
import type {
  CourierProvider,
  CourierShipmentRequest,
  CourierShipmentResult,
} from "./types";

/**
 * Pathao Merchant Courier API
 * Docs shape: OAuth password grant → Bearer token → /aladdin/api/v1/orders
 *
 * Env:
 *   COURIER_PROVIDER=pathao
 *   PATHAO_CLIENT_ID=
 *   PATHAO_CLIENT_SECRET=
 *   PATHAO_USERNAME=          (merchant panel email)
 *   PATHAO_PASSWORD=
 *   PATHAO_STORE_ID=          (numeric store id from Pathao)
 *   PATHAO_BASE_URL=https://api-hermes.pathao.com
 */

type TokenCache = { accessToken: string; refreshToken?: string; expiresAt: number };

let tokenCache: TokenCache | null = null;
let storeIdCache: number | null = null;

function baseUrl() {
  return (process.env.PATHAO_BASE_URL || "https://api-hermes.pathao.com").replace(/\/$/, "");
}

export function pathaoReady() {
  return Boolean(
    process.env.PATHAO_CLIENT_ID?.trim() &&
      process.env.PATHAO_CLIENT_SECRET?.trim() &&
      process.env.PATHAO_USERNAME?.trim() &&
      process.env.PATHAO_PASSWORD?.trim(),
  );
}

function formatBdPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("01")) return digits;
  if (digits.length === 13 && digits.startsWith("880")) return `0${digits.slice(3)}`;
  if (digits.length === 10 && digits.startsWith("1")) return `0${digits}`;
  return digits.slice(-11);
}

async function issueToken(force = false): Promise<string> {
  if (!force && tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const res = await fetch(`${baseUrl()}/aladdin/api/v1/issue-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.PATHAO_CLIENT_ID!.trim(),
      client_secret: process.env.PATHAO_CLIENT_SECRET!.trim(),
      username: process.env.PATHAO_USERNAME!.trim(),
      password: process.env.PATHAO_PASSWORD!.trim(),
      grant_type: "password",
    }),
  });

  const raw = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    message?: string;
    error?: string;
  };

  if (!res.ok || !raw.access_token) {
    throw new Error(raw.message || raw.error || `Pathao auth failed (HTTP ${res.status})`);
  }

  tokenCache = {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    expiresAt: Date.now() + (Number(raw.expires_in) || 3600) * 1000,
  };
  return tokenCache.accessToken;
}

async function pathaoFetch(path: string, init?: RequestInit, retried = false): Promise<Response> {
  const token = await issueToken();
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401 && !retried) {
    tokenCache = null;
    return pathaoFetch(path, init, true);
  }
  return res;
}

function formatPathaoErrors(
  message: string | undefined,
  errors: Record<string, string[] | string> | undefined,
  fallback: string,
) {
  const parts: string[] = [];
  if (errors && typeof errors === "object") {
    for (const [field, val] of Object.entries(errors)) {
      const text = Array.isArray(val) ? val.filter(Boolean).join(", ") : String(val || "");
      if (text) parts.push(`${field}: ${text}`);
    }
  }
  if (parts.length) return parts.join(" · ");
  return message || fallback;
}

async function resolveStoreId(): Promise<number> {
  if (storeIdCache) return storeIdCache;

  const res = await pathaoFetch("/aladdin/api/v1/stores");
  const raw = (await res.json().catch(() => ({}))) as {
    data?: { data?: Array<{ store_id?: number }>; store_id?: number };
    message?: string;
  };
  if (!res.ok) {
    throw new Error(raw.message || `Pathao stores failed (HTTP ${res.status})`);
  }

  const list = Array.isArray(raw.data?.data) ? raw.data.data : [];
  const ids = list.map((s) => Number(s.store_id)).filter((n) => Number.isFinite(n) && n > 0);
  const fromEnv = Number(process.env.PATHAO_STORE_ID || "");

  // Prefer env only when it belongs to this merchant — wrong IDs return Pathao 422 "Wrong Store selected".
  if (Number.isFinite(fromEnv) && fromEnv > 0 && ids.includes(fromEnv)) {
    storeIdCache = fromEnv;
    return storeIdCache;
  }

  const first = ids[0] ?? Number(raw.data?.store_id);
  if (!Number.isFinite(first) || first <= 0) {
    throw new Error("PATHAO_STORE_ID missing and no store found on Pathao account.");
  }
  if (Number.isFinite(fromEnv) && fromEnv > 0 && fromEnv !== first) {
    console.warn(
      `[pathao] PATHAO_STORE_ID=${fromEnv} is not on this account; using store_id=${first}`,
    );
  }
  storeIdCache = first;
  return storeIdCache;
}

export async function pathaoTrack(consignmentId: string): Promise<{ status: string; raw?: unknown }> {
  const res = await pathaoFetch(`/aladdin/api/v1/orders/${encodeURIComponent(consignmentId)}/info`);
  const raw = (await res.json().catch(() => ({}))) as {
    data?: { order_status?: string; status?: string };
    message?: string;
  };
  if (!res.ok) {
    throw new Error(raw.message || `Pathao track failed (HTTP ${res.status})`);
  }
  const status = raw.data?.order_status || raw.data?.status || "Unknown";
  return { status: String(status), raw };
}

function humanizePathaoCancelError(message: string) {
  if (/contact\s*cx/i.test(message)) {
    return (
      "Pathao will not cancel this consignment via API anymore (rider already assigned / past Pending). " +
      "Cancel it from Pathao Merchant Panel or call Pathao Merchant Support (CX) 09610-003030."
    );
  }
  return message;
}

/** Pathao cancel uses PUT (POST returns Unauthorized on this API). */
export async function pathaoCancel(consignmentId: string) {
  const res = await pathaoFetch(`/aladdin/api/v1/orders/${encodeURIComponent(consignmentId)}/cancel`, {
    method: "PUT",
  });
  const raw = (await res.json().catch(() => ({}))) as {
    message?: string;
    type?: string;
    data?: unknown;
    errors?: Record<string, string[] | string>;
  };
  if (!res.ok || raw.type === "error") {
    const formatted = formatPathaoErrors(raw.message, raw.errors, `Pathao cancel failed (HTTP ${res.status})`);
    return {
      ok: false as const,
      error: humanizePathaoCancelError(formatted),
      raw,
    };
  }
  return { ok: true as const, status: "Cancelled", raw };
}

export const pathaoProvider: CourierProvider = {
  id: "pathao",
  ready: pathaoReady,
  async createShipment(input: CourierShipmentRequest): Promise<CourierShipmentResult> {
    if (!pathaoReady()) {
      return {
        ok: false,
        provider: "pathao",
        invoiceUid: input.invoiceUid,
        error: "PATHAO_CLIENT_ID / SECRET / USERNAME / PASSWORD not set.",
      };
    }

    try {
      const storeId = await resolveStoreId();
      const phone = formatBdPhone(input.phone);
      const weight = Math.min(10, Math.max(0.5, input.weightKg ?? 0.5));

      const body = {
        store_id: storeId,
        merchant_order_id: input.invoiceUid,
        recipient_name: input.customerName.slice(0, 100),
        recipient_phone: phone,
        recipient_address: [input.address, input.area, input.city, input.postalCode]
          .filter(Boolean)
          .join(", ")
          .slice(0, 220),
        delivery_type: 48,
        item_type: 2,
        special_instruction: input.notes || undefined,
        item_quantity: Math.max(1, input.itemCount),
        item_weight: weight,
        item_description: input.itemSummary.slice(0, 250),
        amount_to_collect: Math.max(0, Math.round(Number(input.codAmount) || 0)),
      };

      const res = await pathaoFetch("/aladdin/api/v1/orders", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const raw = (await res.json().catch(() => ({}))) as {
        data?: { consignment_id?: string | number; order_status?: string };
        message?: string;
        type?: string;
        errors?: Record<string, string[] | string>;
      };

      if (!res.ok) {
        return {
          ok: false,
          provider: "pathao",
          invoiceUid: input.invoiceUid,
          raw,
          error: formatPathaoErrors(raw.message, raw.errors, `Pathao HTTP ${res.status}`),
        };
      }

      const consignment = raw.data?.consignment_id;
      return {
        ok: true,
        provider: "pathao",
        invoiceUid: input.invoiceUid,
        consignmentId: consignment != null ? String(consignment) : undefined,
        raw,
      };
    } catch (error) {
      return {
        ok: false,
        provider: "pathao",
        invoiceUid: input.invoiceUid,
        error: error instanceof Error ? error.message : "Pathao request failed.",
      };
    }
  },
  track: pathaoTrack,
  cancel: pathaoCancel,
};

/** Config checklist for admin UI (never exposes secrets). */
export function pathaoConfigStatus() {
  return {
    provider: "pathao" as const,
    clientId: Boolean(process.env.PATHAO_CLIENT_ID?.trim()),
    clientSecret: Boolean(process.env.PATHAO_CLIENT_SECRET?.trim()),
    username: Boolean(process.env.PATHAO_USERNAME?.trim()),
    password: Boolean(process.env.PATHAO_PASSWORD?.trim()),
    storeId: Boolean(process.env.PATHAO_STORE_ID?.trim()),
    baseUrl: baseUrl(),
    ready: pathaoReady(),
  };
}
