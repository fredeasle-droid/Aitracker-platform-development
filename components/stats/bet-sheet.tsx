'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Trash2, X } from 'lucide-react'
import { deleteBet, reopenBet, settleBet } from '@/app/actions'
import type { BetRow } from '@/lib/data'
import { formatInt, formatSigned } from '@/lib/odds'

export function BetSheet({ bet, onClose }: { bet: BetRow; onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [loss, setLoss] = useState(String(Math.round(bet.stake)))
  const [error, setError] = useState<string | null>(null)

  function run(fn: () => Promise<{ ok: boolean; error?: string } | void>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res && !res.ok) {
        setError(res.error ?? 'Noget gik galt')
        return
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="bet-sheet-title">
      <button type="button" aria-label="Luk" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="bet-sheet-title" className="text-lg font-bold">
              {bet.match}
            </h2>
            <p className="text-sm text-muted-foreground">{bet.market}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Luk" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-accent">
            <X className="size-5" />
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-[#0a1426] p-3">
            <dt className="text-muted-foreground">Indsats</dt>
            <dd className="text-lg font-bold">{formatInt(bet.stake)} DKK</dd>
          </div>
          <div className="rounded-xl bg-[#0a1426] p-3">
            <dt className="text-muted-foreground">{bet.status === 'open' ? 'Forventet gevinst' : 'Resultat'}</dt>
            <dd className={`text-lg font-bold ${(bet.profit ?? bet.expectedProfit) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatSigned(bet.status === 'open' ? bet.expectedProfit : bet.profit ?? 0)} DKK
            </dd>
          </div>
        </dl>

        {bet.status === 'open' ? (
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => settleBet(bet.id, 'won'))}
              className="min-h-12 rounded-xl bg-[#137a4a] font-semibold text-white disabled:opacity-50"
            >
              Markér som vundet ({formatSigned(bet.expectedProfit)} DKK)
            </button>
            <div className="flex gap-2">
              <label className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-border bg-[#0a1426] px-3">
                <span className="sr-only">Tabt beløb</span>
                <span className="mr-1 text-destructive">-</span>
                <input
                  inputMode="numeric"
                  value={loss}
                  onChange={(e) => setLoss(e.target.value.replace(/[^\d]/g, '').slice(0, 7))}
                  className="w-full min-w-0 bg-transparent text-base font-semibold outline-none"
                />
                <span className="text-sm text-muted-foreground">DKK</span>
              </label>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => settleBet(bet.id, 'lost', Number(loss || 0)))}
                className="min-h-12 shrink-0 rounded-xl bg-[#b3262d] px-4 font-semibold text-white disabled:opacity-50"
              >
                Markér tabt
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => reopenBet(bet.id))}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary/60 font-semibold text-primary disabled:opacity-50"
          >
            <RotateCcw className="size-4" /> Genåbn væddemål
          </button>
        )}

        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => deleteBet(bet.id))}
          className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          <Trash2 className="size-4" /> Slet væddemål
        </button>
        {error && (
          <p role="alert" className="mt-2 text-center text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
