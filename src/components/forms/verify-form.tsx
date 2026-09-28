"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertTriangle, BadgeCheck, Loader2, ScanLine, ShieldAlert, ShieldX } from "lucide-react";
import { verifyProduct, type VerifyState } from "@/server/actions/verify";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { cn, formatDate } from "@/lib/utils";

const initial: VerifyState = { status: "idle" };

export function VerifyForm({ defaultCode }: { defaultCode?: string }) {
  const [state, action, pending] = useActionState(verifyProduct, initial);

  return (
    <div className="space-y-6">
      <form action={action} className="border-gradient relative overflow-hidden rounded-3xl p-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <ScanLine className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={20} />
            <input
              name="code"
              required
              defaultValue={defaultCode}
              autoComplete="off"
              spellCheck={false}
              placeholder="HYD-XXXX-XXXX"
              aria-label="Authenticity code"
              className="h-16 w-full rounded-2xl bg-transparent pl-14 pr-4 font-mono text-lg uppercase tracking-[0.2em] placeholder:tracking-[0.2em] placeholder:text-subtle focus:outline-none"
            />
          </div>
          <Button type="submit" size="lg" className="h-16 rounded-2xl px-10" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" size={18} /> : "Verify"}
          </Button>
        </div>
      </form>

      {state.status === "error" && (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{state.message}</p>
      )}
      {state.status !== "idle" && state.status !== "error" && <VerifyResult state={state} />}
    </div>
  );
}

function VerifyResult({ state }: { state: Exclude<VerifyState, { status: "idle" } | { status: "error" }> }) {
  const config = {
    GENUINE: {
      icon: BadgeCheck,
      tone: "border-success/40 bg-success/[0.07] text-success",
      title: "Genuine HYDRA product",
      body: "This code is authentic and is being verified for the first time. Thank you for choosing HYDRA.",
    },
    ALREADY_VERIFIED: {
      icon: AlertTriangle,
      tone: "border-warning/40 bg-warning/[0.07] text-warning",
      title: "Authentic code — previously verified",
      body: `This code has been checked ${state.verifyCount ?? 0} times, first on ${state.firstVerifiedAt ? formatDate(state.firstVerifiedAt) : "an earlier date"}. If that wasn't you, the product may be a copy — contact support.`,
    },
    VOID: {
      icon: ShieldX,
      tone: "border-danger/40 bg-danger/[0.07] text-danger",
      title: "This code has been deactivated",
      body: "The code was voided by HYDRA (e.g. reported stolen stock or a returned unit). Please contact support before using this product.",
    },
    NOT_FOUND: {
      icon: ShieldAlert,
      tone: "border-danger/40 bg-danger/[0.07] text-danger",
      title: "Code not recognized",
      body: "We couldn't find this code. Double-check each character. If it still fails, the product may be counterfeit.",
    },
  }[state.status];
  const Icon = config.icon;

  return (
    <div className={cn("animate-fade-up rounded-3xl border p-6 md:p-8", config.tone)} role="status">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-current/30 bg-black/40">
          <Icon size={30} />
        </span>
        <div className="flex-1 space-y-2">
          <p className="font-mono text-xs tracking-[0.2em] opacity-80">{state.code}</p>
          <h2 className="text-2xl font-semibold text-fg">{config.title}</h2>
          <p className="text-sm text-muted">{config.body}</p>
        </div>
        {state.product && (
          <Link href={`/product/${state.product.slug}`} className="flex items-center gap-3 rounded-2xl border border-line bg-black/40 p-3 pr-5 text-fg hover:border-line-strong">
            {state.product.image && (
              <span className="relative size-14 overflow-hidden rounded-xl bg-surface-2">
                <ProductImage src={state.product.image} alt={state.product.name} fill sizes="56px" className="object-contain p-1" />
              </span>
            )}
            <span className="max-w-40 text-sm">{state.product.name}</span>
          </Link>
        )}
      </div>
      {(state.status === "NOT_FOUND" || state.status === "VOID" || state.status === "ALREADY_VERIFIED") && (
        <Link href={`/support/contact?topic=authenticity&code=${state.code}`} className="mt-6 inline-block text-sm text-fg underline underline-offset-4">
          Report this product to HYDRA support →
        </Link>
      )}
    </div>
  );
}
