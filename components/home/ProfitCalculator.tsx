"use client";

import { useLocale } from "@/components/locale-provider";
import { useState, type CSSProperties } from "react";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { useInView } from "@/lib/use-in-view";
import { useTween } from "./desktop/effects";

/** Profit model: 12.64% of starting capital until the bank reaches 10,000 kr., then 1,000 kr. per weekday. */
export const PROFIT_RATE = 0.1264;
export const BANK_CAP = 10_000;
export const CALCULATOR_DAYS = 30;
export const calcEndingBank = (capital: number, days = CALCULATOR_DAYS) => {
  let bank = capital;
  const dailyStartCapitalProfit = capital * PROFIT_RATE;
  for (let day = 0; day < days; day += 1) {
    bank += bank < BANK_CAP ? Math.min(dailyStartCapitalProfit, BANK_CAP - bank) : BANK_CAP * 0.1;
  }
  return bank;
};
export const calcProfit = (capital: number) => Math.round(calcEndingBank(capital) - capital);

export const MIN = 1000;
export const MAX = 7000;
const PRESETS = [1000, 2500, 5000, 7000];
const fmt = (n: number) => Math.round(n).toLocaleString("da-DK");

const CW = 440;
const CH = 132;
const PAD = 10;

function chartPoints(capital: number) {
  const finalBank = calcEndingBank(capital);
  return Array.from({ length: 10 }, (_, i) => {
    const day = Math.round((i / 9) * CALCULATOR_DAYS);
    const bank = calcEndingBank(capital, day);
    const progress = finalBank === capital ? 0 : (bank - capital) / (finalBank - capital);
    return [(i / 9) * (CW - PAD * 2) + PAD, CH - PAD - progress * (CH - PAD * 2)] as const;
  });
}

/** Desktop "Profitberegner": slider + presets on the left, live result and growth chart on the right. */
export function ProfitCalculator() {
  const { tx } = useLocale();
  const [cap, setCap] = useState(5000);
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const shown = useTween(cap, 500);
  const shownProfit = calcProfit(shown);
  const endingBank = shown + shownProfit;
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
          <Calculator className="h-[12px] w-[12px]" strokeWidth={2.3} /> {" "}{tx("Profitberegner")}</span>
        <h2 className="mt-[12px] text-[28px] font-bold leading-[33px]">
          {tx("Hvad kan din")}{" "}<span className="text-gradient-brand">{tx("startkapital")}</span> {" "}{tx("blive til?")}</h2>
        <p className="mt-[8px] text-[11.5px] leading-[17px] text-muted-foreground">{tx("12,64% af startkapitalen lægges til pr. hverdag, indtil banken når 10.000 kr. Derefter lægges 1.000 kr. til pr. hverdag.")}</p>

        <div className="mt-[22px] flex items-center justify-between">
          <span className="text-[11.5px] font-medium">{tx("Startkapital")}</span>
          <span className="value-pill flex h-[28px] min-w-[90px] items-center justify-center rounded-[9px] px-[10px] font-display text-[13px] font-semibold tabular-nums">
            {fmt(shown)} {" "}{tx("kr.")}</span>
        </div>
        <input
          type="range"
          aria-label={tx("Startkapital")}
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
              {fmt(p)} {" "}{tx("kr.")}</button>
          ))}
        </div>
      </div>

      {/* Result + chart */}
      <div className="value-pill absolute right-[30px] top-[30px] h-[258px] w-[470px] overflow-hidden rounded-[18px]">
        <div className="absolute left-[20px] top-[18px]">
          <p className="text-[10.5px] text-foreground/70">{tx("Forventet profit ·")}{" "}{tx(CALCULATOR_DAYS)} {" "}{tx("hverdage · maks. indsats 10.000 kr./dag")}</p>
          <p className="mt-[2px] flex items-center gap-[10px]">
            <span className="font-display text-[34px] font-bold leading-[40px] tracking-[-0.04em] text-success tabular-nums">+{fmt(shownProfit)} {" "}{tx("kr.")}</span>
          </p>
        </div>
        <div className="absolute right-[20px] top-[18px] text-right">
          <p className="text-[10.5px] text-foreground/70">{tx("Efter 30 hverdage")}</p>
          <p className="mt-[6px] flex items-center justify-end gap-[6px] font-display text-[16px] font-semibold tabular-nums">
            <span className="text-foreground/60">{fmt(shown)}</span>
            <ArrowRight className="h-[13px] w-[13px] text-primary-glow" />
            <span>{fmt(endingBank)} {" "}{tx("kr.")}</span>
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
          {[tx("Hverdag 1"), tx("Hverdag 10"), tx("Hverdag 20"), tx("Hverdag 30")].map((d) => <span key={d}>{tx(d)}</span>)}
        </div>
        <p className="absolute inset-x-[20px] bottom-[10px] flex items-center gap-[5px] text-[8.5px] text-foreground/50">
          <Info className="h-[10px] w-[10px] shrink-0" />
          {tx("Illustrativ beregning – faktiske resultater kan variere, og profit er ikke garanteret.")}</p>
      </div>
    </section>
  );
}
