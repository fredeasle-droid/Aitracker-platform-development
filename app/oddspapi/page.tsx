"use client"

import { useEffect, useState } from "react"

type Event = Record<string, any>

export default function OddsApiTestPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/sportsgameodds?sportID=SOCCER&leagueID=EPL&limit=100")
      .then((response) => {
        if (!response.ok) throw new Error(`API returned ${response.status}`)
        return response.json()
      })
      .then((payload) => {
        const nextEvents = Array.isArray(payload?.data?.data) ? payload.data.data : Array.isArray(payload?.data) ? payload.data : []
        setEvents(nextEvents)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "API-fejl"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds API</p>
        <h1 className="mt-2 text-3xl font-bold">Rå API-data</h1>
        <p className="mt-2 text-slate-600">Ingen surebet-beregning, market grouping eller BetTracker-design.</p>
        <div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm">
          <p><strong>Request:</strong> SOCCER · EPL · oddsAvailable=true · includeAltLines=false · limit=100</p>
          <p className="mt-1"><strong>Status:</strong> {loading ? "Henter…" : error ?? `${events.length} events hentet`}</p>
        </div>
        {!loading && !error && <div className="mt-6 space-y-6">{events.map((event, index) => <article key={event.eventID ?? index} className="rounded-lg border border-slate-200 p-5"><h2 className="text-xl font-semibold">{event.teams?.home?.name ?? event.teams?.home?.teamID ?? "Hjemme"} – {event.teams?.away?.name ?? event.teams?.away?.teamID ?? "Ude"}</h2><p className="mt-1 text-sm text-slate-500">{event.leagueID ?? "Ukendt liga"} · {event.eventID ?? "Ukendt event"}</p><pre className="mt-4 max-h-[600px] overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(event, null, 2)}</pre></article>)}</div>}
      </div>
    </main>
  )
}
