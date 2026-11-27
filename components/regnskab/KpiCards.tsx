"use client";
import { useLocale } from "@/components/locale-provider";
import { Coins, Landmark, Percent, Trophy } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";
import { formatKr } from "@/lib/regnskab/surebet";

interface Kpi {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: "primary" | "success" | "danger";
}

export type DashboardSummary = {
  invested: number;
  profit: number;
  roi: number;
  bankroll: number;
  surebetCount: number;
  openCount: number;
  bookmakerCount: number;
};

const pctFormatter = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 });

export function KpiCards({ summary }: { summary: DashboardSummary }) {
  const { tx } = useLocale();
  const kpis: Kpi[] = [
    { label: tx("Samlet investering"), value: formatKr(summary.invested), hint: `${summary.surebetCount} ${tx("surebets")} · ${summary.openCount} ${tx("åbne")}`, icon: Coins, tone: "primary" },
    { label: tx("Samlet profit"), value: formatKr(summary.profit), hint: tx("Afsluttede surebets"), icon: Trophy, tone: summary.profit < 0 ? "danger" : "success" },
    { label: tx("ROI"), value: `${pctFormatter.format(summary.roi)}%`, hint: tx("Profit i forhold til afgjorte indsatser"), icon: Percent, tone: "primary" },
    { label: tx("Aktuel bankroll"), value: formatKr(summary.bankroll), hint: `${summary.bookmakerCount} ${tx("bookmakere")}`, icon: Landmark, tone: "primary" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={tx("Nøgletal")}>
      {kpis.map((k) => (
        <article key={k.label} className="rg-glass flex min-w-0 items-start justify-between gap-3 rounded-2xl p-4 sm:p-5">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">{k.label}</div>
            <div className="mt-2 font-display text-2xl font-bold leading-tight tabular-nums sm:text-[28px]">{k.value}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{k.hint}</div>
          </div>
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", k.tone === "success" ? "bg-success/15 text-success" : k.tone === "danger" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary-glow")}>
            <k.icon className="size-5" aria-hidden="true" />
          </span>
        </article>
      ))}
    </section>
  );
}
