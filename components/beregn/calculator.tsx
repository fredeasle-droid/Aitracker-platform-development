'use client'

import { Fragment, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftRight, Check, Copy, Database, Lightbulb, BookmarkPlus, Wallet } from 'lucide-react'
import { placeBet } from '@/app/actions'
import { GoToBookmaker } from '@/components/beregn/go-to-bookmaker'
import { markId } from '@/components/beregn/mark-id'
import { LockedOdds, useHasAccess } from '@/components/locked-odds'
import { BookmakerMark } from '@/components/sb/BookmakerMark'
import { ValueGauge } from '@/components/sb/ValueGauge'
import type { Opportunity } from '@/lib/data'
import { formatInt, formatOdds, formatPct, guaranteedProfit, splitStake } from '@/lib/odds'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/locale-provider'

const PRESETS = [500, 1000, 1500, 2000]
const MAX = 1_000_000

function parseAmount(v: string) {
  const n = Number(v.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), MAX) : 0
}

function AmountInput({
  id,
  value,
  onChange,
  large,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  large?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center rounded-xl border border-border-glow/50 bg-surface-deep/80 px-4 transition focus-within:border-primary-glow focus-within:shadow-glow',
        large ? 'h-14' : 'h-12',
      )}
    >
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 7))}
        className={cn('w-full min-w-0 bg-transparent font-extrabold tabular-nums text-foreground outline-none', large ? 'text-[24px]' : 'text-[20px]')}
      />
      <span className="text-[13px] font-semibold text-muted-foreground">DKK</span>
    </div>
  )
}

export function Calculator({ opportunity: o }: { opportunity: Opportunity }) {
  const { t } = useLocale()
  const router = useRouter()
  const loggedIn = useHasAccess()
  const initial = splitStake(1500, o.a.odds, o.b.odds)
  const [total, setTotal] = useState('1500')
  const [stakeA, setStakeA] = useState(String(initial.a))
  const [stakeB, setStakeB] = useState(String(initial.b))
  const [swapped, setSwapped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [handedOff, setHandedOff] = useState<'a' | 'b' | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [saving, startSaving] = useTransition()

  const a = parseAmount(stakeA)
  const b = parseAmount(stakeB)
  const sum = a + b
  const profit = sum > 0 ? guaranteedProfit(a, b, o.a.odds, o.b.odds) : 0
  const margin = sum > 0 ? (profit / sum) * 100 : 0
  const positive = profit >= 0

  function applyTotal(value: string) {
    setTotal(value)
    const split = splitStake(parseAmount(value), o.a.odds, o.b.odds)
    setStakeA(String(split.a))
    setStakeB(String(split.b))
  }

  function applyA(value: string) {
    setStakeA(value)
    const nextB = Math.round((parseAmount(value) * o.a.odds) / o.b.odds)
    setStakeB(String(nextB))
    setTotal(String(parseAmount(value) + nextB))
  }

  function applyB(value: string) {
    setStakeB(value)
    const nextA = Math.round((parseAmount(value) * o.b.odds) / o.a.odds)
    setStakeA(String(nextA))
    setTotal(String(nextA + parseAmount(value)))
  }

  async function copyStakes() {
    const text = [
      `${o.homeTeam} vs ${o.awayTeam} – ${o.market}`,
      `${o.a.bookmaker} (${o.a.label}${loggedIn ? ` @ ${formatOdds(o.a.odds)}` : ''}): ${formatInt(a)} DKK`,
      `${o.b.bookmaker} (${o.b.label}${loggedIn ? ` @ ${formatOdds(o.b.odds)}` : ''}): ${formatInt(b)} DKK`,
      `${t('guaranteedProfit')}: ${formatInt(profit)} DKK (${formatPct(margin)})`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage({ ok: false, text: t('copyFailed') })
    }
  }

  function handOff(key: 'a' | 'b', value: string) {
    navigator.clipboard
      .writeText(String(parseAmount(value)))
      .then(() => setHandedOff(key))
      .catch(() => setHandedOff(null))
  }

  function save() {
    setMessage(null)
    startSaving(async () => {
      const res = await placeBet({ opportunityId: o.id, stakeA: a, stakeB: b })
      if (res.ok) {
        router.push('/stats')
      } else {
        setMessage({ ok: false, text: res.error })
      }
    })
  }

  const ordered = [
    { key: 'a', side: o.a, value: stakeA, onChange: applyA },
    { key: 'b', side: o.b, value: stakeB, onChange: applyB },
  ] as const
  const sides = swapped ? [ordered[1], ordered[0]] : ordered
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <section aria-label={t('stakesAria')} className="sb-panel panel-glow edge-light relative flex flex-col gap-3 p-3.5 lg:gap-4 lg:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          <div className="min-w-0 flex-1">
            <label htmlFor="total" className="mb-2 block text-[15px] font-bold">
              {t('totalStakeDkk')}
            </label>
            <AmountInput id="total" value={total} onChange={applyTotal} large />
          </div>
          <div className="grid grid-cols-4 gap-2 md:w-[46%]" role="group" aria-label={t('quickAmounts')}>
            {PRESETS.map((p) => {
              const active = parseAmount(total) === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyTotal(String(p))}
                  aria-pressed={active}
                  className={cn(
                    'h-11 rounded-lg border text-[14px] font-bold tabular-nums transition',
                    active
                      ? 'bg-gradient-primary border-transparent text-primary-foreground shadow-glow'
                      : 'chip-surface border-border text-foreground hover:border-border-glow',
                  )}
                >
                  {formatInt(p)}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
          {sides.map(({ key, side, value, onChange }, index) => (
            <Fragment key={key}>
              {index === 1 && (
                <button
                  type="button"
                  onClick={() => setSwapped((v) => !v)}
                  aria-label={t('swapAria')}
                  className="glass-pill hidden size-12 items-center justify-center rounded-full text-primary-glow transition hover:brightness-125 lg:flex"
                >
                  <ArrowLeftRight className="size-5" aria-hidden="true" />
                </button>
              )}
              <div className="leg-row flex min-w-0 flex-col gap-3 rounded-xl p-3 hover:translate-x-0 lg:p-4">
                <div className="flex items-center gap-3">
                  <span className="chip-surface flex h-12 w-[112px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border">
                    <BookmakerMark id={markId(side.bookmaker)} />
                  </span>
                  <p className="min-w-0 flex-1 break-words text-[14px] font-semibold leading-tight text-foreground/90 lg:text-[15px]">{side.label}</p>
                  <span className="odds-chip shrink-0 rounded-lg border px-3 py-1.5">
                    <LockedOdds odds={side.odds} className="text-[20px] font-extrabold tabular-nums lg:text-[24px]" />
                  </span>
                </div>
                <div>
                  <label htmlFor={`stake-${key}`} className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">
                    {t('yourStake')}
                  </label>
                  <AmountInput id={`stake-${key}`} value={value} onChange={onChange} />
                </div>
                <GoToBookmaker
                  bookmaker={side.bookmaker}
                  label={side.label}
                  homeTeam={o.homeTeam}
                  awayTeam={o.awayTeam}
                  kickoffTs={o.kickoffTs}
                  sport={o.sport}
                  league={o.league}
                  country={o.country}
                  amount={parseAmount(value)}
                  handedOff={handedOff === key}
                  onHandOff={() => handOff(key, value)}
                />
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-4">
        <section
          aria-label={t('colResult')}
          aria-live="polite"
          className={cn(
            'sb-panel relative flex items-center gap-4 overflow-hidden p-4 lg:gap-6 lg:p-5',
            positive ? 'panel-glow' : 'border-destructive/60',
          )}
        >
          <ValueGauge display={formatPct(margin)} label={t('margin')} progress={positive ? margin / 5 : 0} size={116} />
          <dl className="flex min-w-0 flex-1 flex-col gap-3">
            <div>
              <dt className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
                <Wallet className="size-4 text-success" aria-hidden="true" /> {t('guaranteedProfit')}
              </dt>
              <dd
                className={cn(
                  'mt-0.5 text-[30px] font-extrabold leading-none tabular-nums lg:text-[36px]',
                  positive ? 'text-glow-success text-success' : 'text-destructive',
                )}
              >
                {formatInt(profit)} <span className="text-[14px] font-bold text-foreground">DKK</span>
              </dd>
            </div>
            <div className="border-t border-border pt-3">
              <dt className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
                <Database className="size-4 text-cyan" aria-hidden="true" /> {t('totalStake')}
              </dt>
              <dd className="mt-0.5 text-[20px] font-extrabold leading-none tabular-nums lg:text-[22px]">
                {formatInt(sum)} <span className="text-[13px] font-bold text-muted-foreground">DKK</span>
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={copyStakes}
            disabled={sum === 0}
            className="btn-hero btn-shine relative flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-xl text-[17px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            {copied ? <Check className="size-6" aria-hidden="true" /> : <Copy className="size-6" aria-hidden="true" />}
            {copied ? t('copied') : t('copyStakes')}
          </button>

          <button
            type="button"
            onClick={save}
            disabled={sum === 0 || saving}
            className="sb-btn-ghost-glass flex min-h-12 items-center justify-center gap-2.5 rounded-xl text-[15px] font-semibold text-primary-glow transition hover:brightness-125 disabled:opacity-50"
          >
            <BookmarkPlus className="size-5" aria-hidden="true" />
            {saving ? t('saving') : t('saveOpenBet')}
          </button>
          {message && (
            <p role="alert" className={cn('text-center text-sm', message.ok ? 'text-success' : 'text-destructive')}>
              {message.text}
            </p>
          )}

          <aside className="sb-panel edge-light relative flex flex-1 gap-3 p-4">
            <Lightbulb className="mt-0.5 size-6 shrink-0 fill-gold text-gold drop-shadow-[0_0_8px_var(--gold)]" aria-hidden="true" />
            <div>
              <h2 className="text-[15px] font-bold">{t('howItWorks')}</h2>
              <p className="mt-1 text-pretty text-[14px] leading-relaxed text-foreground/85">
                {t('howText')}{' '}
                <strong className="text-success">{formatInt(profit)} DKK</strong> ({formatPct(margin)}).
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
