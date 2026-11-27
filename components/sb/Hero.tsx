"use client";
import { useEffect, useState } from "react";
import Link from "@/components/localized-link";
import { ArrowRight, Zap, Trophy, Layers, Play } from "lucide-react";
import { formatPct } from "./data";
import { useSurebets } from "./surebets-context";
import { useLocale } from "@/components/locale-provider";

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

export function Hero() {
  const { surebets, top, lastScanSec } = useSurebets();
  const sec = useLastScan(lastScanSec);
  const { t } = useLocale();
  const ago = (seconds: number) =>
    seconds < 60
      ? t("sbAgoSec", { n: Math.max(1, Math.floor(seconds)) })
      : seconds < 3600
        ? t("sbAgoMin", { n: Math.floor(seconds / 60) })
        : t("sbAgoHour", { n: Math.floor(seconds / 3600) });
  const stats = [
    { icon: Zap, title: "24/7", sub: t("sbStatScanning") },
    { icon: Layers, title: String(surebets.length), sub: t("sbStatNow") },
    { icon: Trophy, title: top ? formatPct(top.pct) : "–", sub: t("sbStatTop") },
  ];
  return (
    <section className="relative">
      <div className="relative flex min-h-[290px] flex-col justify-center px-2 py-6 sm:px-6 short:lg:min-h-[262px] short:lg:py-4">
        <span className="glass-pill hero-rise mb-5 hidden w-fit items-center sm:inline-flex gap-2.5 whitespace-nowrap rounded-full py-1.5 pl-3 pr-3.5 text-[12.5px] font-semibold">
          <span className="glow-dot h-2 w-2 animate-blink rounded-full bg-success" />
          <span className="text-success">{t("sbHeroActive")}</span>
          <span className="hidden h-3.5 w-px bg-border sm:block" />
          <span className="hidden tabular-nums text-muted-foreground sm:inline">{sec === null ? t("sbHeroNoFinds") : t("sbHeroLastFind", { ago: ago(sec) })}</span>
        </span>
        <h1 className="hero-rise max-w-[560px] text-[36px] font-extrabold leading-[1.02] tracking-[-0.025em] drop-shadow-[0_2px_12px_var(--surface-deep)] sm:text-[52px]">
          {t("sbHeroTitle")}{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="text-gradient-live">{t("sbHeroTitleLive")}</span>
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
        <p className="hero-rise hero-rise-2 text-shadow-hero mt-5 max-w-[470px] text-[16.5px] font-medium leading-snug text-foreground/90 sm:text-[18px]">
          {t("sbHeroText")}
        </p>
        <div className="hero-rise hero-rise-3 mt-6 flex flex-wrap items-center gap-3 short:lg:mt-5">
          <Link
            href="/konto"
            className="btn-hero btn-shine group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-[16px] font-bold text-primary-foreground transition hover:brightness-110 active:scale-[0.98] sm:hidden"
          >
            {t("sbCreateFree")} <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
          <button className="btn-hero btn-shine group relative hidden items-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-[16px] font-bold text-primary-foreground transition hover:brightness-110 active:scale-[0.98] sm:inline-flex">
            {t("sbStartScan")} <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </button>
          <button className="sb-btn-ghost-glass group inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-[15px] font-semibold transition hover:brightness-125 active:scale-[0.98]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated ring-1 ring-border-glow/60 transition group-hover:ring-primary-glow">
              <Play className="h-3.5 w-3.5 fill-foreground text-foreground" />
            </span>
            {t("sbHowItWorks")}
          </button>
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
