'use client'

import { useEffect, useState } from 'react'

type Event = Record<string, any>

export default function OddsApiTestPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sportsgameodds?sportID=SOCCER&leagueID=EPL&limit=1')
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
        <p className="mt-2 text-slate-600">Automatisk test af ét kommende EPL-event med odds. Ingen SikkerBets-design eller surebet-filtrering.</p>
        <div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm">
          <p><strong>Request:</strong> SOCCER · EPL · limit 1 · oddsAvailable true</p>
          <p className="mt-1"><strong>Status:</strong> {loading ? 'Henter…' : error ? 'Fejl' : `${events.length} event hentet`}</p>
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-6 space-y-4">
          {events.map((event) => {
            const markets = Object.entries(event.odds ?? {})
            const bookmakerCount = new Set(markets.flatMap(([, market]: [string, any]) => Object.keys(market?.byBookmaker ?? {}))).size
            return <article key={event.eventID} className="rounded-lg border border-slate-200 p-5"><h2 className="text-xl font-semibold">{event.teams?.home?.name ?? event.teams?.home?.teamID ?? 'Hjemme'} – {event.teams?.away?.name ?? event.teams?.away?.teamID ?? 'Ude'}</h2><p className="mt-1 text-sm text-slate-500">{event.leagueID ?? 'Ukendt liga'} · {event.eventID}</p><p className="mt-4 text-sm"><strong>{markets.length}</strong> markeder · <strong>{bookmakerCount}</strong> bookmakere</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{markets.slice(0, 12).map(([marketID, market]: [string, any]) => <div key={marketID} className="rounded-md bg-slate-50 p-3"><p className="break-all text-xs font-medium text-slate-500">{marketID}</p><div className="mt-2 space-y-1 text-sm">{Object.entries(market?.byBookmaker ?? {}).slice(0, 8).map(([bookmaker, quote]: [string, any]) => <p key={bookmaker} className="flex justify-between gap-3"><span>{bookmaker}</span><strong>{quote?.odds ?? '—'}</strong></p>)}</div></div>)}</div></article>
          })}
        </div>
        {!loading && !error && !events.length && <p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">API’et returnerede ingen events.</p>}
      </div>
    </main>
  )
}
