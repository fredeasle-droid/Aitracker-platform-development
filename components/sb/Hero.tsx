"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Zap, Trophy, Layers, Play } from "lucide-react";
import { formatAgo, formatPct, surebetProfitPct, teamShort } from "./data";
import { useSurebets } from "./surebets-context";

/** Age of the newest find, counting up from the server value; null when nothing has been found. */
function useLastScan(initial: number | null) {
  const [sec, setSec] = useState(initial);
  useEffect(() => {
    setSec(initial);
    if (initial === null) return;
    const t = setInterval(() => setSec((s) => (s === null ? s : s + 1)), 1000);
    return () => clearInterval(t);
  }, [initial]);
  return sec;
}

function NewFindToast() {
  const { surebets } = useSurebets();
  const newest = surebets[0];
  if (!newest) return null;
  const newestPct = surebetProfitPct(newest.legs.map((l) => l.odds));
  return (
    <div className="toast-glass sb-toast-in absolute right-6 top-4 hidden items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4 lg:flex">
      <span className="find-icon flex h-10 w-10 items-center justify-center rounded-xl">
        <Zap className="h-5 w-5 fill-success text-success" />
      </span>
      <div className="leading-tight">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-success">Nyt surebet fundet</div>
        <div className="mt-0.5 text-[14px] font-bold">
          {teamShort(newest.home)} – {teamShort(newest.away)} <span className="text-success">+{formatPct(newestPct)}</span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { surebets, top, lastScanSec } = useSurebets();
  const sec = useLastScan(lastScanSec);
  const stats = [
    { icon: Zap, title: "24/7", sub: "Scanning" },
    { icon: Layers, title: String(surebets.length), sub: "Surebets nu" },
    { icon: Trophy, title: top ? formatPct(top.pct) : "–", sub: "Top-profit" },
  ];
  return (
    <section className="relative">
      <NewFindToast />
      <div className="relative flex flex-col justify-center px-1 pb-2 pt-3 sm:min-h-[290px] sm:px-6 sm:py-6 short:lg:min-h-[262px] short:lg:py-4">
        <span className="glass-pill hero-rise mb-3.5 inline-flex sm:mb-5 w-fit items-center gap-2.5 whitespace-nowrap rounded-full py-1.5 pl-3 pr-3.5 text-[12.5px] font-semibold">
          <span className="glow-dot h-2 w-2 animate-blink rounded-full bg-success" />
          <span className="text-success">Live surebet-scanner aktiv</span>
          <span className="hidden h-3.5 w-px bg-border sm:block" />
          <span className="hidden tabular-nums text-muted-foreground sm:inline">{sec === null ? "Ingen fund endnu" : `Seneste fund: ${formatAgo(sec)} siden`}</span>
        </span>
        <h1 className="hero-rise max-w-[560px] text-[32px] font-extrabold leading-[1.04] tracking-[-0.025em] text-balance drop-shadow-[0_2px_12px_var(--surface-deep)] sm:text-[52px]">
          Find de bedste surebets –{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="text-gradient-live">i realtid</span>
            <svg viewBox="0 0 200 14" preserveAspectRatio="none" className="swoosh absolute -bottom-2.5 left-0 h-3 w-full" aria-hidden>
              <defs>
                <linearGradient id="swoosh-g" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--primary-glow)" />
                  <stop offset="1" stopColor="var(--teal)" />
                </linearGradient>
              </defs>
              <path d="M3 10 C 55 2, 140 1, 197 6" fill="none" stroke="url(#swoosh-g)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="hero-rise hero-rise-2 text-shadow-hero mt-4 max-w-[470px] text-[15.5px] font-medium leading-relaxed sm:mt-5 sm:leading-snug text-foreground/90 sm:text-[18px]">
          Lad vores AI finde de mest profitable muligheder på tværs af bookmakere – automatisk.
        </p>
        <div className="hero-rise hero-rise-3 mt-5 flex items-center gap-2 sm:mt-6 sm:flex-wrap sm:gap-3 short:lg:mt-5">
          <button className="btn-hero btn-shine group relative inline-flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-5 text-[15px] font-bold text-primary-foreground transition hover:brightness-110 active:scale-[0.98] sm:h-auto sm:flex-none sm:gap-2.5 sm:px-7 sm:py-3 sm:text-[16px]">
            Start scanning <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </button>
          <button className="sb-btn-ghost-glass group inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full pl-2 pr-4 text-[14.5px] font-semibold transition hover:brightness-125 active:scale-[0.98] sm:h-auto sm:gap-3 sm:py-2 sm:pr-5 sm:text-[15px]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated ring-1 ring-border-glow/60 transition group-hover:ring-primary-glow">
              <Play className="h-3.5 w-3.5 fill-foreground text-foreground" />
            </span>
            <span className="sm:hidden">Sådan virker det</span>
            <span className="hidden sm:inline">Se hvordan det virker</span>
          </button>
        </div>
        <div className="stats-glass mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl md:hidden">
          {stats.map(({ icon: Icon, title, sub }) => (
            <div key={sub} className="flex items-center justify-center gap-2 px-2 py-2.5">
              <Icon className="icon-glow h-[18px] w-[18px] shrink-0 fill-primary-glow/40 text-primary-glow" strokeWidth={2} />
              <div className="min-w-0 leading-tight">
                <div className="text-[15px] font-extrabold tabular-nums">{title}</div>
                <div className="truncate text-[11px] text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="stats-glass absolute bottom-3.5 right-3.5 hidden grid-cols-3 divide-x divide-border rounded-2xl md:grid">
        {stats.map(({ icon: Icon, title, sub }) => (
          <div key={sub} className="flex w-[112px] flex-col items-center px-3 py-3 text-center">
            <Icon className="icon-glow mb-1.5 h-[24px] w-[24px] fill-primary-glow/40 text-primary-glow" strokeWidth={2} />
            <div className="text-[17px] font-extrabold leading-tight tabular-nums">{title}</div>
            <div className="text-[12px] text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
