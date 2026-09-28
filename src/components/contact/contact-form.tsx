"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, Check, Handshake, HelpCircle, Loader2, Megaphone, PackageSearch, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { submitInquiry } from "@/server/actions/engagement";
import { TrackEvent } from "@/components/analytics/track-event";
import { Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { initialFormState } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { ContactTopic } from "./topics";

const topics: readonly { id: ContactTopic; label: string; icon: typeof HelpCircle; type: "CONTACT" | "SUPPORT" }[] = [
  { id: "general", label: "General question", icon: HelpCircle, type: "CONTACT" },
  { id: "order", label: "Order support", icon: PackageSearch, type: "SUPPORT" },
  { id: "wholesale", label: "Wholesale / bulk", icon: Building2, type: "CONTACT" },
  { id: "corporate", label: "Corporate orders", icon: Briefcase, type: "CONTACT" },
  { id: "partnership", label: "Partnership", icon: Handshake, type: "CONTACT" },
  { id: "press", label: "Press & media", icon: Megaphone, type: "CONTACT" },
];

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 4000;

export function ContactForm({ defaultTopic = "general" }: { defaultTopic?: ContactTopic }) {
  const [attempt, setAttempt] = useState(0);
  return <ContactFormInner key={attempt} defaultTopic={defaultTopic} onReset={() => setAttempt((n) => n + 1)} />;
}

function ContactFormInner({ defaultTopic, onReset }: { defaultTopic: ContactTopic; onReset: () => void }) {
  const [state, action, pending] = useActionState(submitInquiry, initialFormState);
  const [topic, setTopic] = useState<(typeof topics)[number]>(() => topics.find((t) => t.id === defaultTopic) ?? topics[0]);
  const [values, setValues] = useState({ name: "", email: "", phone: "", orderNumber: "", message: "" });
  const errors = state.fieldErrors ?? {};
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const filled = [values.name.trim().length >= 2, /\S+@\S+\.\S+/.test(values.email), values.message.trim().length >= MESSAGE_MIN].filter(Boolean).length;

  return (
    <div className="card-premium relative overflow-hidden rounded-[2rem]">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-[90px]" />
      <AnimatePresence mode="wait" initial={false}>
        {state.status === "success" ? (
          <motion.div
            key="success"
            className="relative flex min-h-[36rem] flex-col items-center justify-center gap-6 p-10 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <TrackEvent event="generate_lead" payload={{ label: topic.id }} />
            <div className="relative grid size-24 place-items-center">
              {[0, 0.6].map((delay) => (
                <motion.span
                  key={delay}
                  className="absolute inset-0 rounded-full border border-success/50"
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }}
                />
              ))}
              <motion.span
                className="grid size-20 place-items-center rounded-full bg-success/15 text-success"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
              >
                <Check size={36} strokeWidth={2.5} />
              </motion.span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">Message received{values.name ? `, ${values.name.split(" ")[0]}` : ""}.</h3>
              <p className="mx-auto max-w-sm text-sm text-muted">{state.message} We&apos;ll reply to {values.email || "your email"}.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm transition-colors hover:border-accent/50">
                <RotateCcw size={14} /> Send another
              </button>
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white">
                Continue shopping <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={action}
            noValidate
            className="relative space-y-7 p-6 md:p-10"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <input type="hidden" name="type" value={topic.type} />
            <input type="hidden" name="subject" value={topic.label} />

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">Send a message</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">How can we help?</h2>
              </div>
              <div className="flex items-center gap-3" aria-label={`${filled} of 3 required fields complete`}>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={cn("h-1 w-6 rounded-full transition-colors duration-500", i < filled ? "bg-accent" : "bg-white/10")} />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{filled}/3</span>
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-3 block text-xs font-medium uppercase tracking-[0.14em] text-muted">Topic</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => {
                  const active = t.id === topic.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t)}
                      aria-pressed={active}
                      className={cn(
                        "relative isolate inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                        active ? "border-accent/60 text-fg" : "border-line text-muted hover:border-line-strong hover:text-fg",
                      )}
                    >
                      {active && (
                        <motion.span layoutId="topic-pill" className="absolute inset-0 -z-10 rounded-full bg-accent/15" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                      )}
                      <t.icon size={14} className={active ? "text-accent" : ""} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" error={errors.name}>
                <Input id="name" name="name" required autoComplete="name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} placeholder="Your name" />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email}>
                <Input id="email" name="email" type="email" required autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} placeholder="you@example.com" />
              </Field>
              <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" />
              </Field>
              <AnimatePresence initial={false} mode="popLayout">
                {topic.id === "order" ? (
                  <motion.div key="order" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                    <Field label="Order number" htmlFor="orderNumber" error={errors.orderNumber}>
                      <Input id="orderNumber" name="orderNumber" value={values.orderNumber} onChange={set("orderNumber")} className="font-mono uppercase" placeholder="HYD-260928-XXXXXX" />
                    </Field>
                  </motion.div>
                ) : (
                  <motion.div key="company" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="hidden sm:block">
                    <div className="space-y-2">
                      <p className="block text-xs font-medium uppercase tracking-[0.14em] text-muted">Reply via</p>
                      <p className="flex h-12 items-center rounded-xl border border-dashed border-line px-4 text-sm text-subtle">Email · or phone if provided</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Field label="Message" htmlFor="message" error={errors.message}>
              <div className="relative">
                <Textarea
                  id="message"
                  name="message"
                  required
                  maxLength={MESSAGE_MAX}
                  value={values.message}
                  onChange={set("message")}
                  aria-invalid={!!errors.message}
                  placeholder={topic.id === "wholesale" ? "Tell us the models and quantities you're interested in…" : "Tell us a little about what you need…"}
                  className="min-h-40 pb-8"
                />
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] tabular-nums",
                    values.message.trim().length >= MESSAGE_MIN ? "text-subtle" : "text-warning/80",
                  )}
                >
                  {values.message.length}/{MESSAGE_MAX}
                </span>
              </div>
            </Field>

            <FormMessage status={state.status} message={state.message} />

            <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
              <p className="max-w-xs text-xs text-subtle">
                By sending, you agree to our{" "}
                <Link href="/legal/privacy-policy" className="text-muted underline-offset-4 hover:text-fg hover:underline">
                  Privacy Policy
                </Link>
                . We never share your details.
              </p>
              <button
                type="submit"
                disabled={pending}
                className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-fg px-7 text-sm font-medium text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(56,189,248,0.7)] disabled:opacity-70 sm:w-auto"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {pending ? <Loader2 size={16} className="animate-spin" /> : null}
                <span className="relative">{pending ? "Sending…" : "Send message"}</span>
                {!pending && <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
