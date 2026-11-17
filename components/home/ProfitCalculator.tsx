"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, Calculator, Info, TrendingUp } from "lucide-react";
import { useInView } from "@/lib/use-in-view";
import { useTween } from "./desktop/effects";

/** 30-day return used by the calculator (5.000 kr. -> +1.245 kr.). */
export const PROFIT_RATE = 0.249;
export const calcProfit = (capital: number) => Math.round(capital * PROFIT_RATE);

export const MIN = 1000;
export const MAX = 7000;
const PRESETS = [1000, 2500, 5000, 7000];
const fmt = (n: number) => Math.round(n).toLocaleString("da-DK");

/** Shape of the 30-day growth curve (0 = start, 1 = full profit), from our recent results. */
const CURVE = [0, 0.13, 0.21, 0.31, 0.37, 0.49, 0.62, 0.79, 0.84, 1];
const CW = 440;
const CH = 132;
const PAD = 10;

function chartPoints(capital: number) {
  // Higher capital → higher end point, so the chart reacts to the slider.
  const top = (capital / MAX) * (CH - PAD * 2);
  return CURVE.map((f, i) => [(i / (CURVE.length - 1)) * (CW - PAD * 2) + PAD, CH - PAD - f * top] as const);
}

/** Desktop "Profitberegner": slider + presets on the left, live result and growth chart on the right. */
export function ProfitCalculator() {
  const [cap, setCap] = useState(5000);
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const shown = useTween(cap, 500);
  const shownProfit = shown * PROFIT_RATE;
  const pct = ((cap - MIN) / (MAX - MIN)) * 100;

  const pts = chartPoints(shown);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${CW - PAD} ${CH} L${PAD} ${CH} Z`;
  const end = pts[pts.length - 1]!;

  return (
    <section ref={ref} className="reveal panel calc-panel spotlight relative ml-[28px] mt-[80px] h-[318px] w-[969px] overflow-hidden rounded-[22px]">
      {/* Controls */}
      <div className="absolute left-[34px] top-[32px] w-[390px]">
        <span className="eyebrow-chip inline-flex h-[24px] items-center gap-[6px] rounded-full px-[11px] text-[9.5px] font-semibold uppercase tracking-[0.16em]">
          <Calculator className="h-[12px] w-[12px]" strokeWidth={2.3} /> Profitberegner
        </span>
        <h2 className="mt-[12px] text-[28px] font-bold leading-[33px]">
          Hvad kan din <span className="text-gradient-brand">startkapital</span> blive til?
        </h2>
        <p className="mt-[8px] text-[11.5px] leading-[17px] text-muted-foreground">Se hvordan du kan tjene med vores seneste resultater.</p>

        <div className="mt-[22px] flex items-center justify-between">
          <span className="text-[11.5px] font-medium">Startkapital</span>
          <span className="value-pill flex h-[28px] min-w-[90px] items-center justify-center rounded-[9px] px-[10px] font-display text-[13px] font-semibold tabular-nums">
            {fmt(shown)} kr.
          </span>
        </div>
        <input
          type="range"
          aria-label="Startkapital"
          min={MIN}
          max={MAX}
          step={100}
          value={cap}
          onChange={(e) => setCap(+e.target.value)}
          className="range-glow mt-[14px] w-full"
          style={{ "--pct": `${pct}%` } as CSSProperties}
        />
        <div className="mt-[14px] flex gap-[8px]">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={cap === p}
              onClick={() => setCap(p)}
              className="preset-chip h-[26px] flex-1 rounded-full text-[10.5px] font-semibold tabular-nums"
            >
              {fmt(p)} kr.
            </button>
          ))}
        </div>
      </div>

      {/* Result + chart */}
      <div className="value-pill absolute right-[30px] top-[30px] h-[258px] w-[470px] overflow-hidden rounded-[18px]">
        <div className="absolute left-[20px] top-[18px]">
          <p className="text-[10.5px] text-foreground/70">Forventet profit (30 dage)</p>
          <p className="mt-[2px] flex items-center gap-[10px]">
            <span className="font-display text-[34px] font-bold leading-[40px] tracking-[-0.04em] text-success tabular-nums">+{fmt(shownProfit)} kr.</span>
            <span className="pill-success flex h-[26px] items-center gap-[4px] rounded-[8px] px-[8px] text-[11.5px] font-bold">
              <TrendingUp className="h-[12px] w-[12px]" strokeWidth={2.6} />+{(PROFIT_RATE * 100).toFixed(1)}%
            </span>
          </p>
        </div>
        <div className="absolute right-[20px] top-[18px] text-right">
          <p className="text-[10.5px] text-foreground/70">Efter 30 dage</p>
          <p className="mt-[6px] flex items-center justify-end gap-[6px] font-display text-[16px] font-semibold tabular-nums">
            <span className="text-foreground/60">{fmt(shown)}</span>
            <ArrowRight className="h-[13px] w-[13px] text-primary-glow" />
            <span>{fmt(shown + shownProfit)} kr.</span>
          </p>
        </div>

        <svg className="absolute left-[15px] top-[84px]" width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} aria-hidden="true">
          <defs>
            <linearGradient id="calc-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--primary)" stopOpacity="0.5" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="calc-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--success)" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={PAD} x2={CW - PAD} y1={CH * f} y2={CH * f} stroke="var(--primary-glow)" strokeOpacity="0.1" strokeDasharray="3 5" />
          ))}
          <path d={area} fill="url(#calc-area)" className="transition-opacity duration-1000" style={{ opacity: inView ? 1 : 0 }} />
          <path d={line} pathLength={1} fill="none" stroke="url(#calc-line)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"
            className="chart-draw" style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1 }} />
          {pts.slice(1, -1).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill="var(--background-deep)" stroke="var(--primary-glow)" strokeWidth="1.4"
              className="transition-opacity duration-500" style={{ opacity: inView ? 1 : 0, transitionDelay: `${600 + i * 90}ms` }} />
          ))}
          <circle cx={end[0]} cy={end[1]} r="10" fill="var(--success)" opacity={inView ? 0.18 : 0} className="animate-pulse" />
          <circle cx={end[0]} cy={end[1]} r="4.5" fill="var(--success)" opacity={inView ? 1 : 0} style={{ filter: "drop-shadow(0 0 6px var(--success))" }} />
        </svg>
        <div className="absolute inset-x-[25px] top-[220px] flex justify-between text-[9px] text-muted-foreground">
          {["Dag 1", "Dag 10", "Dag 20", "Dag 30"].map((d) => <span key={d}>{d}</span>)}
        </div>
        <p className="absolute inset-x-[20px] bottom-[10px] flex items-center gap-[5px] text-[8.5px] text-foreground/50">
          <Info className="h-[10px] w-[10px] shrink-0" />
          Bygger på vores seneste resultater – tidligere resultater er ingen garanti for fremtidig profit.
        </p>
      </div>
    </section>
  );
}
