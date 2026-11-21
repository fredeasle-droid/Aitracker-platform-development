"use client";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { LineChart } from "lucide-react";

import { SectionHeader } from "./MobileUi";
import { buildProfitSeries, formatKr, type ChartRange, type Surebet } from "@/lib/regnskab/surebet";

export function MobileChart({ surebets, range, today }: { surebets: Surebet[]; range: ChartRange; today: string }) {
  const data = useMemo(() => buildProfitSeries(surebets, range, today), [surebets, range, today]);
  const last = data[data.length - 1];

  return (
    <section className="rg-glass rounded-3xl p-4">
      <SectionHeader icon={LineChart} title="Udvikling i profit" />
      <div className="mt-3 flex gap-2 text-xs">
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2.5 py-1">
          <span className="h-2 w-2 rounded-full bg-chart-1 shadow-[0_0_8px_var(--chart-1)]" />
          <span className="text-muted-foreground">Profit</span>
          <span className="font-semibold tabular-nums text-primary-glow">{formatKr(last?.profit ?? 0)}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2.5 py-1">
          <span className="h-2 w-2 rounded-full bg-chart-2 shadow-[0_0_8px_var(--chart-2)]" />
          <span className="text-muted-foreground">Investering</span>
          <span className="font-semibold tabular-nums text-success">{formatKr(last?.investering ?? 0)}</span>
        </span>
      </div>
      <div className="-mx-1 mt-3 h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="m-fill-profit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="m-fill-invest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v: number) => new Intl.NumberFormat("da-DK", { notation: "compact", maximumFractionDigits: 1 }).format(v)} />
            <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={36} />
            <Tooltip
              cursor={{ stroke: "var(--neon)", strokeOpacity: 0.4 }}
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              formatter={(v, k) => [formatKr(Number(v)), k === "profit" ? "Profit" : "Investering"]}
            />
            <Area type="monotone" dataKey="investering" stroke="var(--chart-2)" strokeWidth={2} fill="url(#m-fill-invest)" dot={false} />
            <Area type="monotone" dataKey="profit" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#m-fill-profit)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
