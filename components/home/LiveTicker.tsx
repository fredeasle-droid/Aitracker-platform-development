"use client";

import { TeamCrest, useHomeData } from "./home-data";

/** Endless strip of recent finds under the hero: "LIVE FUND" label, then matches gliding left. */
export function LiveTicker({ phone = false, className = "" }: { phone?: boolean; className?: string }) {
  const { rows } = useHomeData();
  const crest = phone ? "size-[18px]" : "size-[16px]";
  const text = phone ? "text-[12px]" : "text-[10.5px]";
  return (
    <div className={`ticker-bar flex items-center overflow-hidden ${phone ? "h-12 rounded-[14px]" : "h-[46px] rounded-[14px]"} ${className}`}>
      <span className={`ticker-label flex h-full shrink-0 items-center gap-[8px] font-bold tracking-[0.12em] ${phone ? "px-3 text-[10.5px]" : "px-[16px] text-[9.5px]"}`}>
        <span className="h-[8px] w-[8px] animate-pulse rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
        LIVE FUND
      </span>
      <div className="fade-x relative h-full min-w-0 flex-1 overflow-hidden">
        <div className="marquee-half flex h-full w-max items-center" style={{ ["--marquee-duration" as string]: `${Math.max(rows.length, 6) * (phone ? 9 : 10)}s` }}>
          {rows.length === 0 && (
            <span className={`px-4 text-muted-foreground ${text}`}>Scanneren leder efter nye surebets...</span>
          )}
          {rows.length > 0 && [0, 1].map((copy) =>
            rows.map((t, k) => (
              <span key={`${copy}-${k}`} aria-hidden={copy === 1} className={`flex shrink-0 items-center gap-[7px] ${text} ${phone ? "px-4" : "px-[18px]"}`}>
                <TeamCrest team={t.home} decorative className={crest} />
                <TeamCrest team={t.away} decorative className={crest} />
                <span className="whitespace-nowrap font-medium">{t.home.name} – {t.away.name}</span>
                <span className="text-muted-foreground">{t.league}</span>
                <span className="font-bold text-success">+{t.margin.toFixed(2)}%</span>
                <span className="ml-[10px] h-[4px] w-[4px] rounded-full bg-primary-glow/50" />
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
