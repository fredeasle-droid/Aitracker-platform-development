"use client";
import { useLocale } from "@/components/locale-provider";
import { useState, type ReactNode } from "react";
import { ArrowRight, Check, ChevronRight, CircleCheck, Clock, Info, Landmark, Trophy, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/regnskab/ui/drawer";
import {
  formatDate,
  formatKr,
  type Activity,
  type BankrollRow,
  type ChartRange,
  type Summary,
  type Surebet,
  type SurebetStatus,
} from "@/lib/regnskab/surebet";
import { BookmakerBadge } from "./BookmakerBadge";
import { RANGE_LABELS } from "./Topbar";
import { MobileChart } from "./MobileChart";
import { MobileBookmakers } from "./MobileBookmakers";
import { SurebetCards } from "./MobileBets";
import { AddButton, EmptyState, LivePill, SectionHeader } from "./MobileUi";

const dayLabel = new Intl.DateTimeFormat("da-DK", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** How many bets the overview shows before pointing to the bets tab. */
const OVERVIEW_BETS = 3;

const pct = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 });
export const signedKr = (v: number) => `${v > 0 ? "+" : ""}${formatKr(v)}`;

const ranges: { value: ChartRange; label: string }[] = [
  { value: "30", label: "30 dage" },
  { value: "90", label: "90 dage" },
  { value: "365", label: "1 år" },
];

function ActivityDot({ kind }: { kind: Activity["kind"] }) {
  const Icon = kind === "won" ? Check : kind === "lost" ? X : Info;
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        kind === "won" && "bg-success/15 text-success",
        kind === "info" && "bg-primary/20 text-primary-glow",
        kind === "lost" && "bg-destructive/15 text-destructive",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={3} />
    </span>
  );
}

function ActivityItem({ a }: { a: Activity }) {
  const { tx } = useLocale();
  return (
    <li className="flex items-start gap-3 py-2.5">
      <ActivityDot kind={a.kind} />
      <div className="min-w-0">
        <div className="text-sm leading-snug">{tx(a.text)}</div>
        <div className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">{formatDate(a.date)}</div>
      </div>
    </li>
  );
}

export function MobileOverview({
  summary,
  surebets,
  bankroll,
  activity,
  range,
  onRangeChange,
  today,
  showChart,
  openCount,
  inPlay,
  onGoBets,
  onGoBankroll,
  onAdd,
  onAddDeposit,
  onStatus,
  onDelete,
  scanCard,
}: {
  summary: Summary;
  surebets: Surebet[];
  bankroll: BankrollRow[];
  activity: Activity[];
  range: ChartRange;
  onRangeChange: (r: ChartRange) => void;
  today: string;
  showChart: boolean;
  openCount: number;
  inPlay: number;
  onGoBets: () => void;
  onGoBankroll: () => void;
  onAdd: () => void;
  onAddDeposit: () => void;
  onStatus: (id: string, status: SurebetStatus, winner?: 0 | 1) => void;
  onDelete: (id: string) => void;
  scanCard: ReactNode;
}) {
  const { tx } = useLocale();
  const [allOpen, setAllOpen] = useState(false);
  const ring = Math.min(Math.max(summary.roi, 0), 100) / 100;
  const C = 2 * Math.PI * 30;
  const sum = (f: (r: BankrollRow) => number) => bankroll.reduce((t, r) => t + f(r), 0);
  const totalAvailable = sum((r) => r.balance - r.active);

  return (
    <>
      <div>
        <h1 className="font-display text-[26px] font-bold leading-tight">
          {tx("Surebet-")}<span className="underline-neon text-gradient-neon">{tx("regnskab")}</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{tx("Oversigt over firmaets surebet investeringer og profit")}</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-primary-glow/40 rg-bg-gradient-pro p-5 rg-glow-primary" aria-label={tx("Nøgletal")}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-glow/25 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <LivePill>{tx("I dag ·")}{" "}{dayLabel.format(new Date(today))}</LivePill>
            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{tx("Profit i dag")}</div>
            <div
              className={cn(
                "mt-1 font-display text-[40px] font-bold leading-none tabular-nums",
                summary.profitToday > 0 && "text-success rg-text-glow-success",
                summary.profitToday < 0 && "text-destructive",
                summary.profitToday === 0 && "rg-text-glow",
              )}
            >
              {signedKr(summary.profitToday)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{tx("ROI af afgjorte indsatser:")}{" "}{pct.format(summary.roi)}%</div>
          </div>
          <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center" aria-label={`ROI ${pct.format(summary.roi)}%`}>
            <svg viewBox="0 0 72 72" className="absolute inset-0 -rotate-90 drop-shadow-[0_0_8px_var(--neon)]">
              <defs>
                <linearGradient id="m-roi-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--neon)" />
                  <stop offset="100%" stopColor="var(--neon-teal)" />
                </linearGradient>
              </defs>
              <circle cx="36" cy="36" r="30" stroke="var(--secondary)" strokeWidth="6" fill="none" />
              <circle cx="36" cy="36" r="30" fill="none" strokeWidth="6" strokeLinecap="round" stroke="url(#m-roi-ring)" strokeDasharray={`${C * ring} 999`} />
            </svg>
            <div className="text-center leading-none">
              <div className="text-sm font-bold tabular-nums text-neon">{pct.format(summary.roi)}%</div>
              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{tx("ROI")}</div>
            </div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2">
          <div className={cn("rounded-2xl border border-border bg-background/35 px-3.5 py-3", summary.profit > 0 && "rg-panel-success")}>
            <div className="text-[11px] text-muted-foreground">{tx("Profit ·")}{" "}{tx(RANGE_LABELS[range])}</div>
            <div className={cn("font-display text-lg font-bold tabular-nums", summary.profit > 0 && "text-success", summary.profit < 0 && "text-destructive")}>
              {signedKr(summary.profit)}
            </div>
            <div className="text-[10px] text-muted-foreground">{tx("Afgjorte surebets i perioden")}</div>
          </div>
          <div className="rounded-2xl border border-border bg-background/35 px-3.5 py-3">
            <div className="text-[11px] text-muted-foreground">{tx("Aktuel bankroll")}</div>
            <div className="font-display text-lg font-bold tabular-nums">{formatKr(summary.bankroll)}</div>
            <div className="text-[10px] text-muted-foreground">{tx("Saldo hos bookmakere")}</div>
          </div>
        </div>
      </section>

      {tx(scanCard)}

      <div role="tablist" aria-label={tx("Periode")} className="grid grid-cols-3 rounded-2xl border border-border bg-secondary/50 p-1">
        {ranges.map((t) => (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={range === t.value}
            onClick={() => onRangeChange(t.value)}
            className={cn(
              "rounded-xl py-2 text-sm font-semibold transition-all",
              range === t.value ? "rg-bg-gradient-primary text-primary-foreground rg-glow-primary" : "text-muted-foreground",
            )}
          >
            {tx(t.label)}
          </button>
        ))}
      </div>

      {showChart && <MobileChart surebets={surebets} range={range} today={today} />}

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Trophy, value: String(openCount), label: tx("Åbne surebets"), onClick: onGoBets, tone: "text-primary-glow" },
          { icon: Landmark, value: formatKr(inPlay), label: tx("I spil lige nu"), onClick: onGoBankroll, tone: "text-neon" },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={t.onClick}
            className="rg-glass group flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition-transform active:scale-[0.98]"
          >
            <div className="flex w-full items-center justify-between">
              <span className="icon-chip h-10 w-10">
                <t.icon className={cn("h-5 w-5", t.tone)} />
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold tabular-nums">{tx(t.value)}</div>
              <div className="text-xs text-muted-foreground">{tx(t.label)}</div>
            </div>
          </button>
        ))}
      </div>

      <section aria-labelledby="m-dine-surebets" className="flex flex-col gap-3">
        <SectionHeader id="m-dine-surebets" icon={CircleCheck} title={tx("Dine surebets")} count={surebets.length} action={<AddButton onClick={onAdd} />} />
        {surebets.length ? (
          <>
            <SurebetCards rows={surebets.slice(0, OVERVIEW_BETS)} onStatus={onStatus} onDelete={onDelete} />
            {surebets.length > OVERVIEW_BETS && (
              <button type="button" onClick={onGoBets} className="flex items-center justify-center gap-1 py-1 text-sm font-semibold text-primary-glow">
                {tx("Se alle")}{" "}{tx(surebets.length)} {" "}{tx("surebets")}{" "}<ArrowRight className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <EmptyState
            className="rg-glass rounded-3xl"
            icon={Trophy}
            title={tx("Ingen surebets endnu")}
            text={tx("Scan to kuponer eller skriv din første surebet ind.")}
            actionLabel="Tilføj surebet"
            onAction={onAdd}
          />
        )}
      </section>

      <section className="rg-glass rounded-3xl p-4" aria-labelledby="m-bankroll">
        <SectionHeader id="m-bankroll" icon={Landmark} title={tx("Bankroll per bookmaker")} action={<AddButton onClick={onAddDeposit} />} />
        {bankroll.length ? (
          <>
            <ul className="mt-2 divide-y divide-border/60">
              {bankroll.map((r) => {
                const free = r.balance - r.active;
                const share = r.balance > 0 ? Math.min(Math.max(free / r.balance, 0), 1) : 0;
                return (
                  <li key={r.bookmaker} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col items-start gap-1">
                        <BookmakerBadge name={r.bookmaker} className="min-w-[84px]" />
                        <span className="text-[11px] tabular-nums text-muted-foreground">{tx("Indskud")}{" "}{formatKr(r.deposited)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground">{tx("Tilgængelig")}</div>
                        <div className={cn("font-display text-lg font-bold tabular-nums", free < 0 && "text-destructive")}>{formatKr(free)}</div>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full rg-bg-gradient-primary" style={{ width: `${share * 100}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {tx("Saldo")}{" "}<span className="font-semibold tabular-nums text-foreground">{formatKr(r.balance)}</span>
                      </span>
                      <span>
                        {tx("I spil")}{" "}<span className="font-semibold tabular-nums text-foreground">{formatKr(r.active)}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className={cn("mt-1 flex items-center justify-between rounded-2xl border border-border px-3.5 py-3 text-sm", totalAvailable > 0 && "rg-panel-success")}>
              <div>
                <div className="font-semibold">{tx("I alt tilgængelig")}</div>
                <div className="text-[11px] tabular-nums text-muted-foreground">
                  {tx("Saldo")}{" "}{formatKr(sum((r) => r.balance))} {" "}{tx("· I spil")}{" "}{formatKr(sum((r) => r.active))}
                </div>
              </div>
              <span className={cn("font-display text-lg font-bold tabular-nums", totalAvailable < 0 ? "text-destructive" : "text-success")}>
                {formatKr(totalAvailable)}
              </span>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Landmark}
            title={tx("Ingen indskud endnu")}
            text={tx("Skriv din kapital ind for hver bookmaker, så holder vi styr på saldoen.")}
            actionLabel="Nyt indskud"
            onAction={onAddDeposit}
          />
        )}
      </section>

      <MobileBookmakers rows={bankroll} onAdd={onAddDeposit} />

      <section className="rg-glass rounded-3xl p-4">
        <SectionHeader
          icon={Clock}
          title={tx("Seneste aktivitet")}
          action={
            activity.length > 0 && (
              <button type="button" onClick={() => setAllOpen(true)} className="flex items-center gap-1 text-sm font-semibold text-primary-glow">
                {tx("Se alle")}{" "}<ArrowRight className="h-4 w-4" />
              </button>
            )
          }
        />
        {activity.length ? (
          <ul className="mt-1 divide-y divide-border/60">
            {activity.slice(0, 3).map((a) => (
              <ActivityItem key={a.id} a={a} />
            ))}
          </ul>
        ) : (
          <EmptyState icon={Clock} title={tx("Ingen aktivitet endnu")} text={tx("Når du tilføjer bets og indskud, kan du følge dem her.")} />
        )}
      </section>

      <Drawer open={allOpen} onOpenChange={setAllOpen}>
        <DrawerContent className="rg-glass max-h-[85dvh] border-border">
          <DrawerHeader className="text-left">
            <DrawerTitle className="font-display text-xl">{tx("Al aktivitet")}</DrawerTitle>
            <DrawerDescription>{tx(activity.length)} {" "}{tx("hændelser i dit surebet-regnskab")}</DrawerDescription>
          </DrawerHeader>
          <ul className="divide-y divide-border/60 overflow-y-auto px-4 pb-8">
            {activity.map((a) => (
              <ActivityItem key={a.id} a={a} />
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
}
