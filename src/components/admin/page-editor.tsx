"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { savePage } from "@/server/actions/admin";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { RichText } from "@/components/content/rich-text";

export function PageEditor({ page }: { page: { slug: string; title: string; summary: string | null; body: string } }) {
  const [state, action, pending] = useActionState(savePage, initialFormState);
  const [body, setBody] = useState(page.body);

  return (
    <form action={action} className="grid gap-8 xl:grid-cols-2">
      <div className="space-y-5">
        <input type="hidden" name="slug" value={page.slug} />
        <Field label="Title" htmlFor="title" error={state.fieldErrors?.title}>
          <Input id="title" name="title" defaultValue={page.title} required />
        </Field>
        <Field label="Summary" htmlFor="summary">
          <Input id="summary" name="summary" defaultValue={page.summary ?? ""} />
        </Field>
        <Field label="Body" htmlFor="body" error={state.fieldErrors?.body} hint="## Heading · ### Subheading · - list item · **bold** · blank line between blocks">
          <Textarea id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[32rem] font-mono text-xs leading-relaxed" />
        </Field>
        <FormMessage status={state.status} message={state.message} toast />
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 size={16} className="animate-spin" />} Publish
        </Button>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Live preview</p>
        <RichText source={body} />
      </div>
    </form>
  );
}
