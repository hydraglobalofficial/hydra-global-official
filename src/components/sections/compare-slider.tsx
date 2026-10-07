"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { MoveHorizontal } from "lucide-react";

type Props = {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
};

/** Drag or use arrow keys to reveal the "after" layer over the "before" layer. */
export function CompareSlider({ before, after, beforeLabel = "Before", afterLabel = "After" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const update = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full max-w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-line sm:rounded-3xl"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && update(e.clientX)}
    >
      <div className="absolute inset-0">{before}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {after}
      </div>

      <span className="absolute left-2 top-2 max-w-[42%] truncate rounded-full bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted backdrop-blur sm:left-4 sm:top-4 sm:max-w-none sm:px-3 sm:text-[10px] sm:tracking-widest">
        {beforeLabel}
      </span>
      <span className="absolute right-2 top-2 max-w-[42%] truncate rounded-full bg-accent/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-accent backdrop-blur sm:right-4 sm:top-4 sm:max-w-none sm:px-3 sm:text-[10px] sm:tracking-widest">
        {afterLabel}
      </span>

      <div className="absolute inset-y-0 w-px bg-white shadow-[0_0_20px_var(--color-accent)]" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparison position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/70 text-white backdrop-blur"
        >
          <MoveHorizontal size={18} />
        </div>
      </div>
    </div>
  );
}
