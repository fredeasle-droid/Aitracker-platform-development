"use client"

import { useEffect, useState } from "react"

type Event = Record<string, any>
type Leg = { side: string; bookmaker: string; odds: number; decimal: number; line: number | string | null; stakePct: number }
type Opportunity = { matchup: string; market: string; profitPct: number; legs: Leg[] }

function americanToDecimal(american: unknown) {
  const odds = Number(american)
  if (!Number.isFinite(odds) || odds === 0) return null
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1
}

function calculateArbitrage(odds: number[]) {
  const impliedProbabilitySum = odds.reduce((sum, odd) => sum + 1 / odd, 0)
  if (impliedProbabilitySum >= 1) return { hasArb: false, profitPct: 0, stakes: [] as number[] }
  return { hasArb: true, profitPct: (1 / impliedProbabilitySum - 1) * 100, stakes: odds.map((odd) => (100 / odd) / impliedProbabilitySum) }
}

function findArbitrage(events: Event[]): Opportunity[] {
  const opportunities: Opportunity[] = []
  for (const event of events) {
    const away = event.teams?.away?.names?.long ?? event.teams?.away?.name ?? "Away"
    const home = event.teams?.home?.names?.long ?? event.teams?.home?.name ?? "Home"
    const markets: Record<string, Record<string, Record<string, any[]>>> = {}
    for (const odd of Object.values(event.odds ?? {}) as any[]) {
      const betType = odd.betTypeID
      const side = odd.sideID
      const periodID = odd.periodID ?? "game"
      if (periodID !== "game") continue
      markets[betType] ??= {}
      markets[betType][periodID] ??= {}
      markets[betType][periodID][side] ??= []
      for (const [bookmaker, data] of Object.entries(odd.byBookmaker ?? {}) as [string, any][]) {
        if (data.available === false || !data.odds) continue
        const american = Number(data.odds)
        const decimal = americanToDecimal(american)
        if (decimal === null) continue
        const line = betType === "sp" ? data.spread : data.overUnder
        markets[betType][periodID][side].push({ bookmaker, american, decimal, line })
      }
    }
    for (const [betType, periods] of Object.entries(markets)) {
      for (const [periodID, sides] of Object.entries(periods)) {
        let sidePair: [string, string] | null = null
        let market = ""
        if (betType === "sp" || betType === "ml") { sidePair = ["home", "away"]; market = betType === "sp" ? "spread" : "moneyline" }
        else if (betType === "ou") { sidePair = ["over", "under"]; market = "total" }
        if (!sidePair || !sides[sidePair[0]]?.length || !sides[sidePair[1]]?.length) continue
        const bestA = sides[sidePair[0]].sort((a, b) => b.decimal - a.decimal)[0]
        const bestB = sides[sidePair[1]].sort((a, b) => b.decimal - a.decimal)[0]
        const result = calculateArbitrage([bestA.decimal, bestB.decimal])
        if (!result.hasArb) continue
        opportunities.push({ matchup: `${away} @ ${home}`, market, profitPct: result.profitPct, legs: [
          { side: sidePair[0], bookmaker: bestA.bookmaker, odds: bestA.american, decimal: bestA.decimal, line: bestA.line, stakePct: result.stakes[0] },
          { side: sidePair[1], bookmaker: bestB.bookmaker, odds: bestB.american, decimal: bestB.decimal, line: bestB.line, stakePct: result.stakes[1] },
        ]})
      }
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
  return <main className="min-h-screen bg-white px-4 py-8 text-slate-950"><div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds</p><h1 className="mt-2 text-3xl font-bold">Arbitrage calculator</h1><p className="mt-2 text-slate-600">Ported directly from the official SportsGameOdds GitHub example.</p><div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm"><p><strong>Request:</strong> soccer / EPL / oddsAvailable=true / limit=100</p><p className="mt-1"><strong>Status:</strong> {loading ? "Loading..." : error ?? `${events.length} events · ${opportunities.length} opportunities`}</p></div><section className="mt-6 space-y-4">{opportunities.map((opportunity, index) => <article key={`${opportunity.matchup}-${opportunity.market}-${index}`} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-lg font-bold">#{index + 1} {opportunity.matchup}</p><p className="text-sm font-semibold uppercase text-slate-600">{opportunity.market}</p></div><strong className="text-lg text-emerald-700">+{opportunity.profitPct.toFixed(2)}%</strong></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{opportunity.legs.map((leg) => <div key={`${leg.side}-${leg.bookmaker}`} className="rounded-md bg-white p-3 text-sm"><p className="font-bold">{leg.side}{leg.line !== null && leg.line !== undefined ? ` ${leg.line}` : ""}</p><p>{leg.bookmaker} · {leg.odds > 0 ? "+" : ""}{leg.odds}</p><p className="text-slate-500">Stake: {leg.stakePct.toFixed(2)}%</p></div>)}</div></article>)}</section>{!loading && !error && !opportunities.length && <p className="mt-6 rounded-lg border border-slate-200 p-4 text-slate-600">No arbitrage opportunities found.</p>}</div></main>
}
