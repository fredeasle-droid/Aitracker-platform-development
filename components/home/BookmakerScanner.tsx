"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "@/lib/use-in-view";
import { useCount } from "./use-count";
import { Radar } from "lucide-react";
import { BOOKMAKER_LOGOS, POPULAR_BOOKMAKERS, SCANNED_BOOKMAKERS_LABEL } from "./bookmakerLogos";
import { useHomeData } from "./home-data";

const ROW_DURATIONS = [40, 46, 36];
const MIN_CHIPS_PER_ROW = 8;

export type BookmakerRow = { names: string[]; duration: number; reverse: boolean };

/** Spreads the real bookmaker list over three rows; short rows repeat so the strip always fills the panel. */
export function splitRows(names: string[]): BookmakerRow[] {
  if (names.length === 0) return [];
  return ROW_DURATIONS.map((duration, r) => {
    const own = names.filter((_, i) => i % ROW_DURATIONS.length === r);
    const base = own.length > 0 ? own : names;
    const repeats = Math.ceil(MIN_CHIPS_PER_ROW / base.length);
    return { names: Array.from({ length: repeats }, () => base).flat(), duration, reverse: r === 1 };
  });
}

/** Two-letter tag shown in the blue tile, e.g. "Danske Spil" → "DA". */
export function bookmakerTag(name: string) {
  return name.replace(/[^\p{L}\d]/gu, "").slice(0, 2).toUpperCase();
}

/** Headline numbers from the live database: [value, label]. */
export function useStatTiles(): [string, string][] {
  const { stats } = useHomeData();
  return [
    [SCANNED_BOOKMAKERS_LABEL, "Bookmakere"],
    [String(stats.leagues), "Ligaer"],
    [String(stats.surebets), "Aktive surebets"],
  ];
}

export function Chip({ name, updating }: { name: string; updating: boolean }) {
  const { tx } = useLocale();
  return (
    <div className="bookmaker-chip mr-[14px] flex h-[46px] shrink-0 items-center gap-[11px] rounded-[12px] pl-[9px] pr-[14px]">
      {BOOKMAKER_LOGOS[name] ? (
        <img src={BOOKMAKER_LOGOS[name]} alt={`${name} logo`} loading="lazy" width={28} height={28} className="h-[28px] w-[28px] rounded-[8px] object-cover" />
      ) : (
        <span className="btn-glow flex h-[28px] w-[28px] items-center justify-center rounded-[8px] text-[9.5px] font-bold tracking-[0.3px]">
          {bookmakerTag(name)}
        </span>
      )}
      <span className="whitespace-nowrap text-[13px] font-semibold">{tx(name)}</span>
      <span
        className={`ml-[6px] h-[7px] w-[7px] rounded-full transition-colors duration-500 ${updating ? "animate-pulse bg-gold shadow-[0_0_8px_var(--gold)]" : "bg-success shadow-[0_0_8px_var(--success)]"}`}
      />
    </div>
  );
}

/** A few bookmakers are "updating" at any time; one swaps every 1.6s so the board feels live. */
export function useUpdating(names: string[]) {
  const [updating, setUpdating] = useState<string[]>([]);
  useEffect(() => {
    if (names.length < 4) return;
    setUpdating(names.slice(0, 3));
    const t = setInterval(() => {
      setUpdating((cur) => {
        const pool = names.filter((n) => !cur.includes(n));
        const next = pool[Math.floor(Math.random() * pool.length)];
        return next ? [...cur.slice(1), next] : cur;
      });
    }, 1600);
    return () => clearInterval(t);
  }, [names]);
  return updating;
}

/** Desktop stat tile that counts up the first time it scrolls into view. */
function CountStat({ to, label, format, run, fixed }: { to: number; label: string; format: (v: number) => string; run: boolean; fixed?: string }) {
  const { tx } = useLocale();
  const v = useCount(to, run, 1600);
  return (
    <div className="panel-soft lift flex h-[60px] w-[124px] flex-col justify-center pl-[14px]">
      <span className="font-display text-[19px] font-bold leading-[23px] tracking-[-0.03em] text-primary-glow tabular-nums">{fixed ?? format(v)}</span>
      <span className="text-[10px] leading-[14px] text-foreground/70">{tx(label)}</span>
    </div>
  );
}

export function BookmakerScanner() {
  const { tx } = useLocale();
  const { stats } = useHomeData();
  const updating = useUpdating(POPULAR_BOOKMAKERS);
  const rows = splitRows(POPULAR_BOOKMAKERS);
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const countStats = [
    { to: 0, label: "Bookmakere", fixed: SCANNED_BOOKMAKERS_LABEL },
    { to: stats.leagues, label: "Ligaer" },
    { to: stats.surebets, label: "Aktive surebets" },
  ];

  return (
    <section ref={ref} className="reveal panel bookmaker-panel spotlight relative ml-[28px] mt-[80px] h-[310px] w-[969px] overflow-hidden rounded-[22px]">
      <span className="eyebrow-chip absolute left-[32px] top-[32px] flex h-[24px] items-center gap-[6px] rounded-full px-[11px] text-[9.5px] font-semibold uppercase tracking-[0.16em]">
        <Radar className="h-[12px] w-[12px] animate-[spin_6s_linear_infinite]" strokeWidth={2.3} />
        {tx("Oversigt over bookmakere")}</span>
      <h2 className="absolute left-[32px] top-[70px] text-[32px] font-bold leading-[38px]">
        {tx("Vi scanner")}{" "}<span className="text-gradient-brand">{tx(SCANNED_BOOKMAKERS_LABEL)}</span>
        <br />
        {tx("bookmakere – hele tiden")}</h2>
      <p className="absolute left-[32px] top-[156px] w-[390px] text-[12px] leading-[18px] text-foreground/75">
        {tx("Vores AI sammenligner odds på tværs af danske og internationale bookmakere hvert sekund, så du aldrig går glip af et surebet.")}</p>
      <div className="absolute left-[32px] top-[214px] flex gap-[12px]">
        {countStats.map((s) => (
          <CountStat key={s.label} {...s} format={(v) => String(Math.round(v))} run={inView} />
        ))}
      </div>

      <div className="fade-x absolute left-[470px] right-0 top-[50px] flex flex-col gap-[12px]">
        {rows.map((row, k) => (
          <div
            key={k}
            className="marquee-half flex w-max"
            style={{ "--marquee-duration": `${row.duration}s`, animationDirection: row.reverse ? "reverse" : "normal" } as CSSProperties}
          >
            {[...row.names, ...row.names].map((n, i) => (
              <Chip key={i} name={n} updating={updating.includes(n)} />
            ))}
          </div>
        ))}
      </div>

      <p className="absolute right-[34px] top-[248px] flex items-center gap-[18px] text-[10px] text-foreground/75">
        <span className="flex items-center gap-[6px]"><span className="h-[7px] w-[7px] rounded-full bg-success" />{tx("Live odds")}</span>
        <span className="flex items-center gap-[6px]"><span className="h-[7px] w-[7px] rounded-full bg-gold" />{tx("Opdaterer")}</span>
      </p>
    </section>
  );
}
