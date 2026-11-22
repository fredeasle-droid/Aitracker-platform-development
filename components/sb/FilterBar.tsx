"use client";
import { useState } from "react";
import { LayoutGrid, ChevronDown, SlidersHorizontal } from "lucide-react";
import { SoccerBallIcon, BasketballIcon, TennisBallIcon, PuckIcon, GamepadIcon } from "./SportIcons";
import { cn } from "@/lib/utils";
import { BookmakerFilter } from "./BookmakerFilter";
import { useLocale } from "@/components/locale-provider";

const chips = [
  { id: "all", label: "sbAll", icon: LayoutGrid },
  { id: "football", label: "sbFootball", icon: SoccerBallIcon },
  { id: "basketball", label: "sbBasketball", icon: BasketballIcon },
  { id: "tennis", label: "sbTennis", icon: TennisBallIcon },
  { id: "hockey", label: "sbIceHockey", icon: PuckIcon },
  { id: "esport", label: "sbEsport", icon: GamepadIcon },
] as const;

export function FilterBar() {
  const [active, setActive] = useState<string>("all");
  const { t } = useLocale();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {chips.map(({ id, label, icon: Icon }) => {
        const on = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "chip-surface flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all",
              on
                ? "bg-gradient-primary border-primary-glow text-primary-foreground shadow-glow"
                : "border-border text-foreground hover:-translate-y-px hover:border-border-glow hover:brightness-125",
            )}
          >
            <Icon className={cn("h-5 w-5 drop-shadow-[0_1px_2px_var(--surface-deep)]", on && "text-primary-foreground")} />
            {t(label)}
          </button>
        );
      })}
      </div>
      <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto sm:gap-2">
        <BookmakerFilter />
        <button className="flex flex-1 items-center justify-between gap-2 whitespace-nowrap chip-surface rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:border-border-glow sm:flex-none sm:px-4">
          {t("sbSortHighest")} <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
        <button aria-label={t("sbFilters")} className="chip-surface shrink-0 rounded-xl border border-border p-2.5 hover:border-border-glow">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
