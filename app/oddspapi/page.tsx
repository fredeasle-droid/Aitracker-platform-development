'use client'

import { useEffect, useState } from 'react'

type Event = Record<string, any>

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

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds</p>
        <h1 className="mt-2 text-3xl font-bold">Ren API-test</h1>
        <p className="mt-2 text-slate-600">Automatisk test af kommende EPL-events med odds. Ingen SikkerBets-design eller ekstra brugerfiltre.</p>
        <div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm">
          <p><strong>Request:</strong> SOCCER · EPL · limit 100 · oddsAvailable true</p>
          <p className="mt-1"><strong>Status:</strong> {loading ? 'Henter…' : error ? 'Fejl' : `${events.length} event hentet`}</p>
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-6 space-y-4">
          {events.map((event) => {
            const markets = Object.entries(event.odds ?? {})
            const bookmakerCount = new Set(markets.flatMap(([, market]: [string, any]) => Object.keys(market?.byBookmaker ?? {}))).size
            const groups = markets.reduce((result, [oddID, market]: [string, any]) => { const parts = oddID.split('-'); const outcome = parts.pop() ?? oddID; const group = parts.join('-'); (result[group] ||= []).push({ outcome, market }); return result }, {} as Record<string, any[]>)
            const toDecimal = (value: unknown) => { const american = Number(value); return Number.isFinite(american) ? american >= 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1 : null }
            const surebets = Object.entries(groups).map(([marketID, outcomes]) => { const picks = outcomes.map(({ outcome, market }) => { const offers = Object.entries(market?.byBookmaker ?? {}).map(([bookmaker, quote]: [string, any]) => ({ bookmaker, quote, decimal: toDecimal(quote?.odds) })).filter((offer) => offer.decimal); return offers.sort((a, b) => (b.decimal ?? 0) - (a.decimal ?? 0))[0] ? { ...offers[0], outcome } : null }).filter(Boolean) as any[]; const implied = picks.reduce((sum, pick) => sum + 1 / pick.decimal, 0); return { marketID, picks, profit: (1 - implied) * 100 } }).filter((surebet) => surebet.picks.length >= 2 && surebet.profit > 0).sort((a, b) => b.profit - a.profit)
            return <article key={event.eventID} className="rounded-lg border border-slate-200 p-5"><h2 className="text-xl font-semibold">{event.teams?.home?.name ?? event.teams?.home?.teamID ?? 'Hjemme'} – {event.teams?.away?.name ?? event.teams?.away?.teamID ?? 'Ude'}</h2><p className="mt-1 text-sm text-slate-500">{event.leagueID ?? 'Ukendt liga'} · {event.eventID}</p><p className="mt-4 text-sm"><strong>{markets.length}</strong> markeder · <strong>{bookmakerCount}</strong> bookmakere · <strong>{surebets.length}</strong> surebets</p>{surebets.length ? <div className="mt-4 space-y-3">{surebets.map((surebet) => <div key={surebet.marketID} className="rounded-md border border-emerald-200 bg-emerald-50 p-3"><div className="flex items-center justify-between gap-3"><strong className="break-all text-sm">{surebet.marketID}</strong><strong className="text-emerald-700">+{surebet.profit.toFixed(2)}%</strong></div><div className="mt-2 space-y-1 text-sm">{surebet.picks.map((pick: any) => <p key={pick.outcome} className="flex justify-between gap-3"><span>{pick.outcome} · {pick.bookmaker}</span><strong>{pick.quote?.odds} ({pick.decimal.toFixed(2)})</strong></p>)}</div></div>)}</div> : <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">Ingen surebets fundet i dette event.</p>}<details className="mt-4"><summary className="cursor-pointer text-sm font-medium text-slate-600">Vis rå markeder</summary><div className="mt-3 grid gap-3 sm:grid-cols-2">{markets.slice(0, 12).map(([marketID, market]: [string, any]) => <div key={marketID} className="rounded-md bg-slate-50 p-3"><p className="break-all text-xs font-medium text-slate-500">{marketID}</p><div className="mt-2 space-y-1 text-sm">{Object.entries(market?.byBookmaker ?? {}).slice(0, 8).map(([bookmaker, quote]: [string, any]) => <p key={bookmaker} className="flex justify-between gap-3"><span>{bookmaker}</span><strong>{quote?.odds ?? '—'}</strong></p>)}</div></div>)}</div></details></article>
          })}
        </div>
        {!loading && !error && !events.length && <p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">API’et returnerede ingen events.</p>}
      </div>
    </main>
  )
}
