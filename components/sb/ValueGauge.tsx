"use client";
import { useEffect, useId, useState } from "react";

/** Open-bottom 270° gauge; the arc sweeps in on mount. */
export function ValueGauge({ display, label, progress, size = 78 }: { display: string; label: string; progress: number; size?: number }) {
  const gid = `vg-${useId().replace(/:/g, "")}`;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const r = 38;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75;
  const filled = shown ? arc * Math.min(Math.max(progress, 0), 1) : 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 92 92" className="h-full w-full rotate-[135deg] overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="1" stopColor="var(--success)" />
          </linearGradient>
        </defs>
        <circle cx="46" cy="46" r={r} fill="none" stroke="var(--gauge-track)" strokeWidth="8" strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
        <circle
          cx="46"
          cy="46"
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="8"
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 5px var(--success))",
            transition: "stroke-dasharray 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
        <span className="font-extrabold leading-none tracking-tight text-foreground" style={{ fontSize: Math.round(size * 0.21) }}>
          {display}
        </span>
        <span className="mt-1 font-semibold uppercase tracking-wider text-success" style={{ fontSize: Math.max(10, Math.round(size * 0.115)) }}>
          {label}
        </span>
      </div>
    </div>
  );
}
