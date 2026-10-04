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
    <main className="min-h-screen bg-[#050d1a] px-3 py-6 text-[#f3f6fc]">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[24px] border border-[#183252] bg-[#071426] p-4 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.85)]">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#55a8ff]">SikkerBets · Test-feed</p>
          <h1 className="mt-2 text-3xl font-bold">Bedste surebets</h1>
          <p className="mt-2 text-[#a9b6d3]">SportsGameOdds · SOCCER · EPL · op til 100 kampe</p>
          <p className="mt-3 text-sm text-[#8fa3cc]">{loading ? 'Henter aktuelle kampe…' : error ? 'Feed-fejl' : `${events.length} kampe hentet automatisk`}</p>
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-6 space-y-4">
          {events.map((event) => {
            const markets = Object.entries(event.odds ?? {})
            const bookmakerCount = new Set(markets.flatMap(([, market]: [string, any]) => Object.keys(market?.byBookmaker ?? {}))).size
            const groups = markets.reduce((result, [oddID, market]: [string, any]) => { const parts = oddID.split('-'); const outcome = parts.pop() ?? oddID; const group = parts.join('-'); (result[group] ||= []).push({ outcome, market }); return result }, {} as Record<string, any[]>)
            const toDecimal = (value: unknown) => { const american = Number(value); return Number.isFinite(american) ? american >= 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1 : null }
            const surebets = Object.entries(groups).map(([marketID, outcomes]) => { const picks = outcomes.map(({ outcome, market }) => { const offers = Object.entries(market?.byBookmaker ?? {}).map(([bookmaker, quote]: [string, any]) => ({ bookmaker, quote, decimal: toDecimal(quote?.odds) })).filter((offer) => offer.decimal); return offers.sort((a, b) => (b.decimal ?? 0) - (a.decimal ?? 0))[0] ? { ...offers[0], outcome } : null }).filter(Boolean) as any[]; const implied = picks.reduce((sum, pick) => sum + 1 / pick.decimal, 0); return { marketID, picks, profit: (1 - implied) * 100 } }).filter((surebet) => surebet.picks.length >= 2 && surebet.profit > 0).sort((a, b) => b.profit - a.profit)
            return <article key={event.eventID} className="rounded-[24px] border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_55%,#071a2a_100%)] p-3.5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.85)]"><div className="flex items-center justify-between gap-2 text-[13px] text-[#a9b6d3]"><span>{event.leagueID ?? 'EPL'}</span><span>Bedste mulighed</span></div><h2 className="mt-2 text-xl font-semibold">{event.teams?.home?.name ?? event.teams?.home?.teamID ?? 'Hjemme'} – {event.teams?.away?.name ?? event.teams?.away?.teamID ?? 'Ude'}</h2><p className="mt-1 text-sm text-[#a9b6d3]">{event.leagueID ?? 'Ukendt liga'} · {event.eventID}</p><p className="mt-4 text-sm text-[#d5ddef]"><strong>{markets.length}</strong> markeder · <strong>{bookmakerCount}</strong> bookmakere · <strong>{surebets.length}</strong> mulige surebets</p>{surebets.length ? <div className="mt-4 space-y-3">{[surebets[0]].map((surebet) => <div key={surebet.marketID} className="rounded-[18px] border border-[#23785f] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(46,230,166,0.17),rgba(8,30,30,0.62))] p-3"><div className="flex items-center justify-between gap-3"><div><span className="block text-xs font-bold uppercase tracking-wide text-[#20e891]">Bedste surebet</span><strong className="mt-1 block break-all text-sm">{surebet.marketID}</strong></div><strong className="text-[#20e891]">+{surebet.profit.toFixed(2)}%</strong></div><div className="mt-3 space-y-2 text-sm">{surebet.picks.map((pick: any) => <p key={pick.outcome} className="flex justify-between gap-3"><span>{pick.outcome} · {pick.bookmaker}</span><strong>{pick.quote?.odds} ({pick.decimal.toFixed(2)})</strong></p>)}</div></div>)}</div> : <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">Ingen surebets fundet i dette event.</p>}<details className="mt-4"><summary className="cursor-pointer text-sm font-medium text-slate-600">Vis rå markeder</summary><div className="mt-3 grid gap-3 sm:grid-cols-2">{markets.slice(0, 12).map(([marketID, market]: [string, any]) => <div key={marketID} className="rounded-md bg-slate-50 p-3"><p className="break-all text-xs font-medium text-slate-500">{marketID}</p><div className="mt-3 space-y-2 text-sm">{Object.entries(market?.byBookmaker ?? {}).slice(0, 8).map(([bookmaker, quote]: [string, any]) => <p key={bookmaker} className="flex justify-between gap-3"><span>{bookmaker}</span><strong>{quote?.odds ?? '—'}</strong></p>)}</div></div>)}</div></details></article>
          })}
        </div>
        {!loading && !error && !events.length && <p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">API’et returnerede ingen events.</p>}
      </div>
    </main>
  )
}
