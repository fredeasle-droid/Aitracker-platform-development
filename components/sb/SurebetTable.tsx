"use client";
import { useState } from "react";
import { ArrowRight, Crown, SearchX, ShieldCheck, Star, X } from "lucide-react";
import { bookmakers, formatPct, surebetProfitPct, surebets, visibleSurebets, type Surebet } from "./data";
import { BookmakerBadge, BookmakerMark } from "./BookmakerMark";
import { useBookmakerFilter } from "./bookmaker-filter";
import { ValueGauge } from "./ValueGauge";
import { Crest } from "./Crest";
import { cn } from "@/lib/utils";

const accent: Record<Surebet["accent"], string> = {
  success: "bg-success text-success",
  warning: "bg-warning text-warning",
  primary: "bg-primary-glow text-primary-glow",
  violet: "bg-violet text-violet",
};

// Sized by the table's own width (container query): below 1000px the action column folds under the gauge.
const cols =
  "grid-cols-[minmax(200px,0.95fr)_minmax(290px,1.6fr)_128px] @min-[1000px]:grid-cols-[minmax(290px,1fr)_minmax(400px,1.7fr)_124px_176px]";

/** Gauge fills completely at 5 % profit. */
const gaugeProgress = (pct: number) => pct / 5;

const allRows = surebets.map((b) => ({ b, legs: b.legs, pct: surebetProfitPct(b.legs.map((l) => l.odds)) }));

function AccentBar({ tone }: { tone: Surebet["accent"] }) {
  return (
    <>
      <span className={cn("accent-wash pointer-events-none absolute inset-y-0 left-0 w-48", accent[tone])} />
      <span className={cn("accent-glow absolute inset-y-2 left-[3px] w-[6px] rounded-full", accent[tone])} />
    </>
  );
}

function Match({ b }: { b: Surebet }) {
  return (
    <div className="flex min-w-0 items-center gap-4 @max-[999px]:gap-3">
      <div className="relative h-[100px] w-[96px] shrink-0 @max-[999px]:h-[88px] @max-[999px]:w-[84px]">
        <Crest src={b.home.crest} name={b.home.name} size="lg" className="crest-float absolute left-0 top-0 z-10" />
        <Crest src={b.away.crest} name={b.away.name} size="lg" className="crest-float-delay absolute bottom-0 right-0" />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="text-[20px] font-bold leading-[1.1] @max-[999px]:text-[17px]">{b.home.name}</div>
        <div className="my-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">vs</div>
        <div className="text-[20px] font-bold leading-[1.1] @max-[999px]:text-[17px]">{b.away.name}</div>
        <div className="mt-1.5 truncate text-[13.5px] text-muted-foreground @max-[999px]:text-[12.5px]">{b.league}</div>
        <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-cyan @max-[999px]:text-[12.5px]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> {b.time}
        </div>
      </div>
    </div>
  );
}

/** The bet itself: market, then one line per bookmaker with pick and odds. */
function BetDetails({ b, best }: { b: Surebet; best: boolean }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="market-pill inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[11.5px] font-bold uppercase tracking-wider text-cyan">
          <ShieldCheck className="h-3.5 w-3.5" /> {b.market}
        </span>
        {best && (
          <span className="best-pill inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[11.5px] font-bold uppercase tracking-wider text-gold">
            <Crown className="h-3.5 w-3.5" /> Bedst lige nu
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {b.legs.map((leg, i) => (
          <div
            key={i}
            className="leg-row grid grid-cols-[112px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2 @max-[999px]:grid-cols-[96px_minmax(0,1fr)_auto] @max-[999px]:gap-2 @max-[999px]:px-2"
          >
            <span className="flex items-center">
              <BookmakerMark id={leg.bookmaker} size="lg" />
            </span>
            <div className="min-w-0 text-[15px] font-semibold leading-snug @max-[999px]:text-[14px]">{leg.pick}</div>
            <span className="odds-chip w-[66px] rounded-lg border border-border py-1 text-center text-[18px] font-extrabold tabular-nums">
              {leg.odds.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarButton({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={on ? "Fjern fra gemte" : "Gem surebet"}
      aria-pressed={on}
      onClick={onClick}
      className="rounded-md p-1 transition-transform hover:scale-110 hover:bg-surface-elevated active:scale-95"
    >
      <Star className={cn("h-5 w-5 transition-colors", on ? "fill-gold text-gold drop-shadow-[0_0_6px_var(--gold)]" : "text-muted-foreground hover:text-foreground")} />
    </button>
  );
}

function DetailsButton({ className, short }: { className?: string; short?: boolean }) {
  return (
    <button
      className={cn(
        "btn-shine bg-gradient-primary group/btn relative flex items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-lg font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-[0.98]",
        className,
      )}
    >
      {short ? "Detaljer" : "Se detaljer"} <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
    </button>
  );
}

function ListHeader({ count }: { count: number }) {
  const { allOn, selected, toggle, selectAll } = useBookmakerFilter();
  return (
    <div className="px-1 pb-3 md:px-4 md:pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[19px] font-extrabold tracking-tight">Dagens surebets</h2>
          <span key={count} className="count-pop rounded-full bg-primary/25 px-2 py-0.5 text-xs font-bold tabular-nums text-primary-glow ring-1 ring-primary/40">
            {count}
            {!allOn && <span className="text-muted-foreground"> / {surebets.length}</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
          <span className="glow-dot h-2 w-2 animate-blink rounded-full bg-success" /> Opdateret lige nu
        </div>
      </div>
      {!allOn && selected.length > 0 && (
        <div className="row-enter mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[12px] font-semibold text-muted-foreground">Bookmakere:</span>
          {bookmakers
            .filter((bk) => selected.includes(bk.id))
            .map((bk) => (
              <button
                key={bk.id}
                onClick={() => toggle(bk.id)}
                aria-label={`Fjern ${bk.name}`}
                className="bk-chip group/chip flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 text-[12px] font-semibold transition hover:brightness-125"
              >
                <BookmakerBadge id={bk.id} className="h-5 w-5 text-[8px]" />
                {bk.name}
                <X className="h-3 w-3 text-muted-foreground transition group-hover/chip:text-foreground" />
              </button>
            ))}
          <button onClick={selectAll} className="ml-1 rounded-md px-1.5 py-0.5 text-[12px] font-semibold text-primary-glow hover:underline">
            Nulstil
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const { selectAll, selected } = useBookmakerFilter();
  return (
    <div className="row-enter flex flex-col items-center px-6 py-14 text-center">
      <span className="find-icon mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
        <SearchX className="h-7 w-7 text-success" />
      </span>
      <div className="text-[17px] font-bold">Ingen surebets med dit valg</div>
      <p className="mt-1.5 max-w-[340px] text-[13.5px] leading-snug text-muted-foreground">
        {selected.length === 0
          ? "Du har fravalgt alle bookmakere. Vælg mindst to for at se surebets."
          : "Et surebet kræver, at begge bookmakere er valgt. Tilføj flere bookmakere for at se flere forslag."}
      </p>
      <button onClick={selectAll} className="btn-shine bg-gradient-primary relative mt-5 overflow-hidden rounded-lg px-5 py-2 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-110">
        Vis alle bookmakere
      </button>
    </div>
  );
}

export function SurebetTable() {
  const [starred, setStarred] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setStarred((s) => ({ ...s, [id]: !s[id] }));
  const { selected } = useBookmakerFilter();
  const rows = visibleSurebets(allRows, selected);
  const bestId = rows.length ? rows.reduce((best, r) => (r.pct > best.pct ? r : best), rows[0]!).b.id : null;
  return (
    <>
      {/* Phone: one card per match */}
      <div className="md:hidden">
        <ListHeader count={rows.length} />
        {rows.length === 0 && (
          <div className="sb-panel">
            <EmptyState />
          </div>
        )}
        <div className="space-y-3">
          {rows.map(({ b, pct }) => (
            <div key={b.id} className={cn("sb-panel surebet-row row-enter @container relative overflow-hidden p-4", b.id === bestId && "row-best")}>
              <AccentBar tone={b.accent} />
              <div className="flex items-start justify-between gap-3">
                <Match b={b} />
                <ValueGauge display={formatPct(pct)} label="profit" progress={gaugeProgress(pct)} size={88} />
              </div>
              <div className="mt-4">
                <BetDetails b={b} best={b.id === bestId} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <DetailsButton className="flex-1 py-2.5 text-sm" />
                <StarButton on={!!starred[b.id]} onClick={() => toggle(b.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet & desktop: table */}
      <div className="sb-panel panel-glow edge-light @container hidden overflow-hidden md:block">
        <ListHeader count={rows.length} />
        {rows.length === 0 ? (
          <div className="border-t border-border">
            <EmptyState />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[660px]">
            <div className={cn("table-head grid items-center gap-4 border-y border-border px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground @min-[1000px]:px-6", cols)}>
              <div>Kamp</div>
              <div>Væddemål &amp; bookmakere</div>
              <div className="text-center">Profit</div>
              <div className="hidden text-center @min-[1000px]:block">Handling</div>
            </div>
            <div className="space-y-2 p-2">
              {rows.map(({ b, pct }, i) => (
                <div
                  key={b.id}
                  style={{ animationDelay: `${120 + i * 70}ms` }}
                  className={cn(
                    "row-surface surebet-row row-enter group relative grid items-center gap-4 overflow-hidden rounded-xl border border-border-glow/40 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-glow hover:shadow-glow hover:brightness-110 @min-[1000px]:px-6",
                    b.id === bestId && "row-best",
                    cols,
                  )}
                >
                  <AccentBar tone={b.accent} />
                  <Match b={b} />
                  <BetDetails b={b} best={b.id === bestId} />
                  <div className="flex flex-col items-center gap-2">
                    <ValueGauge display={formatPct(pct)} label="profit" progress={gaugeProgress(pct)} size={104} />
                    <div className="flex items-center gap-1 @min-[1000px]:hidden">
                      <DetailsButton short className="px-2.5 py-1.5 text-[12.5px]" />
                      <StarButton on={!!starred[b.id]} onClick={() => toggle(b.id)} />
                    </div>
                  </div>
                  <div className="hidden items-center justify-center gap-3 @min-[1000px]:flex">
                    <DetailsButton className="px-4 py-2.5 text-[14.5px]" />
                    <StarButton on={!!starred[b.id]} onClick={() => toggle(b.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
