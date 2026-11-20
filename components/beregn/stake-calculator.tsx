'use client'

import { useState, useTransition, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, BarChart3, Bookmark, Coins, Minus, Plus, TrendingUp, Wallet } from 'lucide-react'
import { placeBet } from '@/app/actions'
import { fallbackLink } from '@/components/beregn/go-to-bookmaker'
import { LockedOdds } from '@/components/locked-odds'
import { BookmakerMark } from '@/components/sb/BookmakerMark'
import { Crest } from '@/components/sb/Crest'
import { FootballIcon } from '@/components/sb/Sidebar'
import type { Opportunity } from '@/lib/data'
import { cn } from '@/lib/utils'

const MIN = 100
const SLIDER_MAX = 10_000
const MAX = 1_000_000
const STEP = 100

const bookmakerKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')
const kr = (n: number) => n.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const int = (n: number) => Math.round(n).toLocaleString('da-DK')
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi)

type Side = Opportunity['a']

function LegColumn({
  team,
  crest,
  side,
  stake,
  home = false,
}: {
  team: string
  crest: string | null
  side: Side
  stake: number
  home?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const link = fallbackLink(side.bookmaker)
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col items-center gap-2 text-center', home && 'lg:flex-[1.3]')}>
      <div className={cn('flex w-full min-w-0 flex-col items-center gap-2', home && 'lg:flex-row lg:items-center lg:gap-4')}>
        <Crest
          src={crest}
          name={team}
          size="lg"
          className={cn('shrink-0 sm:h-[84px] sm:w-[84px]', home ? 'lg:h-[88px] lg:w-[88px]' : 'lg:h-[100px] lg:w-[100px]')}
        />
        <div className={cn('flex w-full min-w-0 flex-col items-center gap-2', home && 'lg:w-auto lg:flex-1 lg:items-start lg:text-left')}>
      <p className="line-clamp-2 w-full text-[15px] font-bold leading-tight sm:text-[17px] lg:text-[18px]">{team}</p>
      <div className="flex h-8 items-center lg:h-9">
        <BookmakerMark id={bookmakerKey(side.bookmaker)} />
      </div>
      <p className="w-full truncate text-[12.5px] text-muted-foreground">{side.label}</p>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => {
          navigator.clipboard
            .writeText(String(Math.round(stake)))
            .then(() => setCopied(true))
            .catch(() => setCopied(false))
        }}
        className="flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-cyan underline underline-offset-4 hover:text-foreground lg:text-[14px]"
      >
        {copied ? 'Indsats kopieret' : `Gå til ${side.bookmaker}`}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">(åbner i ny fane)</span>
      </a>
        </div>
      </div>
      <span className="mt-1 text-[13px] text-muted-foreground lg:text-[16px] lg:text-foreground/85">Odds</span>
      <span className="flex h-14 w-full max-w-[180px] items-center justify-center rounded-xl border border-border-glow bg-surface-elevated/80 shadow-glow lg:h-[60px] lg:max-w-[190px] lg:bg-primary/20">
        <LockedOdds odds={side.odds} className="text-[26px] font-extrabold tabular-nums sm:text-[30px] lg:text-[32px]" />
      </span>
    </div>
  )
}

function StadiumBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/sb/hero-football.jpg" alt="" className="h-full w-full object-cover object-[20%_30%] opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80" />
    </div>
  )
}

function ProfitRing({ margin }: { margin: number }) {
  const r = 84
  const c = 2 * Math.PI * r
  const fraction = clamp(margin / 5, 0.04, 1)
  return (
    <div className="relative mx-auto h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="profit-ring-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="6" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#profit-ring-stroke)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${c * fraction} ${c}`}
          className="drop-shadow-[0_0_10px_var(--cyan)] transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <div className="absolute inset-[24px] flex items-center justify-center rounded-full bg-surface-deep/70 shadow-[inset_0_0_40px_-10px_var(--primary)]">
        <span className="bg-gradient-to-r from-cyan to-success bg-clip-text text-[40px] font-extrabold tabular-nums text-transparent sm:text-[44px]">
          {margin.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
        </span>
      </div>
    </div>
  )
}

export function StakeCalculator({ opportunity: o }: { opportunity: Opportunity }) {
  const router = useRouter()
  const [total, setTotal] = useState(1000)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  const inv = 1 / o.a.odds + 1 / o.b.odds
  const stakeA = total > 0 ? total / o.a.odds / inv : 0
  const stakeB = total - stakeA
  const payout = stakeA * o.a.odds
  const profit = payout - total
  const margin = total > 0 ? (profit / total) * 100 : 0
  const positive = profit >= 0
  const sliderPct = ((clamp(total, MIN, SLIDER_MAX) - MIN) / (SLIDER_MAX - MIN)) * 100

  function save() {
    setMessage(null)
    startSaving(async () => {
      const res = await placeBet({ opportunityId: o.id, stakeA, stakeB })
      if (res.ok) router.push('/stats')
      else setMessage(res.error)
    })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">
        <section aria-labelledby="match-title" className="sb-panel panel-glow relative overflow-hidden p-5 sm:p-6">
          <div className="accent-wash pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <StadiumBackdrop />
          <div className="relative flex items-center gap-4">
            <FootballIcon className="h-10 w-10 shrink-0 text-foreground" />
            <div>
              <h2 id="match-title" className="text-[20px] font-bold leading-tight sm:text-[24px]">
                Kamp og odds
              </h2>
              <p className="text-[13px] text-muted-foreground sm:text-[15px]">Vælg indsatser og se din garanterede profit.</p>
            </div>
          </div>
          <div className="relative mt-6 flex items-stretch gap-3 sm:gap-6">
            <LegColumn team={o.homeTeam} crest={o.homeLogo ?? null} side={o.a} stake={stakeA} home />
            <div className="relative flex w-12 shrink-0 items-center justify-center sm:w-16" aria-hidden="true">
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan/70 to-transparent" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan/80 bg-surface-deep text-[16px] font-extrabold shadow-[0_0_24px_-4px_var(--cyan)] sm:h-16 sm:w-16 sm:text-[22px]">
                VS
              </span>
            </div>
            <LegColumn team={o.awayTeam} crest={o.awayLogo ?? null} side={o.b} stake={stakeB} />
          </div>
        </section>

        <section aria-labelledby="total-title" className="sb-panel panel-glow p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Coins className="h-8 w-8 shrink-0 text-foreground" aria-hidden="true" />
            <h2 id="total-title" className="text-[20px] font-bold">
              <label htmlFor="total-stake">Total indsats</label>
            </h2>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setTotal((t) => clamp(t - STEP, 0, MAX))}
              aria-label="Mindre indsats"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border-glow bg-surface-elevated/80 transition hover:brightness-125"
            >
              <Minus className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex h-14 min-w-0 max-w-[320px] flex-1 items-center justify-center gap-2 rounded-xl border border-border-glow bg-surface-deep/80 px-3 focus-within:ring-2 focus-within:ring-ring">
              <input
                id="total-stake"
                inputMode="numeric"
                autoComplete="off"
                value={int(total)}
                onChange={(e) => setTotal(clamp(Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 0, 0, MAX))}
                className="w-full min-w-0 bg-transparent text-right text-[26px] font-bold tabular-nums outline-none lg:text-[30px]"
              />
              <span className="shrink-0 text-[20px] font-medium text-foreground/90">DKK</span>
            </div>
            <button
              type="button"
              onClick={() => setTotal((t) => clamp(t + STEP, 0, MAX))}
              aria-label="Større indsats"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border-glow bg-surface-elevated/80 transition hover:brightness-125"
            >
              <Plus className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3 text-[13px] text-foreground/85">
            <span className="shrink-0">100 DKK</span>
            <input
              type="range"
              min={MIN}
              max={SLIDER_MAX}
              step={STEP}
              value={clamp(total, MIN, SLIDER_MAX)}
              onChange={(e) => setTotal(Number(e.target.value))}
              aria-label="Total indsats"
              style={{ '--fill': `${sliderPct}%` } as CSSProperties}
              className="calc-range min-w-0 flex-1"
            />
            <span className="shrink-0">10.000 DKK</span>
          </div>
        </section>
      </div>

      <section
        aria-labelledby="profit-title"
        aria-live="polite"
        className="sb-panel panel-glow relative flex min-w-0 flex-col gap-5 overflow-hidden p-5 sm:p-6 [&>*:not(:first-child)]:relative"
      >
        <StadiumBackdrop />
        <div className="flex items-center gap-4">
          <BarChart3 className="h-9 w-9 shrink-0 text-cyan" strokeWidth={2.6} aria-hidden="true" />
          <div>
            <h2 id="profit-title" className="text-[20px] font-bold leading-tight sm:text-[24px]">
              Garanteret profit
            </h2>
            <p className="text-[13px] text-muted-foreground sm:text-[15px]">Din beregning viser en garanteret profit.</p>
          </div>
        </div>

        <ProfitRing margin={margin} />

        <dl className="flex flex-col rounded-xl border border-border bg-surface-deep/60">
          {[
            { team: o.homeTeam, crest: o.homeLogo ?? null, side: o.a, stake: stakeA },
            { team: o.awayTeam, crest: o.awayLogo ?? null, side: o.b, stake: stakeB },
          ].map(({ team, crest, side, stake }) => (
            <div key={side.bookmaker + side.label} className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Crest src={crest} name={team} size="sm" />
              <dt className="min-w-0 flex-1 truncate text-[14px] text-foreground/90">
                Indsats på {side.label} ({side.bookmaker})
              </dt>
              <dd className="shrink-0 text-[16px] font-bold tabular-nums">{kr(stake)} kr.</dd>
            </div>
          ))}
          <div className="flex items-center gap-3 px-4 py-3">
            <Wallet className="h-6 w-6 shrink-0 text-foreground/85" aria-hidden="true" />
            <dt className="min-w-0 flex-1 text-[14px] text-foreground/90">Samlet udbetaling</dt>
            <dd className="shrink-0 text-[16px] font-bold tabular-nums">{kr(payout)} kr.</dd>
          </div>
        </dl>

        <div
          className={cn(
            'flex items-center gap-3 rounded-xl border px-4 py-4',
            positive ? 'border-success/60 bg-success/10 shadow-[0_0_24px_-10px_var(--success)]' : 'border-destructive/60 bg-destructive/10',
          )}
        >
          <TrendingUp className={cn('h-7 w-7 shrink-0', positive ? 'text-success' : 'text-destructive')} aria-hidden="true" />
          <span className={cn('flex-1 text-[17px] font-bold sm:text-[19px]', positive ? 'text-success' : 'text-destructive')}>
            Garanteret profit
          </span>
          <span className={cn('text-[22px] font-extrabold tabular-nums sm:text-[26px]', positive ? 'text-success' : 'text-destructive')}>
            {positive ? '+' : ''}
            {kr(profit)} kr.
          </span>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={total <= 0 || saving}
          className="bg-gradient-primary mt-auto flex h-14 items-center justify-center gap-3 rounded-xl text-[17px] font-bold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-50 sm:text-[19px]"
        >
          <Bookmark className="h-5 w-5" aria-hidden="true" />
          {saving ? 'Gemmer...' : 'Gem til mine væddemål'}
        </button>
        {message && (
          <p role="alert" className="text-center text-sm text-destructive">
            {message}
          </p>
        )}
      </section>
    </div>
  )
}
