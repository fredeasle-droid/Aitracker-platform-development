"use client"

import { useEffect, useState } from "react"

type Offer = { bookmaker: string; american: number; decimal: number; line: string | number | null }
type Opportunity = { matchup: string; market: string; profitPct: number; legs: { side: string; bookmaker: string; odds: number; line: string | number | null; stakePct: number }[] }
type Event = Record<string, any>

function americanToDecimal(odds: number) { return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1 }
function calculateArbitrage(odds: number[]) {
  const implied = odds.reduce((sum, odd) => sum + 1 / odd, 0)
  if (implied >= 1) return null
  return { profitPct: (1 / implied - 1) * 100, stakes: odds.map((odd) => (100 / odd) / implied) }
}

function findArbitrage(events: Event[]): Opportunity[] {
  const opportunities: Opportunity[] = []
  for (const event of events) {
    const away = event.teams?.away?.names?.long ?? event.teams?.away?.name ?? "Away"
    const home = event.teams?.home?.names?.long ?? event.teams?.home?.name ?? "Home"
    const markets: Record<string, Record<string, Record<string, Offer[]>>> = {}
    for (const odd of Object.values(event.odds ?? {}) as any[]) {
      const betType = odd.betTypeID
      const side = odd.sideID
      const period = odd.periodID ?? "game"
      if (period !== "game" || !["sp", "ml", "ou"].includes(betType)) continue
      for (const [bookmaker, data] of Object.entries(odd.byBookmaker ?? {}) as [string, any][]) {
        if (data?.available === false || data?.odds === undefined || data?.odds === null) continue
        const american = Number(data.odds)
        if (!Number.isFinite(american)) continue
        const line = betType === "sp" ? data.spread ?? null : betType === "ou" ? data.overUnder ?? null : null
        ;(markets[betType] ||= {})[period] ||= {}
        ;(markets[betType][period][side] ||= []).push({ bookmaker, american, decimal: americanToDecimal(american), line })
      }
    }
    for (const [betType, periods] of Object.entries(markets)) for (const [period, sides] of Object.entries(periods)) {
      const pair: [string, string] | null = betType === "ou" ? ["over", "under"] : betType === "sp" || betType === "ml" ? ["home", "away"] : null
      if (!pair || !sides[pair[0]]?.length || !sides[pair[1]]?.length) continue
      const best = pair.map((side) => sides[side].reduce((a, b) => b.decimal > a.decimal ? b : a))
      const arb = calculateArbitrage(best.map((offer) => offer.decimal))
      if (!arb) continue
      opportunities.push({ matchup: `${away} @ ${home}`, market: betType === "sp" ? "Spread" : betType === "ou" ? "Total" : "Moneyline", profitPct: arb.profitPct, legs: best.map((offer, index) => ({ side: pair[index], bookmaker: offer.bookmaker, odds: offer.american, line: offer.line, stakePct: arb.stakes[index] })) })
    }
  }
  return opportunities.sort((a, b) => b.profitPct - a.profitPct)
}

export default function OddsApiTestPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { fetch("/api/sportsgameodds?sportID=SOCCER&leagueID=EPL&limit=100").then((response) => { if (!response.ok) throw new Error(`API returned ${response.status}`); return response.json() }).then((payload) => setEvents(Array.isArray(payload?.data?.data) ? payload.data.data : [])).catch((reason) => setError(reason instanceof Error ? reason.message : "API error")).finally(() => setLoading(false)) }, [])
  const opportunities = findArbitrage(events)
  return <main className="min-h-screen bg-white px-4 py-8 text-slate-950"><div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds</p><h1 className="mt-2 text-3xl font-bold">Arbitrage calculator</h1><p className="mt-2 text-slate-600">Ported directly from the official SportsGameOdds GitHub example.</p><div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm"><p><strong>Request:</strong> SOCCER · EPL · finalized=false · oddsAvailable=true · limit=100</p><p className="mt-1"><strong>Status:</strong> {loading ? "Loading…" : error ?? `${events.length} events · ${opportunities.length} opportunities`}</p></div>{!loading && !error && <section className="mt-6 space-y-4">{opportunities.slice(0, 30).map((opportunity, index) => <article key={`${opportunity.matchup}-${opportunity.market}-${index}`} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-slate-500">#{index + 1} · {opportunity.market}</p><h2 className="font-bold">{opportunity.matchup}</h2></div><strong className="text-emerald-700">+{opportunity.profitPct.toFixed(2)}%</strong></div><div className="mt-4 space-y-2">{opportunity.legs.map((leg) => <div key={`${leg.side}-${leg.bookmaker}`} className="rounded-md bg-white p-3 text-sm"><div className="flex justify-between"><strong>{leg.side.toUpperCase()} {leg.line ?? ""}</strong><span>{leg.odds > 0 ? "+" : ""}{leg.odds}</span></div><div className="mt-1 text-xs text-slate-500">{leg.bookmaker} · Stake {leg.stakePct.toFixed(2)}%</div></div>)}</div></article>)}{opportunities.length === 0 && <p className="rounded-lg border border-slate-200 p-4 text-slate-600">No arbitrage opportunities found.</p>}</section>}</div></main>
}
