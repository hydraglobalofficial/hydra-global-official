"use client";

import { useActionState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribe } from "@/server/actions/engagement";
import { initialFormState } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(subscribe, initialFormState);

  return (
    <form action={action} className={cn("space-y-3", className)}>
      <div className="flex rounded-full border border-line bg-surface-2 p-1.5 focus-within:border-accent/50">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          className="h-10 flex-1 bg-transparent px-4 text-sm placeholder:text-subtle focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || state.status === "success"}
          className="grid size-10 place-items-center rounded-full bg-fg text-black transition hover:bg-white disabled:opacity-70"
          aria-label="Subscribe"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : state.status === "success" ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
      {state.message && (
        <p className={cn("text-xs", state.status === "success" ? "text-success" : "text-danger")} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
