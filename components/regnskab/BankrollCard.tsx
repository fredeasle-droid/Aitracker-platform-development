"use client";
import { Landmark, Plus } from "lucide-react";

import { Button } from "@/components/regnskab/ui/button";
import { cn } from "@/lib/utils";
import { formatKr, type BankrollRow } from "@/lib/regnskab/surebet";
import { BookmakerBadge } from "./BookmakerBadge";

export function BankrollCard({ rows, onAdd }: { rows: BankrollRow[]; onAdd: () => void }) {
  const sum = (f: (r: BankrollRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  const totalAvailable = sum((r) => r.balance - r.active);
  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Landmark className="h-8 w-8 text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]" />
          <h2 className="font-display text-xl font-semibold">Bankroll per bookmaker</h2>
        </div>
        <Button onClick={onAdd} className="rounded-xl bg-gradient-primary font-semibold text-primary-foreground glow-primary hover:opacity-90">
          <Plus className="h-4 w-4" /> Tilføj
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[380px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2.5 text-left font-medium">Bookmaker</th>
              <th className="pb-2.5 text-right font-medium">Saldo</th>
              <th className="pb-2.5 text-right font-medium">I spil</th>
              <th className="pb-2.5 text-right font-medium">Tilgængelig</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const available = r.balance - r.active;
              const share = r.balance > 0 ? Math.min(Math.max(available / r.balance, 0), 1) : 0;
              return (
                <tr key={r.bookmaker}>
                  <td className="py-2">
                    <div className="flex flex-col items-start gap-1">
                      <BookmakerBadge name={r.bookmaker} className="min-w-[84px]" />
                      <span className="text-[11px] text-muted-foreground tabular-nums">Indskud {formatKr(r.deposited)}</span>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums">{formatKr(r.balance)}</td>
                  <td className="py-2 text-right tabular-nums">{formatKr(r.active)}</td>
                  <td className="py-2 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn("tabular-nums font-semibold", available < 0 && "text-destructive")}>{formatKr(available)}</span>
                      <span className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
                        <span className="block h-full rounded-full bg-gradient-primary" style={{ width: `${share * 100}%` }} />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  Ingen indskud endnu – tryk på "Tilføj" for at skrive din kapital ind.
                </td>
              </tr>
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t border-border">
                <td className="pt-3">
                  <div className="font-semibold">I alt</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">Indskud {formatKr(sum((r) => r.deposited))}</div>
                </td>
                <td className="pt-3 text-right font-semibold tabular-nums">{formatKr(sum((r) => r.balance))}</td>
                <td className="pt-3 text-right font-semibold tabular-nums">{formatKr(sum((r) => r.active))}</td>
                <td className={cn("pt-3 text-right font-semibold tabular-nums", totalAvailable < 0 ? "text-destructive" : "text-success")}>
                  {formatKr(totalAvailable)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}
