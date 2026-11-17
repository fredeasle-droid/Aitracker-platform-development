"use client";

import { type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { TeamCrest, useHomeData, type HomeFind } from "./home-data";

const GAP = 13;
export const CARD_WIDTH = 290;

/** Seconds per loop, scaled to the number of cards so the glide speed stays constant. */
const SECONDS_PER_CARD = 11;

export function FindCard({ f, best, width = CARD_WIDTH }: { f: HomeFind; best: boolean; width?: number }) {
  return (
    <article className={`panel-soft relative h-[165px] shrink-0 ${best ? "glow-success" : ""}`} style={{ width }}>
      <p className="absolute left-[16px] right-[16px] top-[12px] truncate text-[11px] font-medium leading-[15px] text-accent">{f.league}</p>
      <p className="absolute left-[16px] right-[16px] top-[35px] truncate text-[17px] font-bold leading-[22px]">
        {f.home.name} – {f.away.name}
      </p>
      <div className="absolute left-0 top-[66px] flex h-[54px] items-center justify-center gap-[12px]" style={{ width: width - 108 }}>
        <TeamCrest team={f.home} className="h-[52px] w-[52px]" />
        <TeamCrest team={f.away} className="h-[52px] w-[52px]" />
      </div>
      <div className="margin-box absolute right-[21px] top-[68px] flex h-[51px] w-[88px] flex-col items-center justify-center rounded-[10px]">
        <span className="text-[21px] font-bold leading-[24px]">{f.margin.toFixed(2)}%</span>
        <span className="text-[10.5px] leading-[13px]">Margin</span>
      </div>
      <p className="absolute left-[17px] top-[134px] flex items-center gap-[6px] text-[11px]">
        <Clock className="h-[15px] w-[15px]" />
        {f.time}
      </p>
      <Link href="/surebets" className="btn-glow absolute right-[12px] top-[129px] flex h-[26px] items-center gap-[4px] rounded-full px-[13px] text-[10.5px] font-bold">
        Se detaljerne <ArrowRight className="h-[11px] w-[11px]" />
      </Link>
    </article>
  );
}

/** "Ugens bedste fund" slideshow: one continuous slow glide to the left that loops without a break. */
export function WeeklyCarousel() {
  const { finds } = useHomeData();
  if (finds.length === 0) {
    return (
      <p className="absolute left-[28px] top-[70px] text-[13px] text-muted-foreground">
        Ingen surebets lige nu – scanneren leder videre.
      </p>
    );
  }

  const setWidth = finds.length * (CARD_WIDTH + GAP);
  const copies = Math.max(3, Math.ceil(2400 / setWidth) + 1);
  const cards = Array.from({ length: copies }, () => finds).flat();

  return (
    <div
      className="marquee absolute left-[28px] top-[12px] flex w-max gap-[13px]"
      style={{ "--marquee-shift": `-${setWidth}px`, "--marquee-duration": `${finds.length * SECONDS_PER_CARD}s` } as CSSProperties}
    >
      {cards.map((f, k) => (
        <FindCard key={k} f={f} best={k % finds.length === 0} />
      ))}
    </div>
  );
}
