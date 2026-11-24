'use client'

import { useMemo, useState, useTransition, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Bookmark, ChartNoAxesCombined, Coins, Minus, Pencil, Plus, Wallet } from 'lucide-react'
import { placeBet } from '@/app/actions'
import { fallbackLink } from '@/components/beregn/go-to-bookmaker'
import { CalcHero, LeagueMark } from '@/components/beregn/calc-hero'
import { DesignScale } from '@/components/beregn/design-scale'
import { BetfairArrow, CoinsStackIcon, ProfitBarsIcon, SoccerBallSolid, useSvgId } from '@/components/beregn/bi-icons'
import { LockedOdds, useHasAccess } from '@/components/locked-odds'
import { BookmakerMark } from '@/components/sb/BookmakerMark'
import { useLocale } from '@/components/locale-provider'
import type { Opportunity } from '@/lib/data'
import { localePath } from '@/lib/i18n'
import { calculatorFormat, calculatorText, fill } from '@/lib/messages/calculator'
import { cn } from '@/lib/utils'

const STAKE_MIN = 100
const STAKE_MAX = 10_000
const INPUT_MAX = 1_000_000
const QUICK = [500, 1000, 2500, 5000]

type Result = { stakeA: number; stakeB: number; payout: number; profit: number; profitPct: number }

function calcSurebet(total: number, oddsA: number, oddsB: number): Result | null {
  if (!(total > 0) || !(oddsA > 1) || !(oddsB > 1)) return null
  const sum = 1 / oddsA + 1 / oddsB
  const stakeA = total / oddsA / sum
  const payout = total / sum
  return { stakeA, stakeB: total - stakeA, payout, profit: payout - total, profitPct: ((payout - total) / total) * 100 }
}

/** Slider position (0..1) on a log scale, as in the mock-up. */
const stakeToPosition = (s: number) =>
  Math.log(Math.min(STAKE_MAX, Math.max(STAKE_MIN, s)) / STAKE_MIN) / Math.log(STAKE_MAX / STAKE_MIN)
function positionToStake(pos: number) {
  const raw = STAKE_MIN * Math.pow(STAKE_MAX / STAKE_MIN, pos)
  const step = raw < 1000 ? 10 : 50
  return Math.min(STAKE_MAX, Math.max(STAKE_MIN, Math.round(raw / step) * step))
}

function useCalc() {
  const { locale } = useLocale()
  return useMemo(() => {
    const text = calculatorText(locale)
    return { text, fmt: calculatorFormat(text) }
  }, [locale])
}

const clampInput = (n: number) => Math.min(INPUT_MAX, Math.max(0, n))
const bookmakerKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

/** "I dag 21:00" -> { day: "I dag", time: "21:00" } */
function splitKickoff(label: string) {
  const m = label.match(/^(.*?)\s*(\d{1,2}[:.]\d{2})$/)
  return m ? { day: m[1] || '', time: m[2] } : { day: '', time: label }
}

function Bet365Logo({ className }: { className?: string }) {
  return (
    <span className={cn('text-[31px] font-extrabold leading-none tracking-[-0.03em]', className)}>
      bet<span className="text-(--bi-gold)">365</span>
    </span>
  )
}

function BetfairLogo({ className, arrowClassName }: { className?: string; arrowClassName?: string }) {
  return (
    <span className={cn('flex items-center gap-[4px] text-[30px] font-bold leading-none tracking-[-0.02em] text-(--bi-gold)', className)}>
      <BetfairArrow className={cn('h-[22px] w-[26px] -rotate-12', arrowClassName)} />
      betfair
    </span>
  )
}

function BookmakerLogo({ name, compact }: { name: string; compact?: boolean }) {
  const key = bookmakerKey(name)
  if (key === 'bet365') return <Bet365Logo className={compact ? 'text-[19px]' : undefined} />
  if (key.startsWith('betfair'))
    return <BetfairLogo className={compact ? 'text-[18px]' : undefined} arrowClassName={compact ? 'h-[13px] w-[15px]' : undefined} />
  return (
    <span className="flex items-center">
      <BookmakerMark id={key as Parameters<typeof BookmakerMark>[0]['id']} size={compact ? 'md' : 'lg'} />
      <span className="sr-only">{name}</span>
    </span>
  )
}

function TeamCrest({ src, team, className }: { src: string | null; team: string; className: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={team} className={cn('object-contain', className)} />
  }
  const initials = team
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
  return (
    <span className={cn('crest-disc inline-flex shrink-0 items-center justify-center rounded-full', className)}>
      {initials ? (
        <span className="text-[22px] font-bold text-(--bi-fg)">{initials}</span>
      ) : (
        <SoccerBallSolid className="size-[62%] text-(--bi-primary)" aria-hidden="true" />
      )}
    </span>
  )
}

type Leg = {
  team: string
  crest: string | null
  label: string
  bookmaker: string
  odds: string
  realOdds: number
  onOdds: (v: string) => void
  stake: number | undefined
}

function useBookmakerLink(leg: Leg) {
  const [copied, setCopied] = useState(false)
  const url = fallbackLink(leg.bookmaker).url
  const onClick = () => {
    if (leg.stake === undefined) return
    navigator.clipboard
      .writeText(String(Math.round(leg.stake)))
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }
  return { url, onClick, copied }
}

function OddsInput({ leg, hasAccess, className }: { leg: Leg; hasAccess: boolean; className: string }) {
  const { text } = useCalc()
  if (!hasAccess) return <LockedOdds odds={leg.realOdds} className={className} />
  return (
    <input
      value={leg.odds}
      onChange={(e) => leg.onOdds(e.target.value.replace(',', '.').replace(/[^\d.]/g, ''))}
      inputMode="decimal"
      aria-label={fill(text.oddsFor, { label: leg.label })}
      className={cn('w-full bg-transparent text-center outline-none', className)}
    />
  )
}

/* ---------------- Desktop ---------------- */

function TeamColumn({ leg, hasAccess }: { leg: Leg; hasAccess: boolean }) {
  const link = useBookmakerLink(leg)
  const { text } = useCalc()
  return (
    <div className="flex w-[197px] flex-col items-center">
      <TeamCrest src={leg.crest} team={leg.team} className="h-[104px] w-[104px]" />
      <div className="mt-[10px] max-w-full truncate text-[18px] font-semibold leading-none">{leg.team}</div>
      <div className="mt-[8px] flex h-[32px] items-center">
        <BookmakerLogo name={leg.bookmaker} />
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={link.onClick}
        className="mt-[4px] flex items-center gap-[6px] whitespace-nowrap text-[16px] font-semibold text-(--bi-neon) underline underline-offset-[3px]"
      >
        {link.copied ? text.stakeCopied : fill(text.goTo, { bookmaker: leg.bookmaker })}
        <ArrowUpRight className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
        <span className="sr-only">{text.newTab}</span>
      </a>
      <div className="mt-[12px] text-[16px] font-medium leading-none">
        Odds{leg.label !== leg.team ? ` · ${leg.label}` : ''}
      </div>
      <div className="bi-field mt-[6px] flex h-[47px] w-full items-center justify-center focus-within:border-(--bi-glow)">
        <OddsInput leg={leg} hasAccess={hasAccess} className="text-[30px] font-bold" />
      </div>
    </div>
  )
}

function MatchCard({ home, away, hasAccess }: { home: Leg; away: Leg; hasAccess: boolean }) {
  const { text } = useCalc()
  return (
    <section aria-labelledby="match-title" className="bi-panel relative h-[402px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/beregn/stadium.jpg" alt="" className="pointer-events-none absolute inset-0 size-full object-cover object-top opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-(--bi-card)/90 via-(--bi-card)/10 to-(--bi-card)/70" />

      <div className="relative flex items-start gap-[20px] px-[26px] pt-[20px]">
        <SoccerBallSolid className="mt-[2px] size-[48px]" />
        <div>
          <h2 id="match-title" className="text-[26px] font-semibold leading-[1.15] tracking-[-0.01em]">
            {text.matchTitle}
          </h2>
          <p className="mt-[4px] text-[17px] text-(--bi-fg)/95">{text.matchText}</p>
        </div>
      </div>

      <div className="relative mt-[24px] flex justify-between px-[39px]">
        <TeamColumn leg={home} hasAccess={hasAccess} />
        <div className="relative w-0 self-stretch" aria-hidden="true">
          <div className="absolute left-0 top-[-2px] h-[282px] w-px bg-gradient-to-b from-(--bi-primary)/10 via-(--bi-primary)/70 to-(--bi-primary)/10" />
          <div className="bi-shadow-glow absolute left-[-34px] top-[80px] flex size-[68px] items-center justify-center rounded-full border-2 border-(--bi-primary) bg-(--bi-bg) text-[24px] font-bold">
            VS
          </div>
        </div>
        <TeamColumn leg={away} hasAccess={hasAccess} />
      </div>
    </section>
  )
}

function StakeCard({ stake, onStake }: { stake: number; onStake: (n: number) => void }) {
  const pct = stakeToPosition(stake) * 100
  const { text, fmt } = useCalc()
  return (
    <section aria-labelledby="total-title" className="bi-panel h-[216px] px-[30px] pt-[19px]">
      <div className="flex items-center gap-[25px]">
        <CoinsStackIcon className="size-[34px]" strokeWidth={1.7} />
        <h2 id="total-title" className="text-[22px] font-semibold tracking-[-0.01em]">
          {text.totalStake}
        </h2>
      </div>

      <div className="mt-[10px] flex items-center pl-[58px]">
        <button
          type="button"
          aria-label={text.lessStake}
          onClick={() => onStake(clampInput(stake - 100))}
          className="bi-field flex h-[53px] w-[59px] items-center justify-center transition-colors hover:border-(--bi-glow)"
        >
          <Minus className="size-[26px]" strokeWidth={2.4} aria-hidden="true" />
        </button>
        <label className="bi-field ml-[16px] flex h-[53px] w-[311px] items-center justify-center gap-[6px] focus-within:border-(--bi-glow)">
          <input
            value={fmt.whole(stake)}
            onChange={(e) => onStake(clampInput(Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 0))}
            inputMode="numeric"
            autoComplete="off"
            aria-label={text.totalStake}
            className="w-[130px] bg-transparent text-right text-[29px] font-bold leading-none tabular-nums outline-none"
          />
          <span className="text-[22px] font-medium">{text.currency}</span>
        </label>
        <button
          type="button"
          aria-label={text.moreStake}
          onClick={() => onStake(clampInput(stake + 100))}
          className="bi-field ml-[17px] flex h-[53px] w-[58px] items-center justify-center transition-colors hover:border-(--bi-glow)"
        >
          <Plus className="size-[26px]" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-[30px] flex items-center gap-[18px] pl-[1px] pr-[6px] text-[16px]">
        <span>{`${fmt.whole(STAKE_MIN)} ${text.currency}`}</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(pct * 10)}
          onChange={(e) => onStake(positionToStake(Number(e.target.value) / 1000))}
          aria-label={text.stakeSlider}
          style={{ '--pct': `${pct}%` } as CSSProperties}
          className="bi-range flex-1"
        />
        <span>{`${fmt.whole(STAKE_MAX)} ${text.currency}`}</span>
      </div>
    </section>
  )
}

function Ring({ pct }: { pct: number | null }) {
  const R = 100
  const C = 2 * Math.PI * R
  const frac = pct === null ? 0 : Math.min(Math.max(pct / 10, 0), 1)
  const gid = useSvgId('ring-g')
  const fid = useSvgId('ring-glow')
  const { fmt } = useCalc()
  return (
    <div className="relative mx-auto size-[220px]">
      <svg viewBox="0 0 220 220" className="size-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--bi-neon)' }} />
            <stop offset="1" style={{ stopColor: 'var(--bi-glow)' }} />
          </linearGradient>
          <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="110" cy="110" r={R} fill="none" stroke="var(--bi-primary)" strokeOpacity="0.35" strokeWidth="6" />
        <circle cx="110" cy="110" r={R - 12} fill="var(--bi-bg)" fillOpacity="0.55" stroke="var(--bi-primary)" strokeOpacity="0.25" strokeWidth="1.5" />
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${C * frac} ${C}`}
          filter={`url(#${fid})`}
          className="transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bi-text-neon bi-glow-neon text-[47px] font-bold tracking-[-0.02em]">{pct === null ? '–' : fmt.pct(pct)}</span>
      </div>
    </div>
  )
}

function ProfitCard({
  result,
  home,
  away,
  onSave,
  saving,
  message,
}: {
  result: Result | null
  home: Leg
  away: Leg
  onSave: () => void
  saving: boolean
  message: string | null
}) {
  const { text, fmt } = useCalc()
  const v = (n: number | undefined) => (n === undefined ? '–' : fmt.money(n))
  const positive = (result?.profit ?? 0) >= 0
  const tone = positive ? 'text-(--bi-success)' : 'text-(--bi-destructive)'
  const rows: { icon: ReactNode; label: string; value: string }[] = [
    {
      icon: <TeamCrest src={home.crest} team="" className="size-[30px]" />,
      label: fill(text.stakeOn, { label: home.label, bookmaker: home.bookmaker }),
      value: v(result?.stakeA),
    },
    {
      icon: <TeamCrest src={away.crest} team="" className="h-[34px] w-[30px]" />,
      label: fill(text.stakeOn, { label: away.label, bookmaker: away.bookmaker }),
      value: v(result?.stakeB),
    },
    { icon: <Wallet className="size-[28px]" strokeWidth={1.7} aria-hidden="true" />, label: text.totalPayout, value: v(result?.payout) },
  ]

  return (
    <section aria-labelledby="profit-title" aria-live="polite" className="bi-panel flex h-[634px] flex-col px-[21px] pb-[20px] pt-[22px]">
      <div className="flex items-start gap-[24px] pl-[13px]">
        <ProfitBarsIcon className="mt-[2px] size-[44px]" />
        <div>
          <h2 id="profit-title" className="text-[26px] font-semibold leading-[1.15] tracking-[-0.01em]">
            {text.guaranteedProfit}
          </h2>
          <p className="mt-[4px] text-[17px] text-(--bi-fg)/95">{text.profitText}</p>
        </div>
      </div>

      <div className="mt-[6px]">
        <Ring pct={result?.profitPct ?? null} />
      </div>

      <dl className="mt-[1px] rounded-[8px] border border-(--bi-primary)/45 bg-(--bi-bg)/40">
        {rows.map((r, i) => (
          <div key={r.label} className={cn('flex h-[49px] items-center px-[14px]', i > 0 && 'border-t border-(--bi-primary)/35')}>
            <span className="flex w-[30px] justify-center">{r.icon}</span>
            <dt className="ml-[18px] min-w-0 flex-1 truncate text-[15px] text-(--bi-fg)/95">{r.label}</dt>
            <dd className="text-[18px] font-bold tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div
        className={cn(
          'mt-[2px] flex h-[68px] items-center rounded-[10px] px-[18px]',
          positive ? 'bi-grad-success bi-shadow-success' : 'border-2 border-(--bi-destructive)',
        )}
      >
        <ChartNoAxesCombined className={cn('size-[32px]', tone)} strokeWidth={2} aria-hidden="true" />
        <span className={cn('ml-[20px] flex-1 text-[20px] font-semibold', tone)}>{text.guaranteedProfit}</span>
        <span className={cn('text-[30px] font-bold tabular-nums tracking-[-0.01em]', tone)}>
          {result ? `${result.profit >= 0 ? '+' : ''}${fmt.money(result.profit)}` : '–'}
        </span>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={!result || saving}
        className="bi-grad-primary bi-shadow-glow mt-auto flex h-[66px] items-center justify-center gap-[16px] rounded-[12px] text-[21px] font-semibold transition-transform hover:scale-[1.01] disabled:opacity-50"
      >
        <Bookmark className="size-[26px]" strokeWidth={2} aria-hidden="true" />
        {saving ? text.saving : text.saveLong}
      </button>
      {message && (
        <p role="alert" className="mt-[8px] text-center text-[14px] text-(--bi-destructive)">
          {message}
        </p>
      )}
    </section>
  )
}

/* ---------------- Phone ---------------- */

function MobileTeamColumn({ leg, hasAccess }: { leg: Leg; hasAccess: boolean }) {
  const link = useBookmakerLink(leg)
  const { text, fmt } = useCalc()
  return (
    <div className="flex min-w-0 flex-col items-center">
      <TeamCrest src={leg.crest} team={leg.team} className="size-[84px] drop-shadow-[0_6px_14px_oklch(0.06_0.03_266/0.8)]" />
      <div className="mt-[8px] w-full truncate text-center text-[14px] font-bold leading-tight">{leg.team}</div>

      <div className="bi-tile-in mt-[12px] flex w-full min-w-0 flex-col p-[11px]">
        <div className="flex h-[24px] items-center justify-between gap-[6px]">
          <span className="min-w-0 truncate">
            <BookmakerLogo name={leg.bookmaker} compact />
          </span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={link.onClick}
            aria-label={`${fill(text.goTo, { bookmaker: leg.bookmaker })} ${text.newTab}`}
            className="grid size-[26px] shrink-0 place-items-center rounded-full border border-(--bi-neon)/40 text-(--bi-neon)"
          >
            <ArrowUpRight className="size-[14px]" strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>

        <label className="bi-field relative mt-[10px] flex h-[58px] items-center justify-center focus-within:border-(--bi-glow)">
          <OddsInput leg={leg} hasAccess={hasAccess} className="text-[31px] font-extrabold leading-none tracking-[-0.02em]" />
          {hasAccess && <Pencil className="pointer-events-none absolute right-[8px] top-[8px] size-[11px] text-(--bi-muted)" aria-hidden="true" />}
        </label>

        <div className="mt-[10px] truncate text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-(--bi-muted)">
          {link.copied ? text.copied : leg.label !== leg.team ? leg.label : text.place}
        </div>
        <div className="mt-[2px] truncate text-center text-[19px] font-extrabold leading-tight text-(--bi-neon)">
          {leg.stake === undefined ? '–' : fmt.money(leg.stake)}
        </div>
      </div>
    </div>
  )
}

function MobileCalculator({
  o,
  home,
  away,
  stake,
  onStake,
  hasAccess,
}: {
  o: Opportunity
  home: Leg
  away: Leg
  stake: number
  onStake: (n: number) => void
  hasAccess: boolean
}) {
  const pos = stakeToPosition(stake)
  const kickoff = splitKickoff(o.kickoffLabel)
  const { text, fmt } = useCalc()

  return (
    <section className="bi-combo bi-rise" aria-label={text.calcAria}>
      <div className="absolute inset-x-0 top-0 h-[250px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/beregn/hero-player.jpg" alt="" className="pointer-events-none absolute inset-0 size-full object-cover object-[72%_30%]" />
        <div className="bi-combo-fade pointer-events-none absolute inset-0" />
      </div>

      <div className="relative px-[12px] pt-[12px]">
        <div className="flex items-center justify-between gap-[8px]">
          <span className="bi-chip-glass min-w-0">
            <LeagueMark league={o.league} className="h-[16px] w-[14px] shrink-0 object-contain" />
            <span className="truncate">{o.league}</span>
          </span>
          <span className="bi-chip-live shrink-0">
            <span className="bi-live-pulse size-[7px] rounded-full bg-(--bi-success)" aria-hidden="true" />
            Live
          </span>
        </div>

        <div className="relative mt-[44px] grid grid-cols-2 gap-[10px]">
          <MobileTeamColumn leg={home} hasAccess={hasAccess} />
          <MobileTeamColumn leg={away} hasAccess={hasAccess} />

          <div className="pointer-events-none absolute left-1/2 top-0 flex h-full -translate-x-1/2 flex-col items-center" aria-hidden="true">
            <div className="bi-vs-orb mt-[20px] size-[44px] text-[14px]">VS</div>
            <div className="mt-[6px] rounded-full bg-(--bi-bg)/70 px-[8px] py-[3px] text-center backdrop-blur-md">
              <div className="text-[13px] font-extrabold leading-none">{kickoff.time}</div>
              {kickoff.day && <div className="mt-[2px] text-[9.5px] font-medium leading-none text-(--bi-muted)">{kickoff.day}</div>}
            </div>
            <div className="bi-link-line mt-[6px] h-[72px]" />
          </div>
        </div>
      </div>

      <div className="relative px-[16px] pb-[16px] pt-[18px]">
        <div className="bi-divider text-[11px] font-bold uppercase tracking-[0.1em] text-(--bi-muted)">
          <span className="flex items-center gap-[6px]">
            <Coins className="size-[14px] text-(--bi-neon)" strokeWidth={2.2} aria-hidden="true" />
            {text.totalStakeAuto}
          </span>
        </div>

        <div className="mt-[14px] grid grid-cols-[52px_minmax(0,1fr)_52px] items-center gap-[10px]">
          <button type="button" aria-label={text.lessStake} onClick={() => onStake(clampInput(stake - 100))} className="bi-step size-[52px]">
            <Minus className="size-[22px]" strokeWidth={2.4} aria-hidden="true" />
          </button>
          <label className="flex min-w-0 items-center justify-center">
            <span className="relative inline-block">
              <input
                value={fmt.whole(stake)}
                onChange={(e) => onStake(clampInput(Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 0))}
                inputMode="numeric"
                autoComplete="off"
                aria-label={text.totalStake}
                style={{ width: `${Math.max(fmt.whole(stake).length, 1) + 0.5}ch` }}
                className="bg-transparent text-center text-[40px] font-extrabold leading-none tabular-nums tracking-[-0.03em] outline-none"
              />
              <span className="pointer-events-none absolute bottom-[4px] left-full ml-[4px] text-[15px] font-bold text-(--bi-muted)">{text.currency}</span>
            </span>
          </label>
          <button type="button" aria-label={text.moreStake} onClick={() => onStake(clampInput(stake + 100))} className="bi-step size-[52px]">
            <Plus className="size-[22px]" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(pos * 1000)}
          onChange={(e) => onStake(positionToStake(Number(e.target.value) / 1000))}
          aria-label={text.stakeSlider}
          className="bi-range mt-[18px] w-full"
          style={{ '--pct': `${pos * 100}%` } as CSSProperties}
        />
        <div className="mt-[6px] flex justify-between text-[11px] font-medium text-(--bi-muted)">
          <span>{`${fmt.whole(STAKE_MIN)} ${text.currency}`}</span>
          <span>{`${fmt.whole(STAKE_MAX)} ${text.currency}`}</span>
        </div>

        <div className="mt-[12px] grid grid-cols-4 gap-[8px]">
          {QUICK.map((q) => (
            <button type="button" key={q} onClick={() => onStake(q)} aria-pressed={stake === q} className="bi-chip-pick">
              {fmt.whole(q)}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function MiniRing({ pct, tone }: { pct: number | null; tone: string }) {
  const R = 22
  const C = 2 * Math.PI * R
  const frac = pct === null ? 0 : Math.min(Math.max(pct / 10, 0), 1)
  const { fmt } = useCalc()
  return (
    <div className={cn('relative size-[56px] shrink-0', tone)}>
      <svg viewBox="0 0 56 56" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--bi-primary)" strokeOpacity="0.3" strokeWidth="5" />
        {frac > 0 && (
          <circle
            cx="28"
            cy="28"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${frac * C} ${C}`}
            className="transition-[stroke-dasharray] duration-500"
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          />
        )}
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[11px] font-extrabold tracking-[-0.02em]">
        {pct === null ? '–' : fmt.pct(pct).replace(' ', '')}
      </span>
    </div>
  )
}

function MobileResultDock({ result, onSave, saving }: { result: Result | null; onSave: () => void; saving: boolean }) {
  const { text, fmt } = useCalc()
  const positive = result !== null && result.profit >= 0
  const tone = result === null ? 'text-(--bi-muted)' : positive ? 'text-(--bi-success)' : 'text-(--bi-destructive)'
  return (
    <div aria-live="polite" className={cn(positive || result === null ? 'bi-dock' : 'bi-dock-loss', 'flex items-center gap-[12px] p-[10px]')}>
      <MiniRing pct={result?.profitPct ?? null} tone={tone} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-(--bi-muted)">
          {result === null ? text.enterOdds : positive ? text.guaranteedProfit : text.noSurebet}
        </div>
        <div className={cn('truncate text-[24px] font-extrabold leading-[1.1] tabular-nums tracking-[-0.03em]', tone)}>
          {result ? `${result.profit >= 0 ? '+' : ''}${fmt.money(result.profit)}` : '–'}
        </div>
        <div className="truncate text-[11px] text-(--bi-muted)">
          {text.payout} <span className="font-semibold text-(--bi-fg)">{result ? fmt.money(result.payout) : '–'}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onSave}
        aria-label={text.saveLong}
        disabled={!result || saving}
        className="bi-grad-primary bi-shadow-glow flex h-[52px] shrink-0 items-center gap-[8px] rounded-[16px] px-[16px] text-[15px] font-bold transition-transform active:scale-[0.96] disabled:opacity-50"
      >
        <Bookmark className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
        {saving ? text.saving : text.save}
      </button>
    </div>
  )
}

/* ---------------- Page state ---------------- */

export function StakeCalculator({ opportunity: o }: { opportunity: Opportunity }) {
  const router = useRouter()
  const { locale } = useLocale()
  const { text: heroText } = useCalc()
  const hasAccess = useHasAccess()
  const [stake, setStake] = useState(1000)
  const [oddsA, setOddsA] = useState(String(o.a.odds))
  const [oddsB, setOddsB] = useState(String(o.b.odds))
  const [message, setMessage] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  const result = hasAccess
    ? calcSurebet(stake, parseFloat(oddsA), parseFloat(oddsB))
    : calcSurebet(stake, o.a.odds, o.b.odds)

  const home: Leg = {
    team: o.homeTeam,
    crest: o.homeLogo ?? null,
    label: o.a.label,
    bookmaker: o.a.bookmaker,
    odds: oddsA,
    realOdds: o.a.odds,
    onOdds: setOddsA,
    stake: result?.stakeA,
  }
  const away: Leg = {
    team: o.awayTeam,
    crest: o.awayLogo ?? null,
    label: o.b.label,
    bookmaker: o.b.bookmaker,
    odds: oddsB,
    realOdds: o.b.odds,
    onOdds: setOddsB,
    stake: result?.stakeB,
  }

  function save() {
    if (!result) return
    setMessage(null)
    startSaving(async () => {
      const res = await placeBet({ opportunityId: o.id, stakeA: result.stakeA, stakeB: result.stakeB })
      if (res.ok) router.push(localePath(locale, '/stats'))
      else setMessage(res.error)
    })
  }

  return (
    <>
      <DesignScale className="hidden lg:block">
        <CalcHero league={o.league} kickoff={o.kickoffLabel} title={heroText.heroTitle} accent={heroText.heroAccent} text={heroText.heroText} />
        <div className="relative z-10 grid grid-cols-[640fr_547fr] gap-x-[16px] px-[22px] pb-[52px]">
          <div className="flex flex-col gap-[15px]">
            <MatchCard home={home} away={away} hasAccess={hasAccess} />
            <StakeCard stake={stake} onStake={setStake} />
          </div>
          <ProfitCard result={result} home={home} away={away} onSave={save} saving={saving} message={message} />
        </div>
      </DesignScale>

      <div className="pb-[calc(112px+env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto max-w-[560px]">
          <MobileCalculator o={o} home={home} away={away} stake={stake} onStake={setStake} hasAccess={hasAccess} />
          {message && (
            <p role="alert" className="mt-3 text-center text-[14px] text-(--bi-destructive)">
              {message}
            </p>
          )}
        </div>
        <div className="bi-bottom-fade pointer-events-none fixed inset-x-0 bottom-0 z-40 px-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] pt-[28px]">
          <div className="pointer-events-auto mx-auto max-w-[560px]">
            <MobileResultDock result={result} onSave={save} saving={saving} />
          </div>
        </div>
      </div>
    </>
  )
}
