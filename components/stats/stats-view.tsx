'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, ChevronRight, Clock, Database, History, Info, Target, TrendingUp } from 'lucide-react'
import { BarsIcon, SoccerBallIcon } from '@/components/icons'
import { BetSheet } from '@/components/stats/bet-sheet'
import type { BetRow } from '@/lib/data'
import { formatInt, formatSigned } from '@/lib/odds'
import { cn } from '@/lib/utils'

const PERIODS = [
  { id: 7, label: '7 dage' },
  { id: 30, label: '30 dage' },
  { id: 90, label: '90 dage' },
  { id: 0, label: 'Alle' },
] as const

const DAY = 86_400_000

function summarize(list: BetRow[]) {
  const profit = list.reduce((s, b) => s + (b.profit ?? 0), 0)
  const staked = list.reduce((s, b) => s + b.stake, 0)
  const won = list.filter((b) => b.status === 'won')
  const lost = list.length - won.length
  const roi = staked > 0 ? (profit / staked) * 100 : 0
  const avg = won.length > 0 ? won.reduce((s, b) => s + ((b.profit ?? 0) / b.stake) * 100, 0) / won.length : 0
  const winRate = list.length > 0 ? (won.length / list.length) * 100 : 0
  return { profit, roi, avg, winRate, won: won.length, lost }
}

function fmt1(n: number) {
  return n.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function Trend({ value, unit = '%' }: { value: number | null; unit?: string }) {
  if (value === null || !Number.isFinite(value)) return <span className="text-[13px] text-muted-foreground">Ingen sammenligning</span>
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={cn('flex items-center gap-1 text-[14px] font-medium', up ? 'text-success' : 'text-destructive')}>
      <Icon className="size-4" />
      {up ? '+' : '-'}
      {fmt1(Math.abs(value))}
      {unit}
    </span>
  )
}

function StatCard({
  tone,
  icon,
  label,
  hint,
  value,
  children,
}: {
  tone: 'green' | 'blue' | 'purple'
  icon: React.ReactNode
  label: string
  hint: string
  value: React.ReactNode
  children: React.ReactNode
}) {
  const tones = {
    green: 'border-success/40 bg-[linear-gradient(135deg,rgba(18,80,58,0.55),rgba(8,24,30,0.9))]',
    blue: 'border-primary/40 bg-[linear-gradient(135deg,rgba(14,40,90,0.6),rgba(8,18,38,0.9))]',
    purple: 'border-[#a35cff]/45 bg-[linear-gradient(135deg,rgba(60,28,110,0.55),rgba(16,14,40,0.9))]',
  }
  const iconTones = {
    green: 'bg-success/15 text-success',
    blue: 'bg-primary/20 text-primary',
    purple: 'bg-[#a35cff]/20 text-[#b57bff]',
  }
  return (
    <div className={cn('flex gap-2.5 rounded-2xl border p-3', tones[tone])}>
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', iconTones[tone])}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[13px] text-[#d5ddef]">
          {label}
          <Info className="size-3.5 opacity-80" aria-label={hint} />
        </p>
        <p className="mt-0.5 truncate text-[26px] font-extrabold leading-tight tabular-nums">{value}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: BetRow['status'] }) {
  if (status === 'open')
    return <span className="rounded-lg border border-primary px-2.5 py-1 text-[12px] font-medium text-primary">I gang</span>
  if (status === 'won')
    return <span className="rounded-lg bg-[#137a4a] px-2.5 py-1 text-[12px] font-semibold text-white">Vundet</span>
  return <span className="rounded-lg bg-[#b3262d] px-2.5 py-1 text-[12px] font-semibold text-white">Tabt</span>
}

function BetListRow({ bet, onOpen }: { bet: BetRow; onOpen: (b: BetRow) => void }) {
  const amount = bet.status === 'open' ? bet.expectedProfit : bet.profit ?? 0
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(bet)}
        className="flex min-h-16 w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent/60"
      >
        <SoccerBallIcon className="size-8 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">{bet.match}</span>
          <span className="block truncate text-[12px] text-[#a9b6d3]">{bet.market}</span>
        </span>
        <span className="w-[72px] shrink-0 border-l border-border pl-2">
          <span className="block text-[13px] font-semibold tabular-nums">{formatInt(bet.stake)} DKK</span>
          {bet.status === 'open' && <span className="block text-[10px] text-[#a9b6d3]">Forventet</span>}
          <span className={cn('block text-[13px] font-semibold tabular-nums', amount >= 0 ? 'text-success' : 'text-destructive')}>
            {formatSigned(amount)} DKK
          </span>
        </span>
        <span className="flex w-[64px] shrink-0 flex-col items-center gap-1">
          <StatusPill status={bet.status} />
          <span className="whitespace-nowrap text-[11px] text-[#a9b6d3]">
            {bet.status === 'open' ? bet.kickoffLabel : bet.dateLabel}
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-[#a9b6d3]" />
      </button>
    </li>
  )
}

function BetSection({
  title,
  icon,
  bets,
  limit,
  empty,
  onOpen,
}: {
  title: string
  icon: React.ReactNode
  bets: BetRow[]
  limit: number
  empty: string
  onOpen: (b: BetRow) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? bets : bets.slice(0, limit)
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card/80">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="flex items-center gap-3 text-[18px] font-bold">
          {icon}
          {title}
        </h2>
        {bets.length > limit && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex min-h-11 items-center gap-1 px-1 text-[15px] font-medium text-primary"
          >
            {expanded ? 'Vis færre' : 'Se alle'}
            <ChevronRight className={cn('size-5 transition-transform', expanded && 'rotate-90')} />
          </button>
        )}
      </div>
      {bets.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y divide-border">
          {shown.map((b) => (
            <BetListRow key={b.id} bet={b} onOpen={onOpen} />
          ))}
        </ul>
      )}
    </section>
  )
}

export function StatsView({ bets, now }: { bets: BetRow[]; now: number }) {
  const [period, setPeriod] = useState<number>(30)
  const [selected, setSelected] = useState<BetRow | null>(null)

  const { current, previous, open, recent } = useMemo(() => {
    const settled = bets.filter((b) => b.status !== 'open')
    const inRange = (b: BetRow, from: number, to: number) => b.placedTs >= from && b.placedTs < to
    const cur = period ? settled.filter((b) => inRange(b, now - period * DAY, now + DAY)) : settled
    const prev = period ? settled.filter((b) => inRange(b, now - 2 * period * DAY, now - period * DAY)) : null
    return {
      current: summarize(cur),
      previous: prev && prev.length > 0 ? summarize(prev) : null,
      open: bets.filter((b) => b.status === 'open').sort((a, b) => a.placedTs - b.placedTs),
      recent: [...cur].sort((a, b) => b.placedTs - a.placedTs),
    }
  }, [bets, period, now])

  const profitTrend = previous && previous.profit !== 0 ? ((current.profit - previous.profit) / Math.abs(previous.profit)) * 100 : null
  const roiTrend = previous ? current.roi - previous.roi : null

  return (
    <div className="flex flex-col gap-3 px-4">
      <h1 className="sr-only">Statistik</h1>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          tone="green"
          icon={<Database className="size-6" />}
          label="Total profit"
          hint="Samlet profit i perioden"
          value={
            <span className={current.profit >= 0 ? 'text-success' : 'text-destructive'}>
              {formatSigned(current.profit)} <span className="text-[15px]">DKK</span>
            </span>
          }
        >
          <Trend value={profitTrend} />
        </StatCard>
        <StatCard
          tone="blue"
          icon={<BarsIcon className="size-6" />}
          label="ROI"
          hint="Profit i forhold til samlet indsats"
          value={<span className="text-primary">{fmt1(current.roi)}%</span>}
        >
          <Trend value={roiTrend} />
        </StatCard>
        <StatCard
          tone="blue"
          icon={<Target className="size-6" />}
          label="Win rate"
          hint="Andel vundne væddemål"
          value={<span className="text-primary">{Math.round(current.winRate)}%</span>}
        >
          <span className="text-[13px] text-[#9cc3ff]">
            {current.won} vundne / {current.lost} tabte
          </span>
        </StatCard>
        <StatCard
          tone="purple"
          icon={<TrendingUp className="size-6" />}
          label="Gns. % afkast"
          hint="Gennemsnitligt afkast pr. vundet væddemål"
          value={<span className="text-[#b57bff]">{fmt1(current.avg)}%</span>}
        >
          <span className="text-[13px] text-[#b57bff]">Pr. væddemål</span>
        </StatCard>
      </div>

      <div role="tablist" aria-label="Periode" className="grid grid-cols-4 rounded-xl border border-border bg-card/60 p-0.5">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={period === p.id}
            onClick={() => setPeriod(p.id)}
            className={cn(
              'min-h-11 rounded-lg text-[15px] font-medium transition-colors',
              period === p.id ? 'bg-primary text-primary-foreground' : 'text-[#c7d2ea] hover:bg-accent',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <BetSection
        title="Åbne væddemål"
        icon={<Clock className="size-6 text-primary" />}
        bets={open}
        limit={3}
        empty="Ingen åbne væddemål. Gem et fra Beregn."
        onOpen={setSelected}
      />
      <BetSection
        title="Seneste væddemål"
        icon={<History className="size-6 text-primary" />}
        bets={recent}
        limit={5}
        empty="Ingen afgjorte væddemål i perioden."
        onOpen={setSelected}
      />

      {selected && <BetSheet bet={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
