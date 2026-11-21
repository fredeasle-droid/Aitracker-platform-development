"use client";
import { cn } from "@/lib/utils";
import type { Bookmaker } from "@/lib/regnskab/surebet";

const styles: Record<Bookmaker, string> = {
  bet365: "bg-bet365 text-bet365-foreground",
  Unibet: "bg-unibet text-unibet-foreground border border-success/40",
  betfair: "bg-betfair text-betfair-foreground",
  "Danske Spil": "bg-danskespil text-danskespil-foreground",
};

export function BookmakerBadge({ name, className }: { name: Bookmaker; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-[72px] items-center justify-center rounded-md px-2 font-display text-[13px] font-extrabold tracking-tight",
        name === "Unibet" && "uppercase tracking-wider text-[11px]",
        styles[name],
        className,
      )}
    >
      {name === "Unibet" ? (
        <span className="flex flex-col items-center leading-none">
          UNIBET
          <span className="mt-0.5 h-[2px] w-8 rounded-full bg-success" />
        </span>
      ) : (
        name
      )}
    </span>
  );
}
