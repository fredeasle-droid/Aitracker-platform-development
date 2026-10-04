'use client'

import { useEffect, useState } from 'react'

type Leg = { bookmaker: string; american: number; decimal: number; line?: string | number; side: string; stakePercent: number }
type Opportunity = { id: string; matchup: string; sport: string; league: string; market: string; profitPercent: number; legs: Leg[] }
type Market = { key: string; statID: string; betTypeID: string; sides: Record<string, { odds: number; american: number; spread?: string | number }> }
type Bookmaker = { bookmakerID: string; markets: Market[] }
type EventMarkets = { event: Record<string, any>; markets: Bookmaker[] }

const marketNames: Record<string, string> = { spread: 'Handicap', total: 'Over/Under', moneyline: 'Kampresultat' }
const sideNames: Record<string, string> = { home: 'Hjemmehold', away: 'Udehold', over: 'Over', under: 'Under' }

function decimal(value: number) { return value.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export function SportsGameOddsEventFeed() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [eventMarkets, setEventMarkets] = useState<EventMarkets[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sportsgameodds/arbitrage?leagueID=EPL', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? 'Kunne ikke beregne surebets')
        return payload.data as { opportunities: Opportunity[]; events: EventMarkets[] }
      })
      .then((data) => { setOpportunities(data.opportunities); setEventMarkets(data.events) })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Kunne ikke hente surebets'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-300">Scanner rå odds efter surebets…</p>
  if (error) return <p className="rounded-xl border border-red-900/70 bg-red-950/30 p-5 text-red-200">{error}</p>
  if (!opportunities.length && !eventMarkets.length) return <p className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-300">Ingen odds fundet lige nu.</p>

  return <div className="flex flex-col gap-3">
    <p className="text-sm text-slate-400">{opportunities.length} surebets · alle markeder grupperet efter bookmaker</p>
    {opportunities.map((opportunity) => <article key={opportunity.id} className="rounded-xl border border-emerald-900/70 bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-semibold text-white">{opportunity.matchup}</h2><p className="mt-1 text-sm text-slate-400">{opportunity.league} · {marketNames[opportunity.market]}</p></div><strong className="text-lg text-emerald-400">+{decimal(opportunity.profitPercent)}%</strong></div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opportunity.legs.map((leg) => <div key={`${leg.bookmaker}-${leg.side}`} className="rounded-lg border border-slate-700 bg-slate-950/70 p-3"><p className="font-medium text-white">{sideNames[leg.side]}</p><p className="text-sm text-slate-400">{leg.line ?? ''} · {leg.bookmaker}</p><p className="mt-1 text-xl font-semibold text-blue-300">{decimal(leg.decimal)}</p><p className="text-xs text-slate-500">Indsats: {decimal(leg.stakePercent)}%</p></div>)}
      </div>
    </article>)}
    {eventMarkets.map(({ event, markets }) => <section key={String(event.eventID ?? event.id)} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="font-semibold text-white">{String(event.eventID ?? 'Kamp')}</h2>
      <div className="mt-3 overflow-x-auto"><div className="flex min-w-max gap-3">
        {markets.map((bookmaker) => <div key={bookmaker.bookmakerID} className="w-64 rounded-lg border border-slate-700 bg-slate-950/70 p-3"><h3 className="font-medium text-blue-200">{bookmaker.bookmakerID}</h3>
          {bookmaker.markets.map((market) => <div key={market.key} className="mt-3 border-t border-slate-800 pt-2"><p className="text-xs text-slate-400">{market.statID} · {market.betTypeID}</p>{Object.entries(market.sides).map(([side, quote]) => <p key={side} className="flex justify-between text-sm text-slate-200"><span>{side}{quote.spread != null ? ` ${quote.spread}` : ''}</span><strong>{decimal(quote.odds)}</strong></p>)}</div>)}
        </div>)}
      </div></div>
    </section>)}
  </div>
}
