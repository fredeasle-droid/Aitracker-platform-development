"use client";
import { Store } from "lucide-react";

import { BookmakerLogo } from "@/components/bookmaker-logo";
import { getBookmaker } from "@/lib/bookmakers";
import { cn } from "@/lib/utils";
import { BOOKMAKERS, type BankrollRow } from "@/lib/regnskab/surebet";
import { SectionHeader } from "./MobileUi";

/** Every supported bookmaker as a logo tile; the ones with a deposit are lit, tapping a tile starts a new deposit. */
export function MobileBookmakers({ rows, onAdd }: { rows: BankrollRow[]; onAdd: () => void }) {
  const active = new Set(rows.map((r) => r.bookmaker));

  return (
    <section className="rg-glass rounded-3xl p-4" aria-labelledby="m-bookmakers">
      <SectionHeader id="m-bookmakers" icon={Store} title="Bookmakere" count={BOOKMAKERS.length} />
      <p className="mt-2 text-xs text-muted-foreground">Tryk på en bookmaker for at skrive et indskud ind.</p>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {BOOKMAKERS.map((name) => {
          const on = active.has(name);
          return (
            <li key={name} className="min-w-0">
              <button
                type="button"
                onClick={onAdd}
                aria-label={on ? `${name} – har indskud` : `${name} – tilføj indskud`}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 rounded-2xl border px-1 pb-2 pt-2.5 transition active:scale-95",
                  on ? "border-primary-glow/50 bg-primary/10" : "border-border bg-secondary/40",
                )}
              >
                <span
                  className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10"
                  style={{ backgroundColor: getBookmaker(name).bg }}
                >
                  <BookmakerLogo name={name} className="size-full" />
                </span>
                <span className="w-full truncate text-center text-[10.5px] font-semibold leading-none text-foreground">{name}</span>
                <span className={cn("h-1 w-1 rounded-full", on ? "bg-success" : "bg-muted-foreground/40")} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
