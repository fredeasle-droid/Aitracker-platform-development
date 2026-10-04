'use client'

import type { TestSurebetOpportunity } from '@/types/surebet-test'
import { useMemo, useState } from 'react'

export function FeedTestOpportunityList({ initial }: { initial: TestSurebetOpportunity[] }) {
  const [sport, setSport] = useState('Alle')
  const sports = useMemo(() => ['Alle', ...Array.from(new Set(initial.map((item) => item.sport)))], [initial])
  const visible = sport === 'Alle' ? initial : initial.filter((item) => item.sport === sport)

  return (
    <section className="px-4 pb-8">
      <div className="mb-4 flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {sports.map((item) => (
          <button
            key={item}
            onClick={() => setSport(item)}
            className={sport === item
              ? 'shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground'
              : 'shrink-0 rounded-xl border border-border bg-[#081123] px-4 py-2 text-sm font-medium text-foreground'}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold">Ingen test-SikkerBets fundet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Feedet svarer enten uden arbitrage eller dataformatet skal tilpasses SportsGameOdds.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((opportunity) => (
            <article key={opportunity.id} className="rounded-2xl border border-[#193451] bg-[#071326] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{opportunity.sport} · {opportunity.league}</p>
                  <h2 className="mt-1 font-bold">{opportunity.match}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{opportunity.market}</p>
                </div>
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase text-emerald-300">Margin</p>
                  <p className="text-xl font-extrabold text-emerald-300">{opportunity.profitPercentage.toFixed(2)}%</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {opportunity.legs.map((leg) => (
                  <div key={leg.selection + leg.bookmaker} className="flex items-center justify-between rounded-xl border border-[#193451] bg-[#0a172b] p-3">
                    <div>
                      <p className="font-semibold">{leg.selection}</p>
                      <p className="text-xs text-muted-foreground">{leg.bookmaker}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{leg.odds.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Indsats {leg.stake.toFixed(2)} kr.</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>Investering: {opportunity.totalInvestment.toFixed(2)} kr.</span>
                <span>Garanti: {opportunity.guaranteedReturn.toFixed(2)} kr.</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
