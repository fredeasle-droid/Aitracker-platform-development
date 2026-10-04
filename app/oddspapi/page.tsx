'use client'

import { useEffect, useState } from 'react'

type Event = Record<string, any>
type Surebet = { event: string; league: string; market: string; profit: number; picks: { outcome: string; bookmaker: string; odds: number; decimal: number }[] }

function toDecimal(value: unknown) {
  const odds = Number(value)
  if (!Number.isFinite(odds)) return null
  return odds >= 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1
}

function findSurebets(events: Event[]): Surebet[] {
  return events.flatMap((event) => {
    const groups: Record<string, { outcome: string; market: any }[]> = {}
    Object.entries(event.odds ?? {}).forEach(([oddID, market]) => {
      const parts = oddID.split('-')
      const outcome = parts.pop() ?? oddID
      const marketID = parts.join('-')
      ;(groups[marketID] ||= []).push({ outcome, market })
    })

    return Object.entries(groups).flatMap(([market, outcomes]) => {
      const picks = outcomes.map(({ outcome, market: outcomeMarket }) => {
        const best = Object.entries(outcomeMarket?.byBookmaker ?? {}).map(([bookmaker, quote]: [string, any]) => {
          const decimal = toDecimal(quote?.odds)
          return decimal ? { outcome, bookmaker, odds: Number(quote.odds), decimal } : null
        }).filter(Boolean).sort((a: any, b: any) => b.decimal - a.decimal)[0]
        return best
      }).filter(Boolean) as Surebet['picks']
      const outcomesCovered = new Set(picks.map((pick) => pick.outcome)).size
      if (picks.length < 2 || outcomesCovered < 2) return []
      const arbitrage = picks.reduce((sum, pick) => sum + 1 / pick.decimal, 0)
      if (arbitrage >= 1) return []
      return [{ event: event.teams ? `${event.teams.home?.name ?? event.teams.home?.teamID} – ${event.teams.away?.name ?? event.teams.away?.teamID}` : event.eventID, league: event.leagueID ?? 'Ukendt liga', market, profit: (1 / arbitrage - 1) * 100, picks }]
    })
  }).sort((a, b) => b.profit - a.profit).slice(0, 30)
}

export default function OddsApiTestPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sportsgameodds?sportID=SOCCER&leagueID=EPL&limit=100')
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok || !payload.ok) throw new Error(payload.data?.error?.message || `API-fejl (${response.status})`)
        const data = payload.data?.data ?? payload.data?.events ?? payload.data ?? []
        setEvents(Array.isArray(data) ? data : [])
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Kunne ikke hente data.'))
      .finally(() => setLoading(false))
  }, [])

  const surebets = findSurebets(events)

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds</p>
        <h1 className="mt-2 text-3xl font-bold">Raw API-data</h1>
        <p className="mt-2 text-slate-600">SOCCER · EPL · oddsAvailable=true · includeAltLines=false · limit=100</p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <strong>Status:</strong> {loading ? 'Henter…' : error ? 'Fejl' : `${events.length} events hentet`} · <strong>Top 30 surebets:</strong> {surebets.length}
        </div>
        {!loading && !error && surebets.length > 0 && <section className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4"><h2 className="text-lg font-bold">Surebets efter profit</h2><div className="mt-3 space-y-2">{surebets.map((surebet, index) => <div key={`${surebet.event}-${surebet.market}`} className="rounded-md bg-white p-3"><div className="flex justify-between gap-3"><strong>#{index + 1} · {surebet.event}</strong><strong className="text-emerald-700">+{surebet.profit.toFixed(2)}%</strong></div><p className="mt-1 text-xs text-slate-500">{surebet.league} · {surebet.market}</p><p className="mt-2 text-sm">{surebet.picks.map((pick) => `${pick.outcome}: ${pick.bookmaker} ${pick.odds}`).join(' · ')}</p></div>)}</div></section>}
        {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-6 space-y-6">
          {events.map((event) => {
            const markets = Object.entries(event.odds ?? {})
            const bookmakers = new Set(markets.flatMap(([, market]: [string, any]) => Object.keys(market?.byBookmaker ?? {})))
            return (
              <article key={event.eventID} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold">{event.teams?.home?.name ?? event.teams?.home?.teamID ?? 'Hjemme'} – {event.teams?.away?.name ?? event.teams?.away?.teamID ?? 'Ude'}</h2>
                <p className="mt-1 text-sm text-slate-500">{event.leagueID ?? 'Ukendt liga'} · {event.eventID}</p>
                <p className="mt-4 text-sm"><strong>{markets.length}</strong> markeder · <strong>{bookmakers.size}</strong> bookmakere</p>
                <div className="mt-4 space-y-3">
                  {markets.map(([marketID, market]: [string, any]) => (
                    <details key={marketID} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <summary className="cursor-pointer break-all text-sm font-semibold">{marketID}</summary>
                      <div className="mt-3 space-y-2 text-sm">
                        {Object.entries(market?.byBookmaker ?? {}).map(([bookmaker, quote]: [string, any]) => (
                          <div key={bookmaker} className="flex items-center justify-between gap-4 rounded-md bg-white px-3 py-2">
                            <span>{bookmaker}</span><strong>{quote?.odds ?? '—'}</strong>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
        {!loading && !error && events.length === 0 && <p className="py-12 text-center text-slate-500">Ingen events fundet.</p>}
      </div>
    </main>
  )
}
