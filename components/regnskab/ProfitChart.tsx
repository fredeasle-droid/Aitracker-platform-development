"use client";
import { useMemo } from "react";
import { useLocale } from "@/components/locale-provider";
import { BarChart3 } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,

  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { cn } from "@/lib/utils";
import { buildProfitSeries, formatKr, rangeStart, type ChartRange, type Surebet } from "@/lib/regnskab/surebet";

const tabs: { value: ChartRange; label: string }[] = [
  { value: "30", label: "30 dage" },
  { value: "90", label: "90 dage" },
  { value: "365", label: "1 år" },
];

const shortKr = (v: number) => `${new Intl.NumberFormat("da-DK").format(v)} kr.`;

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rg-glass rounded-xl px-4 py-3 text-sm">
      <div className="mb-1.5 font-semibold">{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.dataKey === "profit" ? "Profit" : "Investering"}</span>
          <span className="ml-auto pl-4 font-semibold tabular-nums">{formatKr(Number(p.value))}</span>
        </div>
      ))}
    </div>
  );
}

export function ProfitChart({
  surebets,
  today,
  range,
  onRangeChange,
}: {
  surebets: Surebet[];
  today: string;
  range: ChartRange;
  onRangeChange: (r: ChartRange) => void;
}) {
  const { tx } = useLocale();
  const data = useMemo(() => buildProfitSeries(surebets, range, today), [surebets, range, today]);
  const hasData = surebets.some((surebet) => surebet.date >= rangeStart(range, today) && surebet.date <= today);
  const last = data[data.length - 1];

  return (
    <section className="rg-glass flex flex-col rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]" />
          <h2 className="font-display text-xl font-semibold">{tx("Udvikling i profit")}</h2>
        </div>
        <div role="tablist" aria-label={tx("Periode")} className="flex rounded-xl border border-border bg-secondary/50 p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              role="tab"
              type="button"
              aria-selected={range === t.value}
              onClick={() => onRangeChange(t.value)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                range === t.value
                  ? "rg-bg-gradient-primary text-primary-foreground rg-glow-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <>
          <div className="mt-3 flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-chart-1 shadow-[0_0_8px_var(--chart-1)]" /> {tx("Profit")}
              {last && <span className="font-semibold text-primary-glow">{formatKr(last.profit)}</span>}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-chart-2 shadow-[0_0_8px_var(--chart-2)]" /> {tx("Investering")}
              {last && <span className="font-semibold text-success">{formatKr(last.investering)}</span>}
            </span>
          </div>

          <div className="mt-2 h-[250px] min-h-[250px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fill-profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fill-invest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="0" vertical />
                <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={24} />
                <YAxis yAxisId="profit" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={shortKr} width={78} />
                <YAxis yAxisId="invest" orientation="right" hide />
                <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ stroke: "var(--neon)", strokeOpacity: 0.4 }} />
                <Area yAxisId="invest" type="monotone" dataKey="investering" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#fill-invest)" dot={{ r: 3, fill: "var(--chart-2)", strokeWidth: 0 }} activeDot={{ r: 6, fill: "var(--chart-2)", stroke: "var(--background)", strokeWidth: 2 }} />
                <Area yAxisId="profit" type="monotone" dataKey="profit" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#fill-profit)" dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }} activeDot={{ r: 6, fill: "var(--chart-1)", stroke: "var(--background)", strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground" role="status">
          {tx("Når du har registreret surebets, vises udviklingen i profit og investering her.")}
        </p>
      )}
    </section>
  );
}
