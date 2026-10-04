'use client'

import { useEffect, useState } from 'react'

type EventRecord = Record<string, unknown>

function stringifyValue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object') return JSON.stringify(value)
  return '—'
}

function eventTitle(event: EventRecord) {
  const teams = event.teams
  if (teams && typeof teams === 'object') {
    const values = Object.values(teams as Record<string, unknown>).filter(Boolean).map((team) => {
      if (team && typeof team === 'object') {
        const names = (team as Record<string, unknown>).names
        if (names && typeof names === 'object') {
          const longName = (names as Record<string, unknown>).long
          if (typeof longName === 'string') return longName
        }
      }
      return stringifyValue(team)
    })
    if (values.length >= 2) return `${values[0]} vs ${values[1]}`
  }
  return stringifyValue(event.eventID ?? event.id ?? 'Ukendt kamp')
}

export function SportsGameOddsEventFeed() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/sportsgameodds/events?leagueID=EPL&limit=100', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? 'Kunne ikke hente odds')
        return payload.data as EventRecord[]
      })
      .then((data) => {
        if (active) setEvents(data)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Kunne ikke hente odds')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-300">Henter SportsGameOdds-data…</p>
  if (error) return <p className="rounded-xl border border-red-900/70 bg-red-950/30 p-5 text-red-200">{error}</p>
  if (events.length === 0) return <p className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-300">Ingen events med tilgængelige odds.</p>

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-400">{events.length} events fra den nye SportsGameOdds-feed</p>
      {events.map((event, index) => (
        <article key={String(event.eventID ?? event.id ?? index)} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-base font-semibold text-white">{eventTitle(event)}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {stringifyValue(event.sportID ?? event.sport ?? 'Sport')} · {stringifyValue(event.leagueID ?? event.league ?? 'Liga')}
          </p>
          <details className="mt-3 rounded-lg bg-slate-950/70 p-3">
            <summary className="cursor-pointer text-sm font-medium text-blue-300">Vis rå oddsdata</summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-300">{JSON.stringify(event.odds ?? event, null, 2)}</pre>
          </details>
        </article>
      ))}
    </div>
  )
}
