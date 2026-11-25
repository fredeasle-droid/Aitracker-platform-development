"use client";
import { useLocale } from "@/components/locale-provider";
import { useState, type ReactNode } from "react";
import { CircleCheck, Clock, PenLine, Trash2, Trophy, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/regnskab/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/regnskab/ui/drawer";
import { formatDate, formatKr, surebetMargin, type Surebet, type SurebetStatus } from "@/lib/regnskab/surebet";
import { BookmakerBadge } from "./BookmakerBadge";
import { signedKr } from "./MobileOverview";
import { EmptyState } from "./MobileUi";

const pct = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusStyle: Record<SurebetStatus, string> = {
  Vundet: "bg-success/15 text-success border-success/40",
  Åben: "bg-primary/20 text-primary-glow border-primary-glow/40",
  Tabt: "bg-destructive/15 text-destructive border-destructive/40",
};

/** Bet cards with a tap-to-act sheet (won at a bookmaker, open, lost, delete); used on the overview and the bets tab. */
export function SurebetCards({
  rows,
  onStatus,
  onDelete,
}: {
  rows: Surebet[];
  onStatus: (id: string, status: SurebetStatus, winner?: 0 | 1) => void;
  onDelete: (id: string) => void;
}) {
  const { tx } = useLocale();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = rows.find((r) => r.id === selectedId) ?? null;
  const act = (fn: () => void) => {
    fn();
    setSelectedId(null);
  };

  return (
    <>
      <ul className="flex flex-col gap-3">
        {rows.map((r) => {
          const profit = r.expected - r.stake;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                aria-label={`Handlinger for ${r.event}`}
                className="rg-glass w-full rounded-2xl p-4 text-left transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs tabular-nums text-muted-foreground">
                    {formatDate(r.date)}
                    <span className="rounded-md border border-neon/30 bg-neon/10 px-1.5 py-0.5 text-[10px] font-bold text-neon">
                      {pct.format(surebetMargin(r.odds[0], r.odds[1]))}{tx("% margin")}</span>
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold", statusStyle[r.status])}>{tx(r.status)}</span>
                </div>
                <div className="mt-1.5 truncate font-display text-base font-semibold">{tx(r.event)}</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {([0, 1] as const).map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/40 px-2.5 py-2",
                        r.status === "Vundet" && r.winner === i && "border-success/60 bg-success/10",
                      )}
                    >
                      <BookmakerBadge name={r.bookmakers[i]} className="h-6 px-2 text-[11px]" />
                      <span className="text-sm font-bold tabular-nums">{r.odds[i].toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                  <span className="flex flex-col text-xs text-muted-foreground">
                    <span>
                      {tx("Indsats")}{" "}<span className="font-semibold tabular-nums text-foreground">{formatKr(r.stake)}</span>
                    </span>
                    <span>
                      {tx("Forventet gevinst")}{" "}<span className="font-semibold tabular-nums text-foreground">{formatKr(r.expected)}</span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      "rounded-lg border px-2.5 py-1 font-display text-sm font-bold tabular-nums",
                      r.status === "Tabt" ? "border-destructive/40 bg-destructive/10 text-destructive" : "rg-panel-success text-success",
                    )}
                  >
                    {r.status === "Tabt" ? signedKr(-r.stake) : signedKr(profit)}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DrawerContent className="rg-glass border-border">
          {selected && (
            <>
              <DrawerHeader className="text-left">
                <DrawerTitle className="font-display text-xl">{tx(selected.event)}</DrawerTitle>
                <DrawerDescription>
                  {formatDate(selected.date)} {" "}{tx("· Indsats")}{" "}{formatKr(selected.stake)} {" "}{tx("· Status:")}{" "}{tx(selected.status)}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-2 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                {([0, 1] as const).map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => act(() => onStatus(selected.id, "Vundet", i))}
                    className="flex h-12 items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 text-sm font-semibold active:bg-accent"
                  >
                    <CircleCheck className="h-5 w-5 text-success" /> {" "}{tx("Vundet hos")}{" "}{tx(selected.bookmakers[i])}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => act(() => onStatus(selected.id, "Åben"))}
                  className="flex h-12 items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 text-sm font-semibold active:bg-accent"
                >
                  <Clock className="h-5 w-5 text-primary-glow" /> {" "}{tx("Markér som åben")}</button>
                <button
                  type="button"
                  onClick={() => act(() => onStatus(selected.id, "Tabt"))}
                  className="flex h-12 items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 text-sm font-semibold active:bg-accent"
                >
                  <XCircle className="h-5 w-5 text-destructive" /> {" "}{tx("Markér som tabt")}</button>
                <button
                  type="button"
                  onClick={() => act(() => onDelete(selected.id))}
                  className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 text-sm font-semibold text-destructive"
                >
                  <Trash2 className="h-5 w-5" /> {" "}{tx("Slet surebet")}</button>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

type Filter = "Alle" | SurebetStatus;

export function MobileBets({
  rows,
  onAdd,
  scanCard,
  onStatus,
  onDelete,
}: {
  rows: Surebet[];
  onAdd: () => void;
  scanCard: ReactNode;
  onStatus: (id: string, status: SurebetStatus, winner?: 0 | 1) => void;
  onDelete: (id: string) => void;
}) {
  const { tx } = useLocale();
  const [filter, setFilter] = useState<Filter>("Alle");
  const shown = filter === "Alle" ? rows : rows.filter((r) => r.status === filter);
  const filters: Filter[] = ["Alle", "Åben", "Vundet", "Tabt"];
  return (
    <>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-bold">
            {tx("Dine")}{" "}<span className="underline-neon text-gradient-neon">{tx("surebets")}</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{tx(rows.length)} {" "}{tx("registreret")}</p>
        </div>
        <Button variant="outline" onClick={onAdd} className="rg-glass h-10 rounded-xl px-3 text-sm">
          <PenLine className="h-4 w-4 text-neon" /> {" "}{tx("Tilføj")}</Button>
      </div>

      {tx(scanCard)}

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label={tx("Filtrér surebets")}>
        {filters.map((f) => {
          const n = f === "Alle" ? rows.length : rows.filter((r) => r.status === f).length;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                filter === f ? "border-primary-glow rg-bg-gradient-primary text-primary-foreground rg-glow-primary" : "border-border bg-secondary/50 text-muted-foreground",
              )}
            >
              {f === "Åben" ? tx("Åbne") : f}
              <span className="text-xs opacity-75 tabular-nums">{tx(n)}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          className="rg-glass rounded-3xl py-10"
          icon={Trophy}
          title={rows.length ? tx("Ingen i dette filter") : tx("Ingen surebets endnu")}
          text={tx("Scan to kuponer ovenfor eller skriv din første surebet ind.")}
          actionLabel="Tilføj surebet"
          onAction={onAdd}
        />
      ) : (
        <SurebetCards rows={shown} onStatus={onStatus} onDelete={onDelete} />
      )}

    </>
  );
}
