'use client'

import { useEffect, useState } from 'react'

type Event = Record<string, any>

type Pick = { outcome: string; bookmaker: string; quote: any; decimal: number }

function cleanLabel(value: string) {
  return value.replace(/_[A-Z0-9]+$/i, '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function marketLabel(marketID: string) {
  const parts = marketID.split('-')
  const betType = parts.at(-1)
  const period = parts.at(-2)
  if (betType === 'ml3way') return 'Kampvinder'
  if (betType === 'ml') return 'Kampvinder'
  if (betType === 'ou') return `Over/Under${period && period !== 'game' ? ` · ${period}` : ''}`
  if (betType === 'sp') return 'Handicap'
  return cleanLabel(marketID)
}

function outcomeLabel(outcome: string, marketID: string) {
  if (outcome === 'home') return 'Hjemme'
  if (outcome === 'away') return 'Ude'
  if (outcome === 'draw') return 'Uafgjort'
  if (outcome === 'over') return 'Over'
  if (outcome === 'under') return 'Under'
  return cleanLabel(outcome)
}

function getSurebet(event: Event) {
  const groups = Object.entries(event.odds ?? {}).reduce((result, [oddID, market]: [string, any]) => {
    const parts = oddID.split('-')
    const outcome = parts.pop() ?? oddID
    const group = parts.join('-')
    ;(result[group] ||= []).push({ outcome, market })
    return result
  }, {} as Record<string, any[]>)

  const toDecimal = (value: unknown) => {
    const american = Number(value)
    return Number.isFinite(american) ? american >= 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1 : null
  }

  return Object.entries(groups).map(([marketID, outcomes]) => {
    const picks = outcomes.map(({ outcome, market }) => {
      const offers = Object.entries(market?.byBookmaker ?? {}).map(([bookmaker, quote]: [string, any]) => ({ bookmaker, quote, decimal: toDecimal(quote?.odds) })).filter((offer): offer is Pick => offer.decimal !== null)
      return offers.sort((a, b) => b.decimal - a.decimal)[0] ? { ...offers[0], outcome } : null
    }).filter(Boolean) as Pick[]
    const implied = picks.reduce((sum, pick) => sum + 1 / pick.decimal, 0)
    return { marketID, picks, profit: (1 - implied) * 100 }
  }).filter((item) => item.picks.length >= 2 && item.profit > 0).sort((a, b) => b.profit - a.profit)[0]
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

  return (
    <main className="min-h-screen bg-[#030b16] pb-8 text-[#f4f7fb]">
      <header className="border-b border-[#17334d] bg-[#061426] px-3 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><span className="text-3xl text-[#168cff]">▥</span><strong className="text-2xl tracking-tight">Bet<span className="text-[#168cff]">Tracker</span></strong></div>
          <div className="rounded-2xl border border-[#1b775e] bg-[#071e27] px-3 py-2 text-xs"><span className="mr-1 text-[#20e891]">●</span> Live odds<br /><span className="text-[#8fa3bb]">Opdateret nu</span></div>
        </div>
      </header>

      <section className="border-b border-[#17334d] bg-[#061426] px-3 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1"><button className="min-h-11 rounded-xl bg-[#087ff5] px-5 text-sm font-bold">Alle</button><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">Fodbold</button><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">Basketball</button><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">Tennis</button><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">Flere⌄</button></div>
        <div className="mt-2 flex gap-2 overflow-x-auto"><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">☷ Ligaer⌄</button><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">▥ Min. margin: <span className="text-[#20e891]">3%</span>⌄</button><button className="min-h-11 whitespace-nowrap rounded-xl border border-[#29445c] px-4 text-sm">☷ Nyeste først⌄</button></div>
      </section>

      <section className="space-y-3 px-3 py-4">
        <div className="flex items-center justify-between text-sm text-[#9aacbf]"><span>England · Premier League</span><span>{loading ? 'Henter…' : `${events.length} kampe`}</span></div>
        {error && <div className="rounded-2xl border border-red-400/30 bg-red-950/40 p-4 text-sm text-red-200">{error}</div>}
        {events.map((event) => {
          const best = getSurebet(event)
          if (!best) return null
          const home = event.teams?.home?.name ?? event.teams?.home?.teamID ?? 'Hjemme'
          const away = event.teams?.away?.name ?? event.teams?.away?.teamID ?? 'Ude'
          return <article key={event.eventID} className="rounded-2xl border border-[#194465] bg-[linear-gradient(145deg,#071a2b,#06111e)] p-3 shadow-[0_12px_28px_-16px_rgba(0,0,0,.9)]"><div className="flex items-center justify-between text-xs text-[#9aacbf]"><span>England · Premier League</span><span>Bedste surebet</span></div><div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold"><span className="flex min-w-0 max-w-[42%] items-center justify-end gap-1 text-right"><span className="truncate">{cleanLabel(home)}</span><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#143a8c] text-[10px] text-white">H</span></span><span className="text-[#698098]">vs</span><span className="flex min-w-0 max-w-[42%] items-center gap-1"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d83c38] text-[10px] text-white">U</span><span className="truncate">{cleanLabel(away)}</span></span></div><div className="mt-2 flex items-center gap-1 text-xs text-[#a9bdd0]">▥ {marketLabel(best.marketID)}</div><div className="mt-3 grid grid-cols-[1fr_94px] gap-2"><div className="space-y-2">{best.picks.slice(0, 2).map((pick) => <div key={pick.outcome} className="rounded-xl border border-[#214967] bg-[#0a2234] p-2.5"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold">{pick.bookmaker}</span><strong className="text-[#eaf5ff]">{pick.decimal.toFixed(2)}</strong></div><div className="mt-1 text-xs text-[#9aacbf]">{outcomeLabel(pick.outcome, best.marketID)} · {pick.quote?.odds}</div></div>)}</div><div className="rounded-xl border border-[#0c886f] bg-[#062b2c] p-2 text-center"><span className="block text-[10px] font-bold uppercase text-[#7adfc1]">Margin</span><strong className="mt-1 block text-2xl text-[#20e891]">{best.profit.toFixed(2)}%</strong><span className="text-[10px] text-[#a9bdd0]">{best.picks.length} udfald</span></div></div><button className="mt-3 min-h-11 w-full rounded-xl bg-[#087ff5] text-sm font-bold shadow-[0_6px_18px_-8px_#087ff5]">Opret gratis konto for at se oddsene</button></article>
        })}
        {!loading && !error && !events.some((event) => getSurebet(event)) && <p className="py-12 text-center text-[#a9bdd0]">Ingen surebets fundet lige nu.</p>}
      </section>
    </main>
  )
}
