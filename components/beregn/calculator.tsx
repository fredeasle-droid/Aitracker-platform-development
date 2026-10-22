'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Database, ExternalLink, Info, BookmarkPlus, Wallet } from 'lucide-react'
import { placeBet } from '@/app/actions'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { SmallBarsIcon } from '@/components/icons'
import { getBookmaker } from '@/lib/bookmakers'
import type { Opportunity } from '@/lib/data'
import { formatInt, formatOdds, formatPct, guaranteedProfit, splitStake } from '@/lib/odds'
import { cn } from '@/lib/utils'

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
        'flex items-center rounded-xl border border-[#2a3a5c] bg-[#0a1426] px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30',
        large ? 'h-14' : 'h-12',
      )}
    >
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 7))}
        className={cn('w-full min-w-0 bg-transparent font-semibold tabular-nums outline-none', large ? 'text-[22px]' : 'text-[19px]')}
      />
      <span className="text-sm text-[#a9b6d3]">DKK</span>
    </div>
  )
}

export function Calculator({ opportunity: o }: { opportunity: Opportunity }) {
  const router = useRouter()
  const initial = splitStake(1500, o.a.odds, o.b.odds)
  const [total, setTotal] = useState('1500')
  const [stakeA, setStakeA] = useState(String(initial.a))
  const [stakeB, setStakeB] = useState(String(initial.b))
  const [copied, setCopied] = useState(false)
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
      `${o.a.bookmaker} (${o.a.label} @ ${formatOdds(o.a.odds)}): ${formatInt(a)} DKK`,
      `${o.b.bookmaker} (${o.b.label} @ ${formatOdds(o.b.odds)}): ${formatInt(b)} DKK`,
      `Sikker gevinst: ${formatInt(profit)} DKK (${formatPct(margin)})`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage({ ok: false, text: 'Kunne ikke kopiere. Prøv igen.' })
    }
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

  const sides = [
    { key: 'a', side: o.a, value: stakeA, onChange: applyA },
    { key: 'b', side: o.b, value: stakeB, onChange: applyB },
  ] as const

  return (
    <div className="mt-3 flex flex-col gap-3">
      <section aria-label="Indsatser" className="rounded-2xl border border-border bg-card/80 p-2">
        <div className="flex flex-col gap-3 p-1.5 pb-3 min-[380px]:flex-row min-[380px]:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="total" className="mb-2 block text-[16px] font-semibold">
              Total indsats (DKK)
            </label>
            <AmountInput id="total" value={total} onChange={applyTotal} large />
          </div>
          <div className="grid grid-cols-4 gap-1.5 min-[380px]:w-[52%]" role="group" aria-label="Hurtige beløb">
            {PRESETS.map((p) => {
              const active = parseAmount(total) === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyTotal(String(p))}
                  aria-pressed={active}
                  className={cn(
                    'h-11 rounded-lg border text-[13px] font-medium tabular-nums transition-colors',
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-[#0a1426] hover:bg-accent',
                  )}
                >
                  {formatInt(p)}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sides.map(({ key, side, value, onChange }) => (
            <div key={key} className="flex flex-col gap-2 rounded-xl border border-border bg-[#081123] p-2">
                <div className="flex items-center gap-1.5 p-0.5 min-[400px]:gap-2 min-[400px]:p-1">
                  <BookmakerLogo name={side.bookmaker} className="size-9 shrink-0 min-[400px]:size-11" />
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-[13px] font-semibold leading-tight">{side.bookmaker}</p>
                    <p className="break-words text-[12px] leading-tight text-[#a9b6d3]">{side.label}</p>
                  </div>
                  <p className="shrink-0 text-[19px] font-extrabold tabular-nums text-primary min-[400px]:text-[22px]">
                    {formatOdds(side.odds)}
                  </p>
                </div>
              <div className="rounded-xl border border-border bg-[#0a1426]/60 p-2">
                <label htmlFor={`stake-${key}`} className="mb-1.5 block text-[13px] text-[#d5ddef]">
                  Din indsats
                </label>
                <AmountInput id={`stake-${key}`} value={value} onChange={onChange} />
              </div>
              <a
                href={getBookmaker(side.bookmaker).url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-2 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-[#2a85ff]"
              >
                Gå til bookmaker
                <ExternalLink className="size-4 shrink-0" />
                <span className="sr-only">(åbner {side.bookmaker} i ny fane)</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-label="Resultat"
        aria-live="polite"
        className={cn(
          'grid grid-cols-3 rounded-2xl border bg-[radial-gradient(100%_140%_at_50%_0%,rgba(46,230,166,0.10),rgba(5,15,22,0.9))] py-3',
          positive ? 'border-success/70 shadow-[0_0_30px_-14px_var(--success)]' : 'border-destructive/70',
        )}
      >
        <div className="flex flex-col items-center px-1.5">
          <span className="flex items-center gap-1.5 text-[12px] text-[#d5ddef]">
            <Database className="size-4" /> Total indsats
          </span>
          <span className="mt-1 text-[22px] font-extrabold tabular-nums">
            {formatInt(sum)} <span className="text-[12px] font-bold">DKK</span>
          </span>
        </div>
        <div className="flex flex-col items-center border-x border-border px-1.5">
          <span className="flex items-center gap-1.5 text-[12px] text-[#d5ddef]">
            <Wallet className="size-4" /> Sikker gevinst
          </span>
          <span className={cn('mt-1 text-[22px] font-extrabold tabular-nums', positive ? 'text-success' : 'text-destructive')}>
            {formatInt(profit)} <span className="text-[12px] font-bold text-foreground">DKK</span>
          </span>
        </div>
        <div className="flex flex-col items-center px-1.5">
          <span className="flex items-center gap-1.5 text-[12px] text-[#d5ddef]">
            <SmallBarsIcon className="size-4" /> Margin
          </span>
          <span className={cn('mt-1 text-[22px] font-extrabold tabular-nums', positive ? 'text-success' : 'text-destructive')}>
            {formatPct(margin)}
          </span>
        </div>
      </section>

      <button
        type="button"
        onClick={copyStakes}
        disabled={sum === 0}
        className="flex min-h-14 items-center justify-center gap-3 rounded-xl bg-primary text-[17px] font-semibold text-primary-foreground shadow-[0_8px_24px_-10px_var(--primary)] transition-colors hover:bg-[#2a85ff] disabled:opacity-50"
      >
        {copied ? <Check className="size-6" /> : <Copy className="size-6" />}
        {copied ? 'Kopieret!' : 'Kopiér indsatser'}
      </button>

      <button
        type="button"
        onClick={save}
        disabled={sum === 0 || saving}
        className="flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-primary/60 bg-primary/10 text-[15px] font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
      >
        <BookmarkPlus className="size-5" />
        {saving ? 'Gemmer…' : 'Gem som åbent væddemål'}
      </button>
      {message && (
        <p role="alert" className={cn('text-center text-sm', message.ok ? 'text-success' : 'text-destructive')}>
          {message.text}
        </p>
      )}

      <aside className="flex gap-3 rounded-2xl border border-primary/50 bg-[#071833] p-4">
        <Info className="mt-0.5 size-6 shrink-0 fill-primary text-[#071833]" aria-hidden="true" />
        <div>
          <h2 className="text-[16px] font-semibold text-primary">Sådan virker det?</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-[#d5ddef]">
            Du placerer de viste indsatser hos de to bookmakere. Uanset hvilket resultat der sker, får du en sikker
            gevinst på{' '}
            <strong className="text-foreground">{formatInt(profit)} DKK</strong> ({formatPct(margin)}).
          </p>
        </div>
      </aside>
    </div>
  )
}
