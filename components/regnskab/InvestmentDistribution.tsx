"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/locale-provider";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatKr, surebetStakes, type Surebet } from "@/lib/regnskab/surebet";

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function InvestmentDistribution({ surebets }: { surebets: Surebet[] }) {
  const { tx } = useLocale();
  const data = useMemo(() => {
    const totals = new Map<string, number>();

    for (const surebet of surebets) {
      const [stakeA, stakeB] = surebetStakes(surebet.stake, surebet.odds[0], surebet.odds[1]);
      totals.set(surebet.bookmakers[0], (totals.get(surebet.bookmakers[0]) ?? 0) + stakeA);
      totals.set(surebet.bookmakers[1], (totals.get(surebet.bookmakers[1]) ?? 0) + stakeB);
    }

    const ranked: { label: string; value: number }[] = [...totals.entries()]
      .map(([label, value]) => ({ label, value: Math.round(value) }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
    const visible = ranked.slice(0, 4);
    const remaining = ranked.slice(4).reduce((sum, item) => sum + item.value, 0);

    if (remaining > 0) visible.push({ label: "Øvrige bookmakere", value: remaining });
    return visible.map((item, index) => ({ ...item, color: colors[index % colors.length] }));
  }, [surebets]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartLabel = data.map((item) => `${item.label}: ${formatKr(item.value)}`).join(", ");

  return (
    <section className="rg-glass flex min-w-0 flex-col rounded-2xl p-4 sm:p-6" aria-labelledby="investment-distribution-title">
      <header className="flex items-center gap-3">
        <PieChartIcon className="size-6 shrink-0 text-primary-glow" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="investment-distribution-title" className="font-display text-lg font-semibold sm:text-xl">
            {tx("Fordeling af investeringer")}
          </h2>
          <p className="text-sm text-muted-foreground">{tx("Fordelt efter bookmaker og indsats")}</p>
        </div>
      </header>

      {data.length > 0 ? (
        <>
          <div className="relative mx-auto mt-3 aspect-square w-full max-w-[15rem]" role="img" aria-label={`Investeringsfordeling: ${chartLabel}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value) => formatKr(Number(value))}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
                />
                <Pie data={data} dataKey="value" nameKey="label" innerRadius="66%" outerRadius="92%" paddingAngle={3} stroke="none">
                  {data.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground">{tx("Samlet indsats")}</span>
              <span className="font-display text-xl font-bold tabular-nums">{formatKr(total)}</span>
            </div>
          </div>
          <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {data.map((item) => (
              <li key={item.label} className="flex min-w-0 items-center gap-2 text-sm">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="shrink-0 font-medium tabular-nums">{formatKr(item.value)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground" role="status">
          {tx("Fordelingen vises, når du har registreret din første surebet.")}
        </p>
      )}
    </section>
  );
}
