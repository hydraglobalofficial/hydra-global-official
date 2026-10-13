"use client";

import { useActionState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribe } from "@/server/actions/engagement";
import { TrackEvent } from "@/components/analytics/track-event";
import { initialFormState } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(subscribe, initialFormState);
  const done = state.status === "success";

  return (
    <form action={action} className={cn("space-y-3", className)}>
      {done && <TrackEvent event="sign_up" payload={{ label: "newsletter" }} />}
      <div className="flex min-w-0 rounded-full border border-line bg-surface-2 p-1.5 focus-within:border-accent/50">
        <input
          type="email"
          name="email"
          required
          disabled={pending || done}
          placeholder="you@example.com"
          aria-label="Email address"
          autoComplete="email"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base placeholder:text-subtle focus:outline-none disabled:opacity-70 sm:px-4 sm:text-sm"
        />
        <button
          type="submit"
          disabled={pending || done}
          className="touch-target grid shrink-0 place-items-center rounded-full bg-fg text-bg transition hover:opacity-85 disabled:opacity-70"
          aria-label="Subscribe"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : done ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
      {state.message && (
        <p className={cn("text-xs", done ? "text-success" : "text-danger")} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
