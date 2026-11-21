"use client";

import { Percent, Target, TrendingUp } from "lucide-react";
import { CHALLENGE, RESULT_SERIES } from "./data";
import { useCount } from "./use-count";

const W = 190;
const H = 44;
const max = Math.max(...RESULT_SERIES);
const pts = RESULT_SERIES.map((v, i) => [(i / (RESULT_SERIES.length - 1)) * (W - 6), H - 3 - (v / max) * (H - 8)] as const);
const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const area = `${line} L${pts[pts.length - 1]![0].toFixed(1)} ${H} L0 ${H} Z`;
const end = pts[pts.length - 1]!;

export function ResultsStrip({ inView }: { inView: boolean }) {
  const total = useCount(CHALLENGE.totalReturn, inView);
  const bets = useCount(CHALLENGE.surebets, inView);
  const margin = useCount(CHALLENGE.avgMargin, inView);

  const stats = [
    ["Antal surebets", Math.round(bets).toString(), Target],
    ["Gns. margin", `${margin.toFixed(2)}%`, Percent],
  ] as const;

  return (
    <div className="challenge-strip absolute inset-x-0 bottom-0 h-[96px]">
      <p className="absolute left-[32px] top-[20px] text-[10px] font-semibold uppercase tracking-[2.2px] text-primary-glow">Tallene bag rejsen</p>
      <h3 className="absolute left-[32px] top-[38px] text-[19px] font-bold leading-[23px]">Se resultaterne – sort på hvidt</h3>
      <p className="absolute left-[32px] top-[63px] text-[10.5px] leading-[14px] text-foreground/70">Følg fremgangen i realtid, dag for dag.</p>

      <div className="value-pill absolute left-[430px] top-[16px] h-[64px] w-[218px] rounded-[12px]">
        <p className="absolute left-[12px] top-[8px] text-[9.5px] text-foreground/75">Samlet resultat</p>
        <p className="absolute left-[12px] top-[24px] flex items-center gap-[4px] text-[19px] font-bold leading-[22px] tabular-nums text-success">
          <TrendingUp className="h-[15px] w-[15px]" strokeWidth={2.6} aria-hidden="true" />+{total.toFixed(2)}%
        </p>
        <svg className="absolute bottom-[4px] right-[8px]" width={110} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="strip-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#strip-area)" className="delay-700 transition-opacity duration-1000" style={{ opacity: inView ? 1 : 0 }} />
          <path
            d={line}
            pathLength={1}
            fill="none"
            stroke="var(--primary-glow)"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="chart-draw"
            style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1 }}
          />
          <circle cx={end[0]} cy={end[1]} r="3.5" fill="var(--primary-glow)" opacity={inView ? 1 : 0} />
        </svg>
      </div>

      {stats.map(([label, value, Icon], k) => (
        <div key={label} className="value-pill absolute top-[16px] flex h-[64px] w-[136px] flex-col justify-center rounded-[12px] pl-[12px]" style={{ left: 660 + k * 146 }}>
          <p className="text-[9.5px] leading-[12px] text-foreground/75">{label}</p>
          <p className="mt-[3px] flex items-center gap-[5px] text-[19px] font-bold leading-[22px] tabular-nums">
            <Icon className="h-[14px] w-[14px] text-primary-glow" strokeWidth={2.6} aria-hidden="true" />
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
