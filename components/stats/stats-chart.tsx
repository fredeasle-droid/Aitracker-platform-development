'use client'

import { Area, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatInt, formatSigned } from '@/lib/odds'

export type SeriesPoint = { label: string; profit: number; investment: number }

const PROFIT = '#3d8bff'
const INVEST = '#2ee6a6'

function ChartTooltip({
  active,
  payload,
  label,
  profitLabel,
  investmentLabel,
}: {
  active?: boolean
  payload?: readonly { dataKey?: unknown; value?: unknown; color?: string }[]
  label?: string | number
  profitLabel: string
  investmentLabel: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel rounded-xl px-3.5 py-2.5 text-[13px]">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-[#b3c0d9]">{p.dataKey === 'profit' ? profitLabel : investmentLabel}</span>
          <span className="ml-auto pl-4 font-semibold tabular-nums">
            {p.dataKey === 'profit' ? formatSigned(Number(p.value)) : formatInt(Number(p.value))} DKK
          </span>
        </p>
      ))}
    </div>
  )
}

export function StatsChart({
  data,
  profitLabel,
  investmentLabel,
}: {
  data: SeriesPoint[]
  profitLabel: string
  investmentLabel: string
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fill-profit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PROFIT} stopOpacity={0.45} />
            <stop offset="100%" stopColor={PROFIT} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fill-invest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INVEST} stopOpacity={0.18} />
            <stop offset="100%" stopColor={INVEST} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#183252" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#8aa0c4', fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={28} />
        <YAxis
          yAxisId="profit"
          tick={{ fill: '#8aa0c4', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={56}
          tickFormatter={(v: number) => formatInt(v)}
        />
        <YAxis yAxisId="invest" orientation="right" hide />
        <Tooltip
          cursor={{ stroke: '#22d3ee', strokeOpacity: 0.4 }}
          content={(p) => (
            <ChartTooltip
              active={p.active}
              payload={p.payload}
              label={p.label}
              profitLabel={profitLabel}
              investmentLabel={investmentLabel}
            />
          )}
        />
        <Area
          yAxisId="invest"
          type="monotone"
          dataKey="investment"
          stroke={INVEST}
          strokeWidth={2.5}
          fill="url(#fill-invest)"
          dot={false}
          activeDot={{ r: 5, fill: INVEST, stroke: '#050b17', strokeWidth: 2 }}
        />
        <Area
          yAxisId="profit"
          type="monotone"
          dataKey="profit"
          stroke={PROFIT}
          strokeWidth={2.5}
          fill="url(#fill-profit)"
          dot={false}
          activeDot={{ r: 5, fill: PROFIT, stroke: '#050b17', strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
