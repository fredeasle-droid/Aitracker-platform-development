'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SeoDay } from '@/lib/seo/dashboard'

const METRICS = [
  { key: 'clicks', label: 'Klik' },
  { key: 'impressions', label: 'Visninger' },
  { key: 'position', label: 'Position' },
] as const

type MetricKey = (typeof METRICS)[number]['key']

const shortDate = (value: string) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'short' }).format(new Date(value))

export function SeoTrendChart({ data }: { data: SeoDay[] }) {
  const [metric, setMetric] = useState<MetricKey>('clicks')

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Vælg måling" className="flex gap-1 rounded-xl border border-border bg-background/60 p-1">
        {METRICS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={metric === item.key}
            onClick={() => setMetric(item.key)}
            className={`min-h-11 flex-1 rounded-lg text-sm font-semibold transition-colors ${
              metric === item.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-56 w-full lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="seoFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={28} />
            <YAxis
              reversed={metric === 'position'}
              allowDecimals={metric === 'position'}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={44}
              domain={metric === 'position' ? [1, 'auto'] : [0, 'auto']}
            />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--foreground)' }}
              labelFormatter={(value) => shortDate(String(value))}
              formatter={(value) => [metric === 'position' ? Number(value).toFixed(1) : Number(value).toLocaleString('da-DK'), METRICS.find((m) => m.key === metric)?.label]}
            />
            <Area type="monotone" dataKey={metric} stroke="var(--primary)" strokeWidth={2} fill="url(#seoFill)" connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
