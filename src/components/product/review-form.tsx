"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/server/actions/engagement";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const [state, action, pending] = useActionState(submitReview, initialFormState);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  if (state.status === "success") return <FormMessage status="success" message={state.message} />;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="space-y-2">
        <span className="block text-xs font-medium uppercase tracking-[0.14em] text-muted">Your rating</span>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
              <Star size={24} strokeWidth={0} fill="currentColor" className={cn("transition-colors", n <= (hover || rating) ? "text-accent" : "text-white/15")} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="authorName" error={state.fieldErrors?.authorName}>
          <Input id="authorName" name="authorName" required maxLength={60} />
        </Field>
        <Field label="Title (optional)" htmlFor="title" error={state.fieldErrors?.title}>
          <Input id="title" name="title" maxLength={100} />
        </Field>
      </div>
      <Field label="Review" htmlFor="comment" error={state.fieldErrors?.comment}>
        <Textarea id="comment" name="comment" required minLength={10} maxLength={2000} placeholder="How's the fit, clarity and feel?" />
      </Field>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
