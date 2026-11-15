'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, Database, FileClock, History, Info, Target, TrendingUp } from 'lucide-react'
import { BarsIcon, SoccerBallIcon } from '@/components/icons'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { BetSheet } from '@/components/stats/bet-sheet'
import { useLocale } from '@/components/locale-provider'
import { DAY, PERIODS, StatusPill, Trend, fmt1, periodLabel, summarize } from '@/components/stats/stats-view'
import type { BetRow } from '@/lib/data'
import { formatInt, formatSigned } from '@/lib/odds'
import { cn } from '@/lib/utils'

const TONES = {
  green: {
    card: 'border-[#1f7a5c]/70 bg-[linear-gradient(135deg,rgba(18,90,64,0.6),rgba(5,22,30,0.95))]',
    icon: 'bg-[#2ee6a6]/15 text-[#2ee6a6]',
  },
  blue: {
    card: 'border-[#2b62c9]/70 bg-[linear-gradient(135deg,rgba(18,48,110,0.65),rgba(6,16,38,0.95))]',
    icon: 'bg-[#3d8bff]/20 text-[#5ea2ff]',
  },
  violet: {
    card: 'border-[#6b3fd1]/70 bg-[linear-gradient(135deg,rgba(54,28,110,0.65),rgba(12,12,38,0.95))]',
    icon: 'bg-[#8b5cff]/20 text-[#a98bff]',
  },
  magenta: {
    card: 'border-[#a63ab8]/70 bg-[linear-gradient(135deg,rgba(90,24,100,0.6),rgba(18,10,38,0.95))]',
    icon: 'bg-[#d946ef]/20 text-[#e879f9]',
  },
} as const

function StatCard({
  tone,
  icon,
  label,
  hint,
  value,
  children,
}: {
  tone: keyof typeof TONES
  icon: React.ReactNode
  label: string
  hint: string
  value: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex min-w-0 gap-3 rounded-2xl border p-4', TONES[tone].card)}>
      <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', TONES[tone].icon)}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[13px] text-[#d5ddef]">
          {label}
          <Info className="size-3.5 opacity-80" aria-label={hint} />
        </p>
        <p className="mt-0.5 truncate text-[28px] font-extrabold leading-tight tabular-nums">{value}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
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

function BetTable({
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

  return (
    <section className="overflow-hidden rounded-2xl border border-[#183252] bg-[#050f1f]">
      <header className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#1d4a80] bg-[#0a2140] text-[#3d8bff]">
            {icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold leading-tight">{title}</h2>
            <p className="text-pretty text-[13px] text-[#b3c0d9]">{description}</p>
          </div>
        </div>
        {bets.length > limit && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#1d4a80] px-5 text-[14px] font-medium transition-colors hover:bg-[#0a2140]"
          >
            {expanded ? t('showLess') : t('seeAll')}
            <ChevronRight className={cn('size-4 text-primary transition-transform', expanded && 'rotate-90')} />
          </button>
        )}
      </header>

      {bets.length === 0 ? (
        <>
          <div className="grid grid-cols-[88px_1.5fr_1fr_1.2fr_110px_130px_100px] gap-3 border-t border-[#183252] px-5 py-3 text-[13px] text-[#c3cde2]">
            {headings.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 border-t border-[#183252] px-5 py-8 text-center">
            <FileClock className="size-12 text-[#8aa0c4]" strokeWidth={1.4} aria-hidden="true" />
            <p className="text-[18px] font-bold">{emptyTitle}</p>
            <p className="text-[14px] text-[#b3c0d9]">{emptyText}</p>
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
        </>
      ) : (
        <div role="table" aria-label={title} className="border-t border-[#183252]">
          <div role="row" className="grid grid-cols-[88px_1.5fr_1fr_1.2fr_110px_130px_100px] gap-3 px-5 py-3 text-[13px] text-[#c3cde2]">
            {headings.map((h) => (
              <span key={h} role="columnheader">
                {h}
              </span>
            ))}
          </div>
          <ul>
            {shown.map((bet) => {
              const amount = isOpen ? bet.expectedProfit : bet.profit ?? 0
              return (
                <li key={bet.id} role="row" className="border-t border-[#183252]">
                  <button
                    type="button"
                    onClick={() => onOpen(bet)}
                    className="grid min-h-16 w-full grid-cols-[88px_1.5fr_1fr_1.2fr_110px_130px_100px] items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-[#0a1a33]"
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
                    <span
                      role="cell"
                      className={cn('text-[14px] font-semibold tabular-nums', amount >= 0 ? 'text-success' : 'text-destructive')}
                    >
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
      )}
    </section>
  )
}

export function DesktopStats({ bets, now }: { bets: BetRow[]; now: number }) {
  const { t } = useLocale()
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
    <section aria-labelledby="stats-title" className="hidden min-w-0 flex-1 flex-col gap-4 lg:flex">
      <header className="flex items-start justify-between gap-6 px-1">
        <div className="min-w-0">
          <h1 id="stats-title" className="text-balance text-[36px] font-extrabold leading-tight tracking-tight">
            {t('stats')}
          </h1>
          <p className="text-pretty text-[15px] text-[#c3cde2]">{t('statsDeskText')}</p>
        </div>
        <div role="tablist" aria-label={t('period')} className="flex shrink-0 rounded-xl border border-[#183252] bg-[#050f1f] p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={period === p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'min-h-11 min-w-[88px] rounded-lg px-4 text-[15px] font-medium transition-colors',
                period === p.id ? 'bg-primary text-primary-foreground' : 'text-[#c7d2ea] hover:bg-[#0a1a33]',
              )}
            >
              {periodLabel(t, p.id)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 2xl:grid-cols-4">
        <StatCard
          tone="green"
          icon={<Database className="size-6" />}
          label={t('totalProfit')}
          hint={t('hintTotalProfit')}
          value={
            <span className={current.profit >= 0 ? 'text-[#2ee6a6]' : 'text-destructive'}>
              {formatSigned(current.profit)} <span className="text-[16px]">DKK</span>
            </span>
          }
        >
          <Trend value={profitTrend} />
        </StatCard>
        <StatCard
          tone="blue"
          icon={<BarsIcon className="size-6" />}
          label={t('roi')}
          hint={t('hintRoi')}
          value={<span className="text-[#5ea2ff]">{fmt1(current.roi)}%</span>}
        >
          <Trend value={roiTrend} />
        </StatCard>
        <StatCard
          tone="violet"
          icon={<Target className="size-6" />}
          label={t('winRate')}
          hint={t('hintWinRate')}
          value={<span className="text-[#a98bff]">{Math.round(current.winRate)}%</span>}
        >
          <span className="text-[13px] text-[#c3cde2]">
            {t('wonLost', { won: current.won, lost: current.lost })}
          </span>
        </StatCard>
        <StatCard
          tone="magenta"
          icon={<TrendingUp className="size-6" />}
          label={t('avgReturn')}
          hint={t('hintAvgReturn')}
          value={<span className="text-[#e879f9]">{fmt1(current.avg)}%</span>}
        >
          <span className="text-[13px] text-[#e879f9]">{t('perBet')}</span>
        </StatCard>
      </div>

      <BetTable
        title={t('openBets')}
        description={t('openBetsDesc')}
        icon={<Clock className="size-6" />}
        variant="open"
        bets={open}
        limit={5}
        emptyTitle={t('emptyOpenTitle')}
        emptyText={t('emptyOpenText')}
        onOpen={setSelected}
      />
      <BetTable
        title={t('recentBets')}
        description={t('recentBetsDesc')}
        icon={<History className="size-6" />}
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
