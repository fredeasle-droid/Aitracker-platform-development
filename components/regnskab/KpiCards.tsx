"use client";
import { Coins, Landmark, Percent, Trophy } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";
import { formatKr, type Summary } from "@/lib/regnskab/surebet";

interface Kpi {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: "primary" | "success" | "ring";
}

const pctFormatter = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 });

export function KpiCards({ summary }: { summary: Summary }) {
  const kpis: Kpi[] = [
    { label: "Profit i dag", value: formatKr(summary.profitToday), hint: "Afgjorte surebets i dag", icon: Coins, tone: "primary" },
    { label: "Profit", value: formatKr(summary.profit), hint: "I valgt periode", icon: Trophy, tone: "success" },
    { label: "ROI", value: `${pctFormatter.format(summary.roi)}%`, hint: "Af afgjorte indsatser", icon: Percent, tone: "ring" },
    { label: "Aktuel bankroll", value: formatKr(summary.bankroll), hint: "Saldo hos bookmakere", icon: Landmark, tone: "primary" },
  ];
  const ringShare = Math.min(Math.max(summary.roi, 0), 100) / 100;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Nøgletal">
      {kpis.map((k) => (
        <article
          key={k.label}
          className="rg-glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary-glow/60 hover:rg-glow-primary"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            {k.tone === "ring" ? (
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="var(--secondary)" strokeWidth="6" fill="none" />
                  <circle
                    cx="32" cy="32" r="26" fill="none" strokeWidth="6" strokeLinecap="round"
                    stroke="var(--neon)" strokeDasharray={`${2 * Math.PI * 26 * ringShare} 999`}
                    className="drop-shadow-[0_0_6px_var(--neon)]"
                  />
                </svg>
                <Percent className="h-6 w-6 text-neon" />
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl",
                  k.tone === "success" ? "bg-success/15" : "bg-primary/15",
                )}
              >
                <k.icon
                  className={cn(
                    "h-9 w-9",
                    k.tone === "success"
                      ? "text-success drop-shadow-[0_0_10px_var(--success)]"
                      : "text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]",
                  )}
                />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <div className="font-display text-[28px] font-bold leading-tight tabular-nums">{k.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{k.hint}</div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
