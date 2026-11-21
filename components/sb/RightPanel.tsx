"use client";
import { Clock, Lightbulb, ArrowRight, Trophy, Radar } from "lucide-react";

import { formatPct, surebetProfitPct, teamShort } from "./data";
import { Crest } from "./Crest";
import { useSurebets } from "./surebets-context";

/** Profit trend of the latest finds, oldest to newest. */
function Sparkline({ pts }: { pts: number[] }) {
  if (pts.length < 2) return <div className="h-[34px]" aria-hidden />;
  const w = 120;
  const h = 34;
  const step = w / (pts.length - 1);
  const max = Math.max(...pts) || 1;
  const line = pts.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * (h - 2) - 1).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[34px] w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary-glow)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--primary-glow)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="url(#spark-fill)" />
      <polyline points={line} fill="none" stroke="var(--primary-glow)" strokeWidth="1.8" strokeLinejoin="round" className="icon-glow" />
    </svg>
  );
}

function LiveScanner() {
  const { surebets, trend, bookmakers } = useSurebets();
  return (
    <div className="sb-panel panel-glow edge-light relative overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[16px] font-bold">
              <span className="glow-dot h-2.5 w-2.5 animate-blink rounded-full bg-success" /> Live scanner
            </div>
            <div className="mt-0.5 truncate pl-[18px] text-[11.5px] text-muted-foreground">Nye fund i realtid</div>
          </div>
          <span className="live-pill inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold tracking-[0.14em] text-success">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-success" /> LIVE
          </span>
        </div>
        <div className="mt-3">
          <Sparkline pts={trend} />
        </div>
      </div>
      <ul className="max-h-[420px] divide-y divide-border overflow-y-auto border-t border-border">
        {surebets.length === 0 && <li className="px-4 py-5 text-center text-[12.5px] text-muted-foreground">Ingen aktive fund lige nu.</li>}
        {surebets.slice(0, 12).map((b) => {
          const pct = surebetProfitPct(b.legs.map((l) => l.odds));
          return (
            <li key={b.id} className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-surface-elevated/50">
              <span className="flex shrink-0 -space-x-2">
                <Crest src={b.home.crest} name={b.home.name} size="sm" />
                <Crest src={b.away.crest} name={b.away.name} size="sm" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-[13px] font-semibold">
                  {teamShort(b.home)} – {teamShort(b.away)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  {b.leagueShort} <Clock className="ml-1 h-3 w-3 text-cyan" /> {b.foundAgo}
                  <span className="margin-pill ml-auto rounded-md px-1.5 py-0.5 text-[12px] font-extrabold tabular-nums text-success">+{formatPct(pct)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <Radar className="h-3.5 w-3.5 text-primary-glow" /> <b className="font-bold text-foreground">{bookmakers.length}</b> bookmakere
        </span>
        <span className="whitespace-nowrap">
          <b className="font-bold text-foreground">{surebets.length}</b> aktive fund
        </span>
      </div>
    </div>
  );
}

export function RightPanel() {
  const { top } = useSurebets();
  return (
    <aside className="flex flex-col gap-4">
      <LiveScanner />

      <div className="sb-panel edge-light relative p-5">
        <div className="flex items-center gap-2.5 text-[17px] font-bold">
          <Lightbulb className="h-6 w-6 fill-gold text-gold drop-shadow-[0_0_8px_var(--gold)]" /> Quick info
        </div>
        <p className="mt-3 text-[15px] font-semibold leading-snug">En surebet er en sikker gevinst uanset resultatet.</p>
        <p className="mt-3 text-[15px] font-medium leading-snug text-foreground/85">Vi finder de bedste muligheder på tværs af bookmakere.</p>
        <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg chip-surface border border-border-glow/60 py-2 text-sm font-bold text-primary-glow hover:brightness-125">
          Læs mere <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="sb-panel panel-glow relative min-h-[245px] overflow-hidden">
        <img src="/sb/promo-ball.jpg" alt="" loading="lazy" width={816} height={816} className="absolute inset-0 h-full w-full object-cover object-[75%_60%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-transparent" />
        <div className="relative flex h-full min-h-[245px] flex-col justify-center p-6">
          <Trophy className="h-10 w-10 fill-gold text-gold drop-shadow-[0_0_10px_var(--gold)]" />
          <div className="text-glow-gold mt-3 text-[44px] font-extrabold leading-none text-gold">{top ? formatPct(top.pct) : "–"}</div>
          <div className="mt-1 text-lg font-bold">Profit</div>
          <div className="text-shadow-hero text-[15px] text-foreground/90">på dagens bedste surebet</div>
          {top && (
            <div className="glass-pill mt-3 w-fit max-w-full truncate rounded-full px-3 py-1 text-[12.5px] font-semibold">
              {top.b.home.name} – {top.b.away.name}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
