"use client"

import { useEffect, useMemo, useState } from "react"

type Event = Record<string, any>
type Quote = { bookmaker: string; american: number; decimal: number; line: string | null }
type Opportunity = { event: string; league: string; market: string; profit: number; legs: { side: string; quote: Quote; stakePct: number }[] }

function americanToDecimal(value: unknown) {
  const american = Number(value)
  if (!Number.isFinite(american) || american === 0) return null
  return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
}

function findBest(values: any[], side: string, line: string | null): Quote | null {
  const quotes = values.flatMap((odd) => Object.entries(odd.byBookmaker ?? {}).map(([bookmaker, data]: [string, any]) => {
    if (data?.available === false) return null
    const decimal = americanToDecimal(data?.odds)
    if (!decimal) return null
    return { bookmaker, american: Number(data.odds), decimal, line }
  }).filter(Boolean) as Quote[])
  return quotes.filter((quote) => quote.decimal > 1).sort((a, b) => b.decimal - a.decimal)[0] ?? null
}

function findOpportunities(events: Event[]): Opportunity[] {
  return events.flatMap((event) => {
    const markets = new Map<string, Map<string, any[]>>()
    for (const odd of Object.values(event.odds ?? {}) as any[]) {
      const betType = odd.betTypeID
      const period = odd.periodID ?? "game"
      if (!['sp', 'ou', 'ml'].includes(betType) || period !== 'game') continue
      const line = betType === 'sp' ? String(odd.spread ?? '') : betType === 'ou' ? String(odd.overUnder ?? '') : ''
      const marketKey = `${betType}|${period}|${line}`
      const sides = markets.get(marketKey) ?? new Map<string, any[]>()
      const side = odd.sideID
      sides.set(side, [...(sides.get(side) ?? []), odd])
      markets.set(marketKey, sides)
    }

    return [...markets.entries()].flatMap(([marketKey, sides]) => {
      const [betType, , line] = marketKey.split('|')
      const required = betType === 'ou' ? ['over', 'under'] : ['home', 'away']
      if (!required.every((side) => sides.has(side))) return []
      const legs = required.map((side) => {
        const quote = findBest(sides.get(side) ?? [], side, line || null)
        return quote ? { side, quote, stakePct: 0 } : null
      })
      if (legs.some((leg) => !leg)) return []
      const validLegs = legs as Opportunity['legs']
      const implied = validLegs.reduce((sum, leg) => sum + 1 / leg.quote.decimal, 0)
      if (implied >= 1) return []
      const profit = (1 / implied - 1) * 100
      const normalized = validLegs.map((leg) => ({ ...leg, stakePct: ((1 / leg.quote.decimal) / implied) * 100 }))
      const home = event.teams?.home?.names?.long ?? event.teams?.home?.name ?? event.teams?.home?.teamID ?? 'Home'
      const away = event.teams?.away?.names?.long ?? event.teams?.away?.name ?? event.teams?.away?.teamID ?? 'Away'
      return [{ event: `${away} @ ${home}`, league: event.leagueID ?? 'Unknown league', market: betType === 'ou' ? `Total ${line}` : betType === 'sp' ? `Spread ${line}` : 'Moneyline', profit, legs: normalized }]
    })
  }).sort((a, b) => b.profit - a.profit).slice(0, 30)
}

export default function OddsApiTestPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/sportsgameodds?sportID=SOCCER&leagueID=EPL&limit=100")
      .then((response) => { if (!response.ok) throw new Error(`API returned ${response.status}`); return response.json() })
      .then((payload) => setEvents(Array.isArray(payload?.data?.data) ? payload.data.data : []))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "API error"))
      .finally(() => setLoading(false))
  }, [])

  const opportunities = useMemo(() => findOpportunities(events), [events])

  return <main className="min-h-screen bg-white px-4 py-8 text-slate-950"><div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds</p><h1 className="mt-2 text-3xl font-bold">Arbitrage calculator test</h1><p className="mt-2 text-slate-600">Guided market grouping: full-game 2-outcome spread, totals and moneyline.</p><div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm"><p><strong>Request:</strong> SOCCER · EPL · oddsAvailable=true · limit=100</p><p className="mt-1"><strong>Status:</strong> {loading ? "Loading…" : error ?? `${events.length} events · ${opportunities.length} opportunities`}</p></div>{!loading && !error && <section className="mt-6 space-y-3"><h2 className="text-xl font-bold">Top opportunities</h2>{opportunities.length === 0 ? <p className="rounded-lg border border-amber-200 bg-amber-50 p-4">No complete 2-outcome arbitrage opportunities found.</p> : opportunities.map((opportunity, index) => <article key={`${opportunity.event}-${opportunity.market}`} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">#{index + 1} · {opportunity.league}</p><h3 className="font-bold">{opportunity.event}</h3><p className="text-sm text-slate-600">{opportunity.market}</p></div><strong className="text-emerald-700">+{opportunity.profit.toFixed(2)}%</strong></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{opportunity.legs.map((leg) => <div key={leg.side} className="rounded-md bg-white p-3 text-sm"><strong>{leg.side}</strong><p>{leg.quote.bookmaker} · {leg.quote.american > 0 ? `+${leg.quote.american}` : leg.quote.american}</p><p>Decimal {leg.quote.decimal.toFixed(3)} · Stake {leg.stakePct.toFixed(2)}%</p>{leg.quote.line && <p>Line {leg.quote.line}</p>}</div>)}</div></article>)}</section>}</div></main>
}
