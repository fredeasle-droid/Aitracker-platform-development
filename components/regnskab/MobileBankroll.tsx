"use client";
import { Landmark, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/regnskab/ui/button";
import { formatKr, type BankrollRow } from "@/lib/regnskab/surebet";
import { BookmakerBadge } from "./BookmakerBadge";
import { EmptyState } from "./MobileUi";

export function MobileBankroll({ rows, onAdd }: { rows: BankrollRow[]; onAdd: () => void }) {
  const sum = (f: (r: BankrollRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  const available = sum((r) => r.balance - r.active);

  return (
    <>
      <div>
        <h1 className="font-display text-[26px] font-bold">
          <span className="underline-neon text-gradient-neon">Bankroll</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Din saldo hos hver bookmaker</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-primary-glow/40 bg-gradient-pro p-5 glow-primary">
        <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-neon/15 blur-3xl" />
        <div className="relative text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Tilgængelig at spille for</div>
        <div className={cn("relative mt-1 font-display text-[36px] font-bold leading-none tabular-nums text-glow", available < 0 && "text-destructive")}>
          {formatKr(available)}
        </div>
        <div className="relative mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-background/30 text-center">
          {[
            ["Indskud", sum((r) => r.deposited)],
            ["Saldo", sum((r) => r.balance)],
            ["I spil", sum((r) => r.active)],
          ].map(([label, v]) => (
            <div key={label} className="px-2 py-3">
              <div className="text-[11px] text-muted-foreground">{label}</div>
              <div className="text-sm font-bold tabular-nums">{formatKr(Number(v))}</div>
            </div>
          ))}
        </div>
      </section>

      <Button onClick={onAdd} className="h-12 rounded-2xl bg-gradient-primary text-base font-semibold text-primary-foreground glow-primary">
        <Plus className="h-5 w-5" /> Tilføj indskud
      </Button>

      {rows.length === 0 ? (
        <EmptyState
          className="glass rounded-3xl py-10"
          icon={Landmark}
          title="Ingen indskud endnu"
          text="Skriv din kapital ind for hver bookmaker, så holder vi styr på saldoen."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => {
            const free = r.balance - r.active;
            const share = r.balance > 0 ? Math.min(Math.max(free / r.balance, 0), 1) : 0;
            return (
              <li key={r.bookmaker} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col items-start gap-1">
                    <BookmakerBadge name={r.bookmaker} className="min-w-[84px]" />
                    <span className="text-[11px] tabular-nums text-muted-foreground">Indskud {formatKr(r.deposited)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-muted-foreground">Tilgængelig</div>
                    <div className={cn("font-display text-xl font-bold tabular-nums", free < 0 && "text-destructive")}>{formatKr(free)}</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${share * 100}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>
                    Saldo <span className="font-semibold tabular-nums text-foreground">{formatKr(r.balance)}</span>
                  </span>
                  <span>
                    I spil <span className="font-semibold tabular-nums text-foreground">{formatKr(r.active)}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
