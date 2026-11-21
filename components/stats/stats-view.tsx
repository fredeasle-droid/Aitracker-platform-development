'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Coins,
  FileClock,
  History,
  Info,
  Percent,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react'
import { BarsIcon, SoccerBallIcon } from '@/components/icons'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { BetSheet } from '@/components/stats/bet-sheet'
import { StatsChart, type SeriesPoint } from '@/components/stats/stats-chart'
import { useLocale } from '@/components/locale-provider'
import type { BetRow } from '@/lib/data'
import { LOCALES } from '@/lib/i18n'
import type { Translator } from '@/lib/i18n'
import { formatInt, formatSigned } from '@/lib/odds'
import { cn } from '@/lib/utils'

const PERIODS = [{ id: 7 }, { id: 30 }, { id: 90 }, { id: 0 }] as const
const DAY = 86_400_000
const TZ = 'Europe/Copenhagen'
const dayKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TZ })

function periodLabel(t: Translator['t'], id: number) {
  return id === 0 ? t('all') : t('daysN', { n: id })
}

function summarize(list: BetRow[]) {
  const profit = list.reduce((s, b) => s + (b.profit ?? 0), 0)
  const staked = list.reduce((s, b) => s + b.stake, 0)
  const won = list.filter((b) => b.status === 'won')
  const roi = staked > 0 ? (profit / staked) * 100 : 0
  const avg = won.length > 0 ? won.reduce((s, b) => s + ((b.profit ?? 0) / b.stake) * 100, 0) / won.length : 0
  const winRate = list.length > 0 ? (won.length / list.length) * 100 : 0
  return { profit, roi, avg, winRate, won: won.length, lost: list.length - won.length }
}

function fmt1(n: number) {
  return n.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function Trend({ value }: { value: number | null }) {
  const { t } = useLocale()
  if (value === null || !Number.isFinite(value)) return <span className="text-[13px] text-[#8aa0c4]">{t('noComparison')}</span>
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={cn('flex items-center gap-1 text-[13px] font-medium', up ? 'text-success' : 'text-destructive')}>
      <Icon className="size-4" aria-hidden="true" />
      {up ? '+' : '-'}
      {fmt1(Math.abs(value))}%
    </span>
  )
}

function StatusPill({ status }: { status: BetRow['status'] }) {
  const { t } = useLocale()
  if (status === 'open')
    return <span className="rounded-lg border border-primary px-2.5 py-1 text-[12px] font-medium text-primary">{t('statusOpen')}</span>
  if (status === 'won')
    return <span className="rounded-lg bg-[#137a4a] px-2.5 py-1 text-[12px] font-semibold text-white shadow-[0_0_14px_-2px_#2ee6a6]">{t('statusWon')}</span>
  return <span className="rounded-lg bg-[#b3262d] px-2.5 py-1 text-[12px] font-semibold text-white">{t('statusLost')}</span>
}

function Ring({ value, children }: { value: number; children: React.ReactNode }) {
  const r = 24
  const c = 2 * Math.PI * r
  const share = Math.min(Math.max(value, 0), 100) / 100
  return (
    <span className="relative flex size-14 shrink-0 items-center justify-center lg:size-16">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} stroke="#12264a" strokeWidth="6" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${c * share} ${c}`}
          className="drop-shadow-[0_0_6px_#22d3ee]"
        />
      </svg>
      {children}
    </span>
  )
}

function StatCard({
  tone,
  icon,
  label,
  hint,
  value,
  className,
  children,
}: {
  tone: 'success' | 'primary' | 'neon' | 'violet'
  icon: React.ReactNode
  label: string
  hint: string
  value: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  const tiles = {
    success: 'bg-success/15 text-success',
    primary: 'bg-primary/20 text-[#5ea2ff]',
    neon: '',
    violet: 'bg-[#8b5cff]/20 text-[#a98bff]',
  }
  return (
    <article
      className={cn(
        'glass-panel relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl p-3.5 lg:gap-4 lg:p-5',
        tone === 'success' && 'border-success/40',
        className,
      )}
    >
      <span
        className={cn(
          tone === 'neon' ? 'contents' : 'flex size-12 shrink-0 items-center justify-center rounded-2xl lg:size-14',
          tiles[tone],
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[13px] text-[#b3c0d9]">
          {label}
          <Info className="size-3.5 opacity-70" aria-label={hint} />
        </p>
        <p className="mt-0.5 truncate text-[24px] font-extrabold leading-tight tabular-nums lg:text-[28px]">{value}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </article>
  )
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-[18px] font-bold lg:text-[20px]">
      <span className="icon-chip size-10 shrink-0 text-[#5ea2ff]">{icon}</span>
      {children}
    </h2>
  )
}

function BookmakerCell({ value }: { value?: string | null }) {
  if (!value) return <span className="text-[#6f84a6]">–</span>
  const names = value.split(' / ')
  return (
    <span className="flex items-center gap-2">
      <span className="flex shrink-0 -space-x-1.5">
        {names.map((name) => (
          <BookmakerLogo key={name} name={name} className="size-6 ring-2 ring-[#050f1f]" />
        ))}
      </span>
      <span className="truncate text-[13px] text-[#d5ddef]">{names.join(' / ')}</span>
    </span>
  )
}

const COLS = 'grid-cols-[88px_1.5fr_1fr_1.2fr_110px_130px_100px]'

function BetSection({
  title,
  description,
  icon,
  variant,
  bets,
  limit,
  emptyTitle,
  emptyText,
  onOpen,
}: {
  title: string
  description: string
  icon: React.ReactNode
  variant: 'open' | 'settled'
  bets: BetRow[]
  limit: number
  emptyTitle: string
  emptyText: string
  onOpen: (bet: BetRow) => void
}) {
  const { t } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? bets : bets.slice(0, limit)
  const isOpen = variant === 'open'
  const headings = [
    t('colTime'),
    t('colMatch'),
    t('market'),
    t('colBookmaker'),
    t('colStake'),
    isOpen ? t('colPossibleProfit') : t('colProfit'),
    isOpen ? t('colStatus') : t('colResult'),
  ]
  const amountOf = (b: BetRow) => (isOpen ? b.expectedProfit : b.profit ?? 0)

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-4 px-4 py-3.5 lg:px-5 lg:py-4">
        <div className="min-w-0">
          <SectionTitle icon={icon}>{title}</SectionTitle>
          <p className="mt-1 hidden text-pretty pl-[52px] text-[13px] text-[#b3c0d9] lg:block">{description}</p>
        </div>
        {bets.length > limit && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-[#1d4a80] px-4 text-[14px] font-medium text-[#5ea2ff] transition-colors hover:bg-[#0a2140]"
          >
            {expanded ? t('showLess') : t('seeAll')}
            <ChevronRight className={cn('size-4 transition-transform', expanded && 'rotate-90')} />
          </button>
        )}
      </header>

      {bets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 border-t border-[#183252] px-5 py-8 text-center">
          <FileClock className="size-11 text-[#8aa0c4]" strokeWidth={1.4} aria-hidden="true" />
          <p className="text-[17px] font-bold">{emptyTitle}</p>
          <p className="text-pretty text-[14px] text-[#b3c0d9]">{emptyText}</p>
          {isOpen && (
            <Link
              href="/"
              className="mt-3 flex min-h-11 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t('findNew')}
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-[#183252] border-t border-[#183252] lg:hidden">
            {shown.map((bet) => {
              const amount = amountOf(bet)
              return (
                <li key={bet.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(bet)}
                    className="flex min-h-16 w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-[#0a1a33]"
                  >
                    <SoccerBallIcon className="size-8 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{bet.match}</span>
                      <span className="block truncate text-[12px] text-[#a9b6d3]">{bet.market}</span>
                    </span>
                    <span className="w-[76px] shrink-0 border-l border-[#183252] pl-2">
                      <span className="block text-[13px] font-semibold tabular-nums">{formatInt(bet.stake)} DKK</span>
                      {isOpen && <span className="block text-[10px] text-[#a9b6d3]">{t('expected')}</span>}
                      <span className={cn('block text-[13px] font-semibold tabular-nums', amount >= 0 ? 'text-success' : 'text-destructive')}>
                        {formatSigned(amount)} DKK
                      </span>
                    </span>
                    <span className="flex w-[64px] shrink-0 flex-col items-center gap-1">
                      <StatusPill status={bet.status} />
                      <span className="whitespace-nowrap text-[11px] text-[#a9b6d3]">{isOpen ? bet.kickoffLabel : bet.dateLabel}</span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-[#a9b6d3]" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>

          <div role="table" aria-label={title} className="hidden border-t border-[#183252] lg:block">
            <div role="row" className={cn('grid gap-3 px-5 py-3 text-[13px] text-[#8aa0c4]', COLS)}>
              {headings.map((h) => (
                <span key={h} role="columnheader">
                  {h}
                </span>
              ))}
            </div>
            <ul>
              {shown.map((bet) => {
                const amount = amountOf(bet)
                return (
                  <li key={bet.id} role="row" className="border-t border-[#183252]">
                    <button
                      type="button"
                      onClick={() => onOpen(bet)}
                      className={cn('grid min-h-16 w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-[#0a1a33]', COLS)}
                    >
                      <span role="cell" className="text-[13px] text-[#c3cde2]">
                        {isOpen ? bet.kickoffLabel : bet.dateLabel}
                      </span>
                      <span role="cell" className="flex min-w-0 items-center gap-2.5">
                        <SoccerBallIcon className="size-7 shrink-0" />
                        <span className="truncate text-[14px] font-medium">{bet.match}</span>
                      </span>
                      <span role="cell" className="truncate text-[13px] text-[#c3cde2]">
                        {bet.market}
                      </span>
                      <span role="cell" className="min-w-0">
                        <BookmakerCell value={bet.bookmakers} />
                      </span>
                      <span role="cell" className="text-[14px] font-semibold tabular-nums">
                        {formatInt(bet.stake)} DKK
                      </span>
                      <span role="cell" className={cn('text-[14px] font-semibold tabular-nums', amount >= 0 ? 'text-success' : 'text-destructive')}>
                        {formatSigned(amount)} DKK
                      </span>
                      <span role="cell">
                        <StatusPill status={bet.status} />
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}

function ActivityCard({ bets }: { bets: BetRow[] }) {
  const { t } = useLocale()
  const items = useMemo(() => [...bets].sort((a, b) => b.placedTs - a.placedTs).slice(0, 6), [bets])
  return (
    <section className="glass-panel flex flex-col rounded-2xl p-4 lg:p-5">
      <SectionTitle icon={<Clock className="size-5" />}>{t('latestActivity')}</SectionTitle>
      {items.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-[#b3c0d9]">{t('noActivity')}</p>
      ) : (
        <ul className="mt-3 divide-y divide-[#183252]">
          {items.map((b) => {
            const Icon = b.status === 'won' ? Check : b.status === 'lost' ? X : Plus
            const text =
              b.status === 'won'
                ? t('activityWon', { amount: formatInt(b.profit ?? 0) })
                : b.status === 'lost'
                  ? t('activityLost', { amount: formatInt(Math.abs(b.profit ?? b.stake)) })
                  : t('activityOpen', { amount: formatInt(b.stake) })
            return (
              <li key={b.id} className="flex items-start gap-3 py-2.5">
                <span
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                    b.status === 'won' && 'bg-success/15 text-success',
                    b.status === 'lost' && 'bg-destructive/15 text-destructive',
                    b.status === 'open' && 'bg-primary/20 text-[#5ea2ff]',
                  )}
                >
                  <Icon className="size-4" strokeWidth={3} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] leading-snug">{text}</p>
                  <p className="mt-0.5 truncate text-[12px] text-[#8aa0c4]">
                    {b.match} · {b.dateLabel}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export function StatsView({ bets, now }: { bets: BetRow[]; now: number }) {
  const { t, locale } = useLocale()
  const [period, setPeriod] = useState<number>(30)
  const [selected, setSelected] = useState<BetRow | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { current, previous, open, recent, today, series } = useMemo(() => {
    const settled = bets.filter((b) => b.status !== 'open')
    const inRange = (b: BetRow, from: number, to: number) => b.placedTs >= from && b.placedTs < to
    const cur = period ? settled.filter((b) => inRange(b, now - period * DAY, now + DAY)) : settled
    const prev = period ? settled.filter((b) => inRange(b, now - 2 * period * DAY, now - period * DAY)) : null

    const labelFormat = new Intl.DateTimeFormat(LOCALES[locale].tag, { day: 'numeric', month: 'short', timeZone: TZ })
    const byDay = new Map<string, { profit: number; stake: number }>()
    for (const b of cur) {
      const key = dayKeyFormat.format(b.placedTs)
      const row = byDay.get(key) ?? { profit: 0, stake: 0 }
      row.profit += b.profit ?? 0
      row.stake += b.stake
      byDay.set(key, row)
    }
    const points: SeriesPoint[] = []
    if (cur.length > 0) {
      const startTs = period ? now - period * DAY : Math.min(...cur.map((b) => b.placedTs))
      const endTs = Math.max(now, ...cur.map((b) => b.placedTs))
      let profit = 0
      let investment = 0
      let lastKey = ''
      for (let ts = startTs; ts <= endTs + DAY / 2; ts += DAY) {
        const key = dayKeyFormat.format(ts)
        if (key === lastKey) continue
        lastKey = key
        const day = byDay.get(key)
        profit += day?.profit ?? 0
        investment += day?.stake ?? 0
        points.push({ label: labelFormat.format(ts), profit: Math.round(profit), investment: Math.round(investment) })
      }
    }
    const todayKey = dayKeyFormat.format(now)
    return {
      current: summarize(cur),
      previous: prev && prev.length > 0 ? summarize(prev) : null,
      open: bets.filter((b) => b.status === 'open').sort((a, b) => a.placedTs - b.placedTs),
      recent: [...cur].sort((a, b) => b.placedTs - a.placedTs),
      today: settled.filter((b) => dayKeyFormat.format(b.placedTs) === todayKey).reduce((s, b) => s + (b.profit ?? 0), 0),
      series: points,
    }
  }, [bets, period, now, locale])

  const profitTrend = previous && previous.profit !== 0 ? ((current.profit - previous.profit) / Math.abs(previous.profit)) * 100 : null
  const roiTrend = previous ? current.roi - previous.roi : null
  const last = series[series.length - 1]

  return (
    <section aria-labelledby="stats-title" className="flex min-w-0 flex-1 flex-col gap-3 pb-6 lg:gap-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-1">
        <div className="min-w-0">
          <h1 id="stats-title" className="text-balance text-[28px] font-extrabold leading-tight tracking-tight lg:text-[36px]">
            <span className="underline-neon text-gradient-neon">{t('stats')}</span>
          </h1>
          <p className="mt-1.5 text-pretty text-[14px] text-[#b3c0d9] lg:text-[15px]">{t('statsDeskText')}</p>
        </div>
        <div role="tablist" aria-label={t('period')} className="glass-panel grid shrink-0 grid-cols-4 rounded-xl p-1 lg:flex">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={period === p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'min-h-11 rounded-lg px-4 text-[15px] font-medium transition-all lg:min-w-[88px]',
                period === p.id
                  ? 'bg-primary text-primary-foreground shadow-[0_0_18px_-4px_#1677ff]'
                  : 'text-[#c7d2ea] hover:bg-[#0a1a33]',
              )}
            >
              {periodLabel(t, p.id)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 2xl:grid-cols-4">
        <StatCard
          tone="success"
          className="col-span-2 2xl:col-span-1"
          icon={<Coins className="size-7" />}
          label={t('totalProfit')}
          hint={t('hintTotalProfit')}
          value={
            <span className={current.profit >= 0 ? 'text-success [text-shadow:0_0_24px_rgba(46,230,166,0.45)]' : 'text-destructive'}>
              {formatSigned(current.profit)} <span className="text-[16px]">DKK</span>
            </span>
          }
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <Trend value={profitTrend} />
            <span className="text-[13px] text-[#8aa0c4]">
              {t('profitToday')} <span className={cn('font-semibold tabular-nums', today >= 0 ? 'text-success' : 'text-destructive')}>{formatSigned(today)}</span>
            </span>
          </div>
        </StatCard>
        <StatCard
          tone="primary"
          icon={<BarsIcon className="size-6" />}
          label={t('roi')}
          hint={t('hintRoi')}
          value={<span className="text-[#5ea2ff]">{fmt1(current.roi)}%</span>}
        >
          <Trend value={roiTrend} />
        </StatCard>
        <StatCard
          tone="neon"
          icon={
            <Ring value={current.winRate}>
              <Percent className="size-5 text-[#22d3ee]" aria-hidden="true" />
            </Ring>
          }
          label={t('winRate')}
          hint={t('hintWinRate')}
          value={<span className="text-[#22d3ee]">{Math.round(current.winRate)}%</span>}
        >
          <span className="text-[13px] text-[#c3cde2]">{t('wonLost', { won: current.won, lost: current.lost })}</span>
        </StatCard>
        <StatCard
          tone="violet"
          className="col-span-2 2xl:col-span-1"
          icon={<TrendingUp className="size-6" />}
          label={t('avgReturn')}
          hint={t('hintAvgReturn')}
          value={<span className="text-[#a98bff]">{fmt1(current.avg)}%</span>}
        >
          <span className="text-[13px] text-[#a98bff]">{t('perBet')}</span>
        </StatCard>
      </div>

      <div className="grid gap-3 lg:gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <section className="glass-panel flex flex-col rounded-2xl p-4 lg:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle icon={<BarsIcon className="size-5" />}>{t('profitDev')}</SectionTitle>
            {last && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#3d8bff] shadow-[0_0_8px_#3d8bff]" />
                  {t('totalProfit')}
                  <span className="font-semibold tabular-nums text-[#5ea2ff]">{formatSigned(last.profit)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-success shadow-[0_0_8px_#2ee6a6]" />
                  {t('investment')}
                  <span className="font-semibold tabular-nums text-success">{formatInt(last.investment)}</span>
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 h-[240px] lg:h-[280px]">
            {series.length === 0 ? (
              <p className="flex h-full items-center justify-center text-center text-[14px] text-[#b3c0d9]">{t('noChartData')}</p>
            ) : (
              mounted && <StatsChart data={series} profitLabel={t('totalProfit')} investmentLabel={t('investment')} />
            )}
          </div>
        </section>
        <ActivityCard bets={bets} />
      </div>

      <BetSection
        title={t('openBets')}
        description={t('openBetsDesc')}
        icon={<Clock className="size-5" />}
        variant="open"
        bets={open}
        limit={5}
        emptyTitle={t('emptyOpenTitle')}
        emptyText={t('emptyOpenText')}
        onOpen={setSelected}
      />
      <BetSection
        title={t('recentBets')}
        description={t('recentBetsDesc')}
        icon={<History className="size-5" />}
        variant="settled"
        bets={recent}
        limit={5}
        emptyTitle={t('emptySettledTitle')}
        emptyText={t('emptySettledText')}
        onOpen={setSelected}
      />

      {selected && <BetSheet bet={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
