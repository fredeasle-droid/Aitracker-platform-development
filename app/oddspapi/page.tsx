'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Database, ExternalLink, Loader2, Search } from 'lucide-react'

type ApiResult = { ok: boolean; status: number; data: any }

const sports = [
  ['SOCCER', 'Fodbold'], ['TENNIS', 'Tennis'], ['BASKETBALL', 'Basketball'], ['HOCKEY', 'Ishockey'], ['BASEBALL', 'Baseball'], ['FOOTBALL', 'Amerikansk fodbold'], ['GOLF', 'Golf'],
]

export default function SportsGameOddsPage() {
  const [sportID, setSportID] = useState('SOCCER')
  const [leagueID, setLeagueID] = useState('EPL')
  const [result, setResult] = useState<ApiResult | null>(null)
  const [selected, setSelected] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  async function loadEvents() {
    setLoading(true); setSelected(null)
    try {
      const response = await fetch(`/api/sportsgameodds?sportID=${encodeURIComponent(sportID)}&leagueID=${encodeURIComponent(leagueID)}&limit=10`)
      setResult(await response.json())
    } catch { setResult({ ok: false, status: 0, data: { error: 'Kunne ikke hente events.' } }) }
    finally { setLoading(false) }
  }

  const events = Array.isArray(result?.data?.data) ? result.data.data : Array.isArray(result?.data) ? result.data : []
  const errorMessage = result?.data?.error?.message || result?.data?.message || result?.data?.error || 'SportsGameOdds afviste forespørgslen.'
  const oddsRows = selected?.odds ? Object.entries(selected.odds).flatMap(([marketID, market]: [string, any]) => Object.entries(market?.byBookmaker || {}).map(([bookmakerID, quote]: [string, any]) => ({ marketID, bookmakerID, quote }))) : []

  return <main className="min-h-dvh px-4 pb-8 pt-5 text-[#eef6ff]">
    <header className="mb-7 flex items-center gap-3"><a href="/" className="flex size-10 items-center justify-center rounded-xl border border-[#21415f] bg-[#091827]" aria-label="Tilbage"><ArrowLeft className="size-5" /></a><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#48b4ff]">Datakilde</p><h1 className="text-2xl font-black">SportsGameOdds test</h1></div></header>
    <section className="rounded-3xl border border-[#1a3d5e] bg-[linear-gradient(145deg,#0a2138,#061322)] p-5 shadow-[0_20px_50px_-30px_#149cff]"><div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#103c63] text-[#54baff]"><Database className="size-6" /></div><h2 className="text-xl font-black">Events med odds</h2><p className="mt-2 text-sm leading-6 text-[#adbed1]">Hent op til 10 aktuelle events, hvor der allerede findes odds. API-nøglen bliver kun brugt på serveren.</p><div className="mt-5 space-y-2"><label className="block text-xs font-bold uppercase tracking-wide text-[#9cb3c9]" htmlFor="league">League ID (fx EPL, NBA, NFL)</label><input id="league" value={leagueID} onChange={(event) => setLeagueID(event.target.value.toUpperCase())} className="min-h-12 w-full rounded-xl border border-[#294964] bg-[#071522] px-3 text-base" /><div className="flex gap-2"><select value={sportID} onChange={(event) => setSportID(event.target.value)} className="min-h-12 flex-1 rounded-xl border border-[#294964] bg-[#071522] px-3 text-base">{sports.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button onClick={loadEvents} disabled={loading} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#168cff] px-4 font-bold">{loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />} Hent</button></div></div></section>
    <section className="mt-4 space-y-2">{events.length ? events.map((event: any) => { const id = event.eventID; const home = event.teams?.home?.name || event.teams?.home?.teamName || 'Hjemme'; const away = event.teams?.away?.name || event.teams?.away?.teamName || 'Ude'; return <button key={id} onClick={() => setSelected(event)} className="flex min-h-16 w-full items-center justify-between rounded-2xl border border-[#183b59] bg-[#071522] px-4 text-left hover:border-[#159cff]"><span><strong className="block">{home} – {away}</strong><small className="text-[#7f9bb5]">{event.leagueID || event.sportID} · {id}</small></span><span className="text-sm font-bold text-[#55b7ff]">Se odds</span></button> }) : <div className="rounded-2xl border border-[#183b59] bg-[#071522] p-4 text-sm text-[#9cb3c9]">{result ? `Fejl ${result.status || ''}: ${errorMessage}` : 'Tryk Hent for at teste SportsGameOdds.'}</div>}</section>
    {selected && <section aria-live="polite" className="mt-4 rounded-2xl border border-[#1b3853] bg-[#071522] p-4"><div className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-[#20e891]" /> Odds hentet</div><p className="mt-1 text-sm text-[#9cb3c9]">{oddsRows.length} bookmaker-tilbud fundet</p><div className="mt-4 space-y-2">{oddsRows.length ? oddsRows.map(({ marketID, bookmakerID, quote }) => <div key={`${marketID}-${bookmakerID}`} className="rounded-xl border border-[#1d405f] bg-[#091a2a] p-3"><div className="flex items-center justify-between gap-3"><div><strong className="block text-sm">{bookmakerID}</strong><span className="text-xs text-[#8ea8bf]">{marketID}</span></div><strong className="text-xl text-[#20e891]">{quote?.odds ?? '—'}</strong></div>{quote?.spread && <p className="mt-1 text-xs text-[#9cb3c9]">Spread: {quote.spread}</p>}{quote?.overUnder && <p className="mt-1 text-xs text-[#9cb3c9]">Over/under: {quote.overUnder}</p>}{quote?.deeplink && <a href={quote.deeplink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-[#55b7ff]">Åbn hos bookmaker</a>}</div>) : <p className="rounded-xl bg-[#091a2a] p-3 text-sm text-[#9cb3c9]">Ingen bookmaker-tilbud i dette event.</p>}</div></section>}
    <a href="https://sportsgameodds.com/docs/llms-full.txt" target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 text-sm text-[#55b7ff]">Åbn SportsGameOdds dokumentation <ExternalLink className="size-4" /></a>
  </main>
}
