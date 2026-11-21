"use client";
import { CalendarDays, ChevronDown, LayoutDashboard, Landmark, LogOut, Plus, Settings, Trophy, User } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/regnskab/ui/dropdown-menu";
import type { ChartRange } from "@/lib/regnskab/surebet";
import { LogoMark } from "./icons";
import { RANGE_LABELS } from "./Topbar";

export type MobileTab = "overblik" | "bets" | "bankroll";

const SHORT_RANGE: Record<ChartRange, string> = { "30": "30 dage", "90": "90 dage", "365": "1 år" };

export function MobileHeader({ range, onRangeChange }: { range: ChartRange; onRangeChange: (r: ChartRange) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <LogoMark width={30} height={27} className="drop-shadow-[0_0_10px_var(--primary)]" />
          <div className="font-display text-lg font-bold tracking-tight">
            BetTracker<span className="text-primary-glow">AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Periode: ${RANGE_LABELS[range]}`}
              className="glass flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold"
            >
              <CalendarDays className="h-3.5 w-3.5 text-neon" />
              {SHORT_RANGE[range]}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass w-44">
            <DropdownMenuRadioGroup value={range} onValueChange={(v) => onRangeChange(v as ChartRange)}>
              {(Object.keys(RANGE_LABELS) as ChartRange[]).map((r) => (
                <DropdownMenuRadioItem key={r} value={r}>
                  {RANGE_LABELS[r]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Min konto"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground ring-2 ring-primary-glow/50 glow-primary"
            >
              <User className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass w-52">
            <DropdownMenuLabel>
              Min konto
              <span className="block text-xs font-normal text-muted-foreground">Administrator</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast("Profil åbner snart")}>
              <User className="h-4 w-4" /> Profil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast("Indstillinger åbner snart")}>
              <Settings className="h-4 w-4" /> Indstillinger
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast("Du er logget ud (demo)")} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Log ud
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

const tabs: { value: MobileTab; label: string; icon: typeof Trophy }[] = [
  { value: "overblik", label: "Overblik", icon: LayoutDashboard },
  { value: "bets", label: "Bets", icon: Trophy },
  { value: "bankroll", label: "Bankroll", icon: Landmark },
];

function TabButton({ active, label, icon: Icon, onClick }: { active: boolean; label: string; icon: typeof Trophy; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-semibold transition-colors",
        active ? "text-neon" : "text-muted-foreground",
      )}
    >
      {active && <span className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-gradient-neon shadow-[var(--shadow-neon)]" />}
      <Icon className={cn("h-[22px] w-[22px]", active && "drop-shadow-[0_0_8px_var(--neon)]")} />
      {label}
    </button>
  );
}

export function BottomNav({
  tab,
  onTab,
  onNew,
}: {
  tab: MobileTab;
  onTab: (t: MobileTab) => void;
  onNew: () => void;
}) {
  const [first, second, third] = tabs as [(typeof tabs)[0], (typeof tabs)[0], (typeof tabs)[0]];
  return (
    <nav
      aria-label="Bundmenu"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sidebar/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="flex items-end">
        <TabButton active={tab === first.value} label={first.label} icon={first.icon} onClick={() => onTab(first.value)} />
        <TabButton active={tab === second.value} label={second.label} icon={second.icon} onClick={() => onTab(second.value)} />
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={onNew}
            aria-label="Ny surebet"
            className="-mt-7 mb-2 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gradient-primary text-primary-foreground ring-4 ring-background glow-primary transition-transform active:scale-95"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>
        <TabButton active={tab === third.value} label={third.label} icon={third.icon} onClick={() => onTab(third.value)} />
      </div>
    </nav>
  );
}
