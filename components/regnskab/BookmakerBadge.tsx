"use client";
import { BookmakerLogo } from "@/components/bookmaker-logo";
import { getBookmaker } from "@/lib/bookmakers";
import { cn } from "@/lib/utils";
import type { Bookmaker } from "@/lib/regnskab/surebet";

export function BookmakerBadge({ name, className }: { name: Bookmaker; className?: string }) {
  const brand = getBookmaker(name);
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-[72px] items-center gap-2 rounded-md border border-border bg-secondary/60 py-0 pl-1 pr-2.5 font-display text-[13px] font-bold tracking-tight text-foreground",
        className,
      )}
    >
      <span
        className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px]"
        style={{ backgroundColor: brand.bg }}
      >
        <BookmakerLogo name={name} className="size-5 text-[9px]" />
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}
