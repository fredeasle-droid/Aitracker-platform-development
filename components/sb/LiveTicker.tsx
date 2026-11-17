"use client";
import { formatPct, surebetProfitPct, surebets, teamShort } from "./data";
import { Crest } from "./Crest";

const items = surebets.map((b) => ({ b, pct: surebetProfitPct(b.legs.map((l) => l.odds)) }));

/** Endless strip of the latest finds, styled like the front page's "Live fund" bar. */
export function LiveTicker() {
  return (
    <div className="sb-panel edge-light relative flex items-center overflow-hidden rounded-2xl">
      <div className="sb-ticker-label relative z-10 flex shrink-0 items-center gap-2.5 self-stretch border-r border-border px-4 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-success sm:px-5">
        <span className="glow-dot h-2.5 w-2.5 animate-blink rounded-full bg-success" /> Live fund
      </div>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {items.map(({ b, pct }) => (
                <div key={b.id} className="flex items-center gap-3 whitespace-nowrap py-3 pl-7">
                  <span className="flex -space-x-1.5">
                    <Crest src={b.home.crest} name={b.home.name} size="sm" />
                    <Crest src={b.away.crest} name={b.away.name} size="sm" />
                  </span>
                  <span className="text-[14px] font-bold">
                    {teamShort(b.home)} – {teamShort(b.away)}
                  </span>
                  <span className="text-[12px] font-semibold text-muted-foreground">{b.leagueShort}</span>
                  <span className="text-glow-success text-[14px] font-extrabold tabular-nums text-success">+{formatPct(pct)}</span>
                  <span className="ml-4 h-1.5 w-1.5 rounded-full bg-primary-glow/60" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
