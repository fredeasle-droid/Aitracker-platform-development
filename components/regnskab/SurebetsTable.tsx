"use client";
import { useLocale } from "@/components/locale-provider";
import { CircleCheck, MoreHorizontal, Plus, Trash2, XCircle, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/regnskab/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/regnskab/ui/dropdown-menu";
import { formatDate, formatKr, type Surebet, type SurebetStatus } from "@/lib/regnskab/surebet";
import { BookmakerBadge } from "./BookmakerBadge";

const statusStyle: Record<SurebetStatus, string> = {
  Vundet: "bg-success text-success-foreground shadow-[0_0_14px_var(--success)]",
  Åben: "bg-primary text-primary-foreground shadow-[0_0_14px_var(--primary)]",
  Tabt: "bg-destructive text-destructive-foreground shadow-[0_0_14px_var(--destructive)]",
};

export function SurebetsTable({
  rows,
  onAdd,
  onStatus,
  onDelete,
}: {
  rows: Surebet[];
  onAdd: () => void;
  onStatus: (id: string, status: SurebetStatus, winner?: 0 | 1) => void;
  onDelete: (id: string) => void;
}) {
  const { tx } = useLocale();
  return (
    <section className="rg-glass rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CircleCheck className="h-8 w-8 text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]" />
          <h2 className="font-display text-xl font-semibold">{tx("Dine surebets")}</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{tx(rows.length)}</span>
        </div>
        <Button onClick={onAdd} className="rounded-xl rg-bg-gradient-primary font-semibold text-primary-foreground rg-glow-primary hover:opacity-90">
          <Plus className="h-4 w-4" /> {" "}{tx("Tilføj Surebet")}</Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              {[tx("Dato"), tx("Kamp / Event"), tx("Bookmakere"), tx("Odds"), tx("Indsats"), tx("Forventet gevinst"), tx("Status"), tx("Handling")].map((h) => (
                <th key={h} className={cn("px-3 pb-3 font-medium", h === "Handling" && "text-right")}>
                  {tx(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-primary/5">
                <td className="px-3 py-3 tabular-nums">{formatDate(r.date)}</td>
                <td className="px-3 py-3 font-medium">{tx(r.event)}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <BookmakerBadge name={r.bookmakers[0]} />
                    <BookmakerBadge name={r.bookmakers[1]} />
                  </div>
                </td>
                <td className="px-3 py-3 tabular-nums">
                  {r.odds[0].toFixed(2)} / {r.odds[1].toFixed(2)}
                </td>
                <td className="px-3 py-3 tabular-nums">{formatKr(r.stake)}</td>
                <td className="px-3 py-3 tabular-nums">{formatKr(r.expected)}</td>
                <td className="px-3 py-3">
                  <span className={cn("inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-xs font-bold", statusStyle[r.status])}>
                    {tx(r.status)}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-12 rounded-lg border-border bg-secondary/60" aria-label={`Handlinger for ${r.event}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rg-glass w-56">
                      {([0, 1] as const).map((i) => (
                        <DropdownMenuItem key={i} onSelect={() => onStatus(r.id, "Vundet", i)}>
                          <CircleCheck className="h-4 w-4 text-success" /> {" "}{tx("Vundet hos")}{" "}{tx(r.bookmakers[i])}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onSelect={() => onStatus(r.id, "Åben")}>
                        <Clock className="h-4 w-4 text-primary-glow" /> {" "}{tx("Markér som åben")}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onStatus(r.id, "Tabt")}>
                        <XCircle className="h-4 w-4 text-destructive" /> {" "}{tx("Markér som tabt")}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => onDelete(r.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4" /> {" "}{tx("Slet")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                  {tx("Ingen surebets endnu – tilføj din første.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
