"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  Package,
  Smartphone,
} from "lucide-react";
import type { InstallationContent } from "@/content/installation";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const embed = u.pathname.match(/\/embed\/([^/]+)/);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Google Drive share / open / preview → file id */
function googleDriveId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host !== "drive.google.com" && host !== "docs.google.com") return null;
    const fromPath = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (fromPath?.[1]) return fromPath[1];
    const id = u.searchParams.get("id");
    return id || null;
  } catch {
    return null;
  }
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

/** Inline player — YouTube, Google Drive, or direct mp4/webm. */
function InlineInstallVideo({ url, title = "HYDRA installation" }: { url: string; title?: string }) {
  const yt = youtubeId(url);
  const drive = googleDriveId(url);

  if (yt) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
      controls: "1",
      fs: "1",
    });
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${yt}?${params.toString()}`}
        className="absolute inset-0 size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  if (drive) {
    return (
      <iframe
        title={title}
        src={`https://drive.google.com/file/d/${drive}/preview`}
        className="absolute inset-0 size-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  if (isDirectVideo(url)) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-contain bg-black"
        src={url}
      >
        <track kind="captions" />
      </video>
    );
  }

  return null;
}

const ease = [0.22, 1, 0.36, 1] as const;

function StepStage({
  stepIndex,
  total,
  image,
  reduce,
  onPrev,
  onNext,
}: {
  stepIndex: number;
  total: number;
  image?: string;
  reduce: boolean | null;
  onPrev: () => void;
  onNext: () => void;
}) {
  const atStart = stepIndex <= 0;
  const atEnd = stepIndex >= total - 1;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease }}
      className="install-media-card relative aspect-video w-full overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-none sm:rounded-[1.6rem]"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width:1024px) 42vw, 92vw"
          className="object-cover object-center"
          priority={stepIndex === 0}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-7xl font-semibold tabular-nums text-fg/10">
            {String(stepIndex + 1).padStart(2, "0")}
          </span>
        </div>
      )}

      <div
        className="absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4"
        role="group"
        aria-label="Step navigation"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={atStart}
          aria-label="Previous step"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white/90 text-fg backdrop-blur-md transition",
            "hover:border-fg/30 hover:bg-white",
            "disabled:cursor-not-allowed disabled:opacity-35",
          )}
        >
          <ChevronLeft size={20} strokeWidth={2.25} />
        </button>

        <p className="rounded-full border border-line bg-white/90 px-3.5 py-2 font-mono text-[11px] tabular-nums tracking-[0.16em] text-fg backdrop-blur-md sm:px-4 sm:text-[12px]">
          {String(stepIndex + 1).padStart(2, "0")}
          <span className="mx-1.5 text-subtle">/</span>
          {String(total).padStart(2, "0")}
        </p>

        <button
          type="button"
          onClick={onNext}
          disabled={atEnd}
          aria-label="Next step"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white/90 text-fg backdrop-blur-md transition",
            "hover:border-fg/30 hover:bg-white",
            "disabled:cursor-not-allowed disabled:opacity-35",
          )}
        >
          <ChevronRight size={20} strokeWidth={2.25} />
        </button>
      </div>
    </motion.div>
  );
}

/** Single walkthrough at the bottom — YouTube / Drive / mp4, plays inline. */
function WalkthroughPlayer({ url, reduce }: { url: string; reduce: boolean | null }) {
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease }}
      className="container-page pb-14 md:pb-16"
      aria-label="Installation walkthrough video"
    >
      <div className="mx-auto w-full max-w-xl sm:max-w-2xl">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-0.5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Watch once</p>
            <h2 className="mt-1 text-base font-semibold tracking-tight sm:text-lg">Full installation walkthrough</h2>
          </div>
          <p className="max-w-[14rem] text-right text-xs leading-relaxed text-muted sm:max-w-xs sm:text-sm">
            Same kit. Same ritual. Play it right here.
          </p>
        </div>

        <div className="install-media-card overflow-hidden rounded-2xl border border-line bg-black shadow-none sm:rounded-[1.25rem]">
          <div className="relative aspect-video w-full bg-black">
            <InlineInstallVideo url={url} title="HYDRA installation walkthrough" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function InstallExperience({ content }: { content: InstallationContent }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = content.steps[active] ?? content.steps[0];
  const walkthroughUrl = content.videoUrl?.trim() || "";

  const progress = useMemo(
    () => ((active + 1) / Math.max(content.steps.length, 1)) * 100,
    [active, content.steps.length],
  );

  useEffect(() => {
    if (reduce) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActive((i) => Math.min(content.steps.length - 1, i + 1));
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [content.steps.length, reduce]);

  return (
    <div className="relative overflow-hidden">
      <section className="container-page relative pt-5 pb-4 md:pt-16 md:pb-16">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-fg md:text-[11px] md:tracking-[0.28em]">
            <span className="size-1.5 rounded-full bg-fg" />
            {content.eyebrow}
          </p>
          <h1 className="mt-2 text-[1.65rem] font-semibold leading-tight tracking-tight text-balance text-fg sm:text-4xl md:mt-5 md:text-6xl">
            {content.title}{" "}
            <span className="text-fg">{content.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-2 hidden max-w-2xl text-pretty text-muted sm:mt-5 sm:block sm:text-base md:text-lg">{content.intro}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:mt-8 md:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-fg md:gap-2 md:px-4 md:py-2 md:text-[11px] md:tracking-[0.16em]">
              <Smartphone size={12} className="shrink-0 text-fg" /> {content.brandsNote}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-fg md:gap-2 md:px-4 md:py-2 md:text-[11px] md:tracking-[0.16em]">
              <Clock size={12} className="shrink-0 text-fg" /> {content.duration} · {content.steps.length} steps
            </span>
          </div>
        </motion.div>
      </section>

      <section className="container-page relative pb-16 md:pb-20">
        <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-line md:mb-8">
          <motion.div
            className="h-full rounded-full bg-fg light:bg-fg"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
          <nav aria-label="Install steps" className="lg:sticky lg:top-28 lg:self-start">
            <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {content.steps.map((s, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <li key={s.title} className="relative shrink-0">
                    {on ? (
                      <motion.span
                        layoutId={reduce ? undefined : "install-step-glow"}
                        className="install-step-active absolute inset-0 rounded-2xl border border-line-strong bg-surface-3 shadow-none"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="relative z-[1] flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full font-mono text-[11px] transition",
                          on
                            ? "bg-fg text-bg"
                            : done
                              ? "bg-success/15 text-success"
                              : "border border-line text-muted",
                        )}
                      >
                        {done && !on ? <CheckCircle2 size={14} /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("hidden text-sm leading-snug lg:line-clamp-2", on ? "text-fg font-medium" : "text-muted")}>
                        {s.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div>
            <AnimatePresence mode="wait">
              <motion.article
                key={active}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease }}
                className="grid items-start gap-3 rounded-[1.25rem] border border-line bg-bg p-3 shadow-none sm:rounded-[1.75rem] md:gap-7 md:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:p-8 light:border-[#C5E0F3] light:bg-[#DCEEF9]"
              >
                <StepStage
                  stepIndex={active}
                  total={content.steps.length}
                  image={step.image}
                  reduce={reduce}
                  onPrev={() => setActive((i) => Math.max(0, i - 1))}
                  onNext={() => setActive((i) => Math.min(content.steps.length - 1, i + 1))}
                />

                <div className="flex min-h-0 flex-col justify-center lg:order-first lg:py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
                    Step {String(active + 1).padStart(2, "0")}
                    <span className="mx-2 text-subtle">/</span>
                    <span className="text-subtle">{String(content.steps.length).padStart(2, "0")}</span>
                  </p>
                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-balance sm:mt-3 sm:text-3xl md:text-4xl">{step.title}</h2>
                  <p className="mt-2 text-[13px] leading-snug text-pretty text-muted sm:mt-4 sm:text-base sm:leading-relaxed md:text-[1.05rem]">{step.body}</p>
                  {step.tip ? (
                    <p className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-surface-3 p-4 text-sm text-fg sm:mt-6">
                      <Lightbulb size={18} className="mt-0.5 shrink-0 text-fg" />
                      <span>{step.tip}</span>
                    </p>
                  ) : null}

                  {active >= content.steps.length - 1 ? (
                    <p className="mt-6 inline-flex items-center gap-2 text-sm text-success sm:mt-8">
                      <CheckCircle2 size={16} /> Done — enjoy your armor
                    </p>
                  ) : null}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {walkthroughUrl ? <WalkthroughPlayer url={walkthroughUrl} reduce={reduce} /> : null}

      <section className="container-page grid gap-6 pb-24 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-line bg-bg p-6 md:p-8 light:border-[#C5E0F3] light:bg-[#DCEEF9]">
          <p className="mb-5 flex items-center gap-2 text-sm font-medium">
            <Package size={16} className="text-accent" /> In every HYDRA box
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {content.kit.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-surface-3/60 px-3 py-2.5 text-sm text-muted"
              >
                <span className="size-1.5 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-line bg-bg p-6 md:p-8 light:border-[#C5E0F3] light:bg-[#DCEEF9]">
          <p className="mb-5 text-sm font-medium">If something looks off</p>
          <div className="space-y-2">
            {content.troubleshooting.map((t) => (
              <details
                key={t.problem}
                className="group rounded-xl border border-line bg-surface-3/40 open:border-accent/25 open:bg-accent/[0.05]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-fg marker:hidden">
                  {t.problem}
                  <ChevronDown size={16} className="shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">{t.fix}</p>
              </details>
            ))}
          </div>
          <ButtonLink href="/support/contact" variant="outline" className="mt-6 w-full">
            Still stuck? Contact support
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
