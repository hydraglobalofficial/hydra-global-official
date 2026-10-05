"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Lightbulb,
  Package,
  Play,
  Smartphone,
  X,
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

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function youtubePoster(url: string) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

function InstallVideo({
  url,
  title = "HYDRA installation",
}: {
  url: string;
  title?: string;
}) {
  const yt = youtubeId(url);
  if (yt) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
      controls: "1",
      disablekb: "0",
      fs: "1",
    });
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${yt}?${params.toString()}`}
        className="absolute inset-0 size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (isDirectVideo(url)) {
    return (
      <video controls playsInline autoPlay preload="metadata" className="absolute inset-0 size-full object-cover" src={url}>
        <track kind="captions" />
      </video>
    );
  }
  return null;
}

const ease = [0.22, 1, 0.36, 1] as const;

/** Clean fullscreen-ish player — YouTube never sits bare on the page. */
function VideoLightbox({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal
      aria-label={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35, ease }}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10 hover:text-white"
          >
            <X size={14} /> Close
          </button>
        </div>
        <div className="relative aspect-video bg-black">
          <InstallVideo url={url} title={title} />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/**
 * Step visual = product still only. Video lives in the section below.
 */
function StepStage({
  stepIndex,
  image,
  reduce,
}: {
  stepIndex: number;
  image?: string;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease }}
      className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[#07070a] shadow-[0_40px_100px_-48px_rgba(59,130,246,0.55)] md:aspect-[5/6] lg:min-h-[26rem] lg:aspect-auto"
    >
      <div className="pointer-events-none absolute -left-10 top-1/4 size-48 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-0 size-56 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />

      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width:1024px) 42vw, 90vw"
          className="object-contain p-8 md:p-10"
          priority={stepIndex === 0}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-7xl font-semibold tabular-nums text-white/[0.07]">
            {String(stepIndex + 1).padStart(2, "0")}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-300">
          Step {String(stepIndex + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 backdrop-blur">
          Visual
        </span>
      </div>
    </motion.div>
  );
}

/** Wide cinematic video strip — sits under the step card, never on the image. */
function StepVideoSection({
  stepIndex,
  stepTitle,
  video,
  fallbackVideo,
  reduce,
}: {
  stepIndex: number;
  stepTitle: string;
  video?: string;
  fallbackVideo?: string;
  reduce: boolean | null;
}) {
  const [playing, setPlaying] = useState(false);
  const url = (video?.trim() || fallbackVideo?.trim() || "");
  const hasVideo = Boolean(url);
  const isStepVideo = Boolean(video?.trim());
  const poster = hasVideo ? youtubePoster(url) : "";

  useEffect(() => {
    setPlaying(false);
  }, [stepIndex, url]);

  return (
    <>
      <motion.div
        key={`video-${stepIndex}-${url || "empty"}`}
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#05070e] shadow-[0_36px_90px_-42px_rgba(59,130,246,0.5)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(59,130,246,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative grid items-stretch gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          {hasVideo ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative aspect-video w-full overflow-hidden"
              aria-label={`Watch video for ${stepTitle}`}
            >
              {poster ? (
                <img
                  src={poster}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,#1a2744_0%,#050506_70%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="relative grid size-[4.5rem] place-items-center rounded-full border border-white/30 bg-black/55 text-white shadow-[0_0_70px_-8px_rgba(59,130,246,1)] backdrop-blur-md transition group-hover:scale-105">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 opacity-40" />
                  <Play size={28} className="relative ml-1 fill-current" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-blue-100/90">
                  Watch video
                </span>
              </div>
            </button>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,#152038_0%,#050506_72%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="grid size-[4.5rem] place-items-center rounded-full border border-white/15 bg-white/5 text-zinc-400 backdrop-blur-md">
                  <Play size={28} className="ml-1 fill-current opacity-60" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  Video soon
                </span>
              </div>
            </div>
          )}

          <div className="relative flex flex-col justify-center gap-4 border-t border-white/[0.06] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Step {String(stepIndex + 1).padStart(2, "0")} ·{" "}
              {isStepVideo ? "Video guide" : hasVideo ? "Full walkthrough" : "Video"}
            </p>
            <h3 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">{stepTitle}</h3>
            <p className="text-sm leading-relaxed text-muted">
              {hasVideo
                ? "See this moment in motion — opens cleanly over the page, then you\u2019re back on HYDRA."
                : "A short clip for this step will live here — same clean player, no clutter on the visual above."}
            </p>
            {hasVideo ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
              >
                <Play size={14} className="fill-current" /> Play step video
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>

      {playing && hasVideo ? (
        <VideoLightbox
          url={url}
          title={`Step ${String(stepIndex + 1).padStart(2, "0")} · ${stepTitle}`}
          onClose={() => setPlaying(false)}
        />
      ) : null}
    </>
  );
}

function HeroVideoPlaceholder({ url, reduce }: { url: string; reduce: boolean | null }) {
  const [playing, setPlaying] = useState(false);
  const poster = youtubePoster(url);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setPlaying(true)}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.08 }}
        className="group relative mx-auto mt-12 block w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-black text-left shadow-[0_40px_120px_-40px_rgba(59,130,246,0.45)]"
      >
        <div className="relative aspect-video">
          {poster ? (
            <img src={poster} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#152038_0%,#050506_70%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="grid size-16 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition group-hover:scale-105">
              <Play size={24} className="ml-0.5 fill-current" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-blue-100">Full walkthrough</span>
          </div>
        </div>
      </motion.button>
      {playing ? (
        <VideoLightbox url={url} title="Installation walkthrough" onClose={() => setPlaying(false)} />
      ) : null}
    </>
  );
}

export function InstallExperience({ content }: { content: InstallationContent }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = content.steps[active] ?? content.steps[0];
  const hasHeroVideo = Boolean(content.videoUrl);

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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.04),transparent_40%)]"
      />

      <section className="container-page relative pt-10 pb-12 md:pt-16 md:pb-16">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
            {content.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            {content.title}{" "}
            <span className="bg-gradient-to-r from-blue-200 via-white to-zinc-400 bg-clip-text text-transparent">
              {content.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted md:text-lg">{content.intro}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-blue-100">
              <Smartphone size={13} /> {content.brandsNote}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              <Clock size={13} className="text-accent" /> {content.duration} · {content.steps.length} steps
            </span>
          </div>
        </motion.div>

        {hasHeroVideo ? <HeroVideoPlaceholder url={content.videoUrl} reduce={reduce} /> : null}
      </section>

      <section className="container-page relative pb-20">
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent via-blue-300 to-white/85"
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
                        className="absolute inset-0 rounded-2xl border border-accent/40 bg-accent/[0.11] shadow-[0_0_36px_-12px_var(--color-accent)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="relative z-[1] flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full font-mono text-[11px] transition",
                          on
                            ? "bg-fg text-black"
                            : done
                              ? "bg-success/15 text-success"
                              : "border border-line text-muted",
                        )}
                      >
                        {done && !on ? <CheckCircle2 size={14} /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("hidden text-sm leading-snug lg:line-clamp-2", on ? "text-fg" : "text-muted")}>
                        {s.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.article
                key={active}
                initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease }}
                className="grid items-start gap-8 rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] via-transparent to-accent/[0.04] p-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:p-8"
              >
                <div className="flex min-h-0 flex-col justify-center lg:py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                    Step {String(active + 1).padStart(2, "0")}
                    <span className="mx-2 text-zinc-600">/</span>
                    <span className="text-zinc-500">{String(content.steps.length).padStart(2, "0")}</span>
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">{step.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-pretty text-muted md:text-[1.05rem]">{step.body}</p>
                  {step.tip ? (
                    <p className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/[0.08] p-4 text-sm text-blue-100">
                      <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent" />
                      <span>{step.tip}</span>
                    </p>
                  ) : null}

                  <div className="mt-8 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={active === 0}
                      onClick={() => setActive((i) => Math.max(0, i - 1))}
                      className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg disabled:opacity-30"
                    >
                      Previous
                    </button>
                    {active < content.steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActive((i) => Math.min(content.steps.length - 1, i + 1))}
                        className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-black transition hover:bg-white"
                      >
                        Next step
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-4 py-2 text-sm text-success">
                        <CheckCircle2 size={16} /> Done — enjoy your armor
                      </span>
                    )}
                  </div>
                </div>

                <StepStage stepIndex={active} image={step.image} reduce={reduce} />
              </motion.article>
            </AnimatePresence>

            <StepVideoSection
              stepIndex={active}
              stepTitle={step.title}
              video={step.video}
              fallbackVideo={content.videoUrl}
              reduce={reduce}
            />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 pb-24 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
          <p className="mb-5 flex items-center gap-2 text-sm font-medium">
            <Package size={16} className="text-accent" /> In every HYDRA box
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {content.kit.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-2.5 text-sm text-muted"
              >
                <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
          <p className="mb-5 text-sm font-medium">If something looks off</p>
          <div className="space-y-2">
            {content.troubleshooting.map((t) => (
              <details
                key={t.problem}
                className="group rounded-xl border border-white/[0.06] bg-black/25 open:border-accent/25 open:bg-accent/[0.05]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-fg marker:hidden">
                  {t.problem}
                  <ChevronDown size={16} className="shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="border-t border-white/[0.05] px-4 py-3 text-sm leading-relaxed text-muted">{t.fix}</p>
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
