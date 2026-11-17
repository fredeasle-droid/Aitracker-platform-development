"use client";
import { useState } from "react";
import { LayoutGrid, ChevronDown, SlidersHorizontal } from "lucide-react";
import { SoccerBallIcon, BasketballIcon, TennisBallIcon, PuckIcon, GamepadIcon } from "./SportIcons";
import { cn } from "@/lib/utils";
import { BookmakerFilter } from "./BookmakerFilter";

const chips = [
  { label: "Alle", icon: LayoutGrid },
  { label: "Fodbold", icon: SoccerBallIcon },
  { label: "Basketball", icon: BasketballIcon },
  { label: "Tennis", icon: TennisBallIcon },
  { label: "Ishockey", icon: PuckIcon },
  { label: "Esport", icon: GamepadIcon },
];

export function FilterBar() {
  const [active, setActive] = useState("Alle");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {chips.map(({ label, icon: Icon }) => {
        const on = active === label;
        return (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={cn(
              "chip-surface flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all",
              on
                ? "bg-gradient-primary border-primary-glow text-primary-foreground shadow-glow"
                : "border-border text-foreground hover:-translate-y-px hover:border-border-glow hover:brightness-125",
            )}
          >
            <Icon className={cn("h-5 w-5 drop-shadow-[0_1px_2px_var(--surface-deep)]", on && "text-primary-foreground")} />
            {label}
          </button>
        );
      })}
      </div>
      <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto sm:gap-2">
        <BookmakerFilter />
        <button className="flex flex-1 items-center justify-between gap-2 whitespace-nowrap chip-surface rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:border-border-glow sm:flex-none sm:px-4">
          Højeste værdi <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
        <button aria-label="Filtre" className="chip-surface shrink-0 rounded-xl border border-border p-2.5 hover:border-border-glow">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
