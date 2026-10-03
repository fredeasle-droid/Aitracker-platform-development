'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Database, ExternalLink, Loader2, Search, TriangleAlert } from 'lucide-react'

type ApiResult = { ok: boolean; status: number; data: any }

export default function OddsPapiPage() {
  const [sportId, setSportId] = useState('10')
  const [fixtures, setFixtures] = useState<ApiResult | null>(null)
  const [selected, setSelected] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [fixtureLoading, setFixtureLoading] = useState('')
  const [eventIndex, setEventIndex] = useState(0)

  async function loadFixtures() {
    setLoading(true); setSelected(null); setEventIndex(0)
    try { const response = await fetch(`/api/oddspapi?sportId=${sportId}`); setFixtures(await response.json()) }
    catch { setFixtures({ ok: false, status: 0, data: { error: 'Kunne ikke hente events.' } }) }
    finally { setLoading(false) }
  }

  async function loadOdds(id: string) {
    setFixtureLoading(id)
    try {
      const response = await fetch(`/api/oddspapi?fixtureId=${encodeURIComponent(id)}`)
      setSelected(await response.json())
      requestAnimationFrame(() => document.getElementById('odds-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
    catch { setSelected({ ok: false, status: 0, data: { error: 'Kunne ikke hente odds.' } }) }
    finally { setFixtureLoading('') }
  }

  useEffect(() => { loadFixtures() }, [])
  const items = Array.isArray(fixtures?.data) ? fixtures.data : fixtures?.data?.fixtures || fixtures?.data?.data || []

  return <main className="min-h-dvh px-4 pb-8 pt-5 text-[#eef6ff]">
    <header className="mb-7 flex items-center gap-3"><a href="/" className="flex size-10 items-center justify-center rounded-xl border border-[#21415f] bg-[#091827]" aria-label="Tilbage"><ArrowLeft className="size-5" /></a><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#48b4ff]">Datakilde</p><h1 className="text-2xl font-black">OddsPapi test</h1></div></header>
    <section className="rounded-3xl border border-[#1a3d5e] bg-[linear-gradient(145deg,#0a2138,#061322)] p-5 shadow-[0_20px_50px_-30px_#149cff]"><div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#103c63] text-[#54baff]"><Database className="size-6" /></div><h2 className="text-xl font-black">Alle events</h2><p className="mt-2 text-sm leading-6 text-[#adbed1]">Vælg en sport og hent events med ét API-kald. Vi viser ét event ad gangen, så du kan teste odds uden unødvendige requests.</p><div className="mt-5 flex gap-2"><select value={sportId} onChange={(e) => setSportId(e.target.value)} className="min-h-12 flex-1 rounded-xl border border-[#294964] bg-[#071522] px-3 text-base"><option value="10">Fodbold</option><option value="7">Tennis</option><option value="18">Basketball</option><option value="12">Ishockey</option></select><button onClick={loadFixtures} disabled={loading} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#168cff] px-4 font-bold">{loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />} Hent</button></div></section>
    <section className="mt-4 space-y-2">{items.length ? (() => { const item = items[eventIndex]; const id = String(item.fixtureId ?? item.id ?? item.fixture?.id ?? eventIndex); const name = item.name || item.eventName || `${item.homeTeam?.name || item.home?.name || 'Hjemme'} – ${item.awayTeam?.name || item.away?.name || 'Ude'}`; return <><button onClick={() => loadOdds(id)} className="flex min-h-16 w-full items-center justify-between rounded-2xl border border-[#183b59] bg-[#071522] px-4 text-left hover:border-[#159cff]"><span><strong className="block">{name}</strong><small className="text-[#7f9bb5]">Event {eventIndex + 1} af {items.length} · ID: {id}</small></span>{fixtureLoading === id ? <Loader2 className="size-5 animate-spin text-[#55b7ff]" /> : <span className="text-sm font-bold text-[#55b7ff]">Se odds</span>}</button>{eventIndex < items.length - 1 && <button onClick={() => { setEventIndex((index) => index + 1); setSelected(null) }} className="min-h-11 w-full text-sm font-bold text-[#55b7ff]">Hent næste event</button>}</> })() : <div className="rounded-2xl border border-[#183b59] bg-[#071522] p-4 text-sm text-[#9cb3c9]">{fixtures?.ok ? 'Ingen events fundet i perioden.' : fixtures ? `Fejl ${fixtures.status || ''}: ${typeof fixtures.data === 'string' ? fixtures.data : fixtures.data?.error?.message || fixtures.data?.message || fixtures.data?.error || 'OddsPapi afviste forespørgslen. Kontrollér API-planens requests og sport-adgang.'}` : 'Henter events…'}</div>}</section>
    {selected && <section id="odds-result" aria-live="polite" className="mt-4 rounded-2xl border border-[#1b3853] bg-[#071522] p-4"><div className="flex items-center gap-2 font-bold">{selected.ok ? <CheckCircle2 className="text-[#20e891]" /> : <TriangleAlert className="text-[#ffbd4a]" />} {selected.ok ? 'Odds hentet' : `Svarstatus ${selected.status || 'ukendt'}`}</div><p className="mt-2 text-sm text-[#9cb3c9]">{selected.ok ? 'Oddsdata vises nedenfor.' : 'OddsPapi returnerede ikke odds for dette event.'}</p><pre className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-[#040c16] p-3 text-xs leading-5 text-[#b8cce1]">{JSON.stringify(selected.data, null, 2)}</pre></section>}
    <a href="https://oddspapi.io" target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 text-sm text-[#55b7ff]">Åbn OddsPapi dokumentation <ExternalLink className="size-4" /></a>
  </main>
}
