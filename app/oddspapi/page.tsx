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
      .then((payload) => setEvents(Array.isArray(payload?.data?.data) ? payload.data.data : []))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "API error"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">SportsGameOdds</p>
        <h1 className="mt-2 text-3xl font-bold">Raw API data</h1>
        <p className="mt-2 text-slate-600">Unprocessed Premier League response from the SportsGameOdds API.</p>
        <div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm">
          <p><strong>Request:</strong> SOCCER · EPL · oddsAvailable=true · limit=100</p>
          <p className="mt-1"><strong>Status:</strong> {loading ? "Loading…" : error ?? `${events.length} events loaded`}</p>
        </div>
        {!loading && !error && (
          <section className="mt-6 space-y-4">
            {events.map((event, index) => (
              <article key={event.eventID ?? index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="font-bold">{event.eventID ?? `Event ${index + 1}`}</h2>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-700">{JSON.stringify(event, null, 2)}</pre>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
