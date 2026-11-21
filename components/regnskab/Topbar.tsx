"use client";
import { CalendarDays, ChevronDown, Handshake } from "lucide-react";

import { Button } from "@/components/regnskab/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/regnskab/ui/dropdown-menu";
import type { ChartRange } from "@/lib/regnskab/surebet";

export const RANGE_LABELS: Record<ChartRange, string> = {
  "30": "Sidste 30 dage",
  "90": "Sidste 90 dage",
  "365": "Sidste år",
};

export function Topbar({ range, onRangeChange }: { range: ChartRange; onRangeChange: (r: ChartRange) => void }) {
  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-4">
        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary-glow/40 bg-primary/15 sm:flex rg-glow-primary">
          <Handshake className="h-9 w-9 text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Surebet-<span className="text-gradient-neon">regnskab</span></h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Oversigt over dine surebet investeringer og profit
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rg-glass h-11 self-start rounded-xl px-4 hover:border-primary-glow/60 hover:bg-accent">
            <CalendarDays className="h-4 w-4 text-neon" />
            {RANGE_LABELS[range]}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rg-glass w-48">
          <DropdownMenuRadioGroup value={range} onValueChange={(v) => onRangeChange(v as ChartRange)}>
            {(Object.keys(RANGE_LABELS) as ChartRange[]).map((r) => (
              <DropdownMenuRadioItem key={r} value={r}>
                {RANGE_LABELS[r]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
