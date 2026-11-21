"use client";
import { LayoutDashboard, Landmark, Plus, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

export type MobileTab = "overblik" | "bets" | "bankroll";

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
