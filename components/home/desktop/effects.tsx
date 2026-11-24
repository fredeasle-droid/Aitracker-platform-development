"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Lets every `.spotlight` card inside `root` follow the pointer with a soft light (positions in %, so canvas zoom doesn't matter). */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".spotlight") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}

/** Tilts its content a few degrees towards the pointer. */
export function Tilt({ children, max = 6, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const { tx } = useLocale();
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div
      className={className}
      style={{ perspective: "900px" }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
    >
      <div
        className="relative transition-transform duration-500 ease-out"
        style={{ transform: `rotateY(${t.x * max}deg) rotateX(${-t.y * max}deg)`, transformStyle: "preserve-3d" }}
      >
        {tx(children)}
      </div>
    </div>
  );
}

/** Smoothly animates a number towards `value` whenever it changes. */
export function useTween(value: number, ms = 600) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const cur = start + (value - start) * (1 - Math.pow(1 - p, 3));
      from.current = cur;
      setV(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return v;
}

/** Eyebrow chip + headline (+ optional text on the right) used above every desktop section. */
export function SectionHeading({
  eyebrow, Icon, title, accent, text, aside, stack = false, className = "",
}: { eyebrow: string; Icon?: LucideIcon; title: ReactNode; accent?: ReactNode; text?: ReactNode; aside?: ReactNode; stack?: boolean; className?: string }) {
  const { tx } = useLocale();
  return (
    <div className={`flex items-end justify-between gap-[24px] ${className}`}>
      <div>
        <span className="eyebrow-chip inline-flex h-[24px] items-center gap-[6px] rounded-full px-[11px] text-[9.5px] font-semibold uppercase tracking-[0.16em]">
          {Icon && <Icon className="h-[12px] w-[12px]" strokeWidth={2.3} />}
          {tx(eyebrow)}
        </span>
        <h2 className="mt-[12px] text-[30px] font-bold leading-[35px]">
          {tx(title)} {stack && <br />}{accent && <span className="text-gradient-brand">{tx(accent)}</span>}
        </h2>
      </div>
      {aside ?? (text && <p className="w-[330px] pb-[4px] text-right text-[11.5px] leading-[17px] text-muted-foreground">{tx(text)}</p>)}
    </div>
  );
}

/** Stagger index for `.reveal-stagger` children. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
