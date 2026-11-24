"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useState } from "react";
import { Clock, Radar } from "lucide-react";
import { TeamCrest, useHomeData, type HomeRow } from "./home-data";

const VISIBLE_ROWS = 5;

/** Formats an age in seconds the way the scanner shows it: 12s, 21m, 1t. */
export function formatAge(s: number) {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}t`;
}

/** Newest real surebets from the scanner; their age counts up every second. */
export function useLiveRows(): HomeRow[] {
  const { rows } = useHomeData();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  return rows.slice(0, VISIBLE_ROWS).map((r) => ({ ...r, age: r.age + elapsed }));
}

/** Soft light band that sweeps down over the rows, so the table reads as "scanning". */
export function ScanSweep({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute overflow-hidden ${className}`} aria-hidden="true">
      <div className="scan-sweep absolute inset-x-0 top-0 h-1/4" />
    </div>
  );
}

export function LiveScanner() {
  const { tx } = useLocale();
  const rows = useLiveRows();
  const { stats } = useHomeData();

  return (
    <div id="scanner" className="relative shrink-0 scroll-mt-24">
      <div className="panel live-scanner relative h-[300px] w-[352px] overflow-hidden rounded-[16px]">
        <span className="absolute left-[17px] top-[16px] h-[13px] w-[13px] animate-pulse rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
        <p className="absolute left-[44px] top-[12px] text-[13.5px] leading-[18px]">
          <span className="font-semibold">{tx("Live scanner")}</span> {" "}{tx("– Nye fund")}</p>
        <p className="absolute left-[44px] top-[34px] text-[9.5px] text-foreground/75">{tx("Opdateres automatisk")}</p>
        <svg className="absolute left-[200px] top-[10px] h-[34px] w-[76px] text-primary-glow" viewBox="0 0 76 34" aria-hidden="true">
          <defs>
            <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 32 L10 27 L18 29 L28 21 L36 24 L46 13 L52 17 L60 4 L68 14 L76 18 L76 34 L0 34Z" fill="url(#spark)" />
          <polyline points="0,32 10,27 18,29 28,21 36,24 46,13 52,17 60,4 68,14 76,18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span className="absolute right-[14px] top-[16px] flex h-[20px] items-center gap-[5px] rounded-full border border-success/50 bg-success-bg/40 px-[8px] text-[8.5px] font-bold tracking-[0.12em] text-success">
          <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-success" />
          {tx("LIVE")}</span>
        <div className="absolute inset-x-0 top-[61px] h-px bg-border" />

        <div className="absolute left-[17px] right-[12px] top-[69px] grid h-[18px] grid-cols-[190px_33px_1fr] items-center text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
          <span>{tx("Kamp")}</span>
          <span>{tx("Liga")}</span>
          <span className="pl-[28px]">{tx("Margin")}</span>
        </div>
        <div className="absolute left-[15px] right-[12px] top-[89px] h-px bg-border/70" />

        <ScanSweep className="inset-x-0 top-[90px] h-[172px]" />
        <div className="absolute left-[15px] right-[12px] top-[90px]">
          {rows.map((r) => (
            <div key={r.id} className="row-in grid h-[34.4px] grid-cols-[192px_33px_1fr] items-center border-b border-border/60 text-[9.5px] last:border-b-0">
              <div className="flex items-center">
                <TeamCrest team={r.home} className="size-[21px]" />
                <TeamCrest team={r.away} className="ml-[7px] size-[21px]" />
                <span className="ml-[8px] truncate">
                  {tx(r.home.name)} – {tx(r.away.name)}
                </span>
              </div>
              <span className="truncate text-muted-foreground" title={tx(r.league)}>{tx(r.league)}</span>
              <div className="flex items-center">
                <span className="pill-success flex h-[22px] w-[56px] items-center justify-center rounded-[6px] text-[10.5px] font-bold">
                  +{r.margin.toFixed(2)}%
                </span>
                <span className="ml-[10px] flex items-center gap-[3px] text-[9px] text-foreground/85">
                  <Clock className="h-[9px] w-[9px] text-primary-glow" />
                  {formatAge(r.age)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="scanner-strip absolute inset-x-0 bottom-0 flex h-[36px] items-center justify-between px-[16px] text-[9px] text-muted-foreground">
          <span className="flex items-center gap-[6px]">
            <Radar className="h-[12px] w-[12px] text-primary-glow" />
            <span>{tx("Scanner")}{" "}<span className="font-semibold text-foreground">2000+</span> {" "}{tx("bookmakere")}</span>
          </span>
          <span><span className="font-semibold text-foreground">{tx(stats.surebets)}</span> {" "}{tx("aktive surebets")}</span>
        </div>
      </div>
    </div>
  );
}
