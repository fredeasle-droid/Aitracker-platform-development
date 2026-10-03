'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Database, ExternalLink, Loader2, Search, TriangleAlert } from 'lucide-react'

export default function OddsPapiPage() {
  const [fixtureId, setFixtureId] = useState('')
  const [result, setResult] = useState<{ ok: boolean; status: number; data: unknown } | null>(null)
  const [loading, setLoading] = useState(false)

  async function testFeed(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setResult(null)
    try { const response = await fetch(`/api/oddspapi?fixtureId=${encodeURIComponent(fixtureId.trim())}`); setResult(await response.json()) }
    catch { setResult({ ok: false, status: 0, data: { error: 'Kunne ikke kontakte test-endpointet.' } }) }
    finally { setLoading(false) }
  }

  return <main className="min-h-dvh px-4 pb-8 pt-5 text-[#eef6ff]">
    <header className="mb-7 flex items-center gap-3"><a href="/" className="flex size-10 items-center justify-center rounded-xl border border-[#21415f] bg-[#091827]" aria-label="Tilbage"><ArrowLeft className="size-5" /></a><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#48b4ff]">Datakilde</p><h1 className="text-2xl font-black">OddsPapi test</h1></div></header>
    <section className="rounded-3xl border border-[#1a3d5e] bg-[linear-gradient(145deg,#0a2138,#061322)] p-5 shadow-[0_20px_50px_-30px_#149cff]"><div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#103c63] text-[#54baff]"><Database className="size-6" /></div><h2 className="text-xl font-black">Test dit odds-feed</h2><p className="mt-2 text-sm leading-6 text-[#adbed1]">Indsæt et fixture-id fra OddsPapi for at se rå oddsdata og kontrollere bookmaker-dækningen.</p><form onSubmit={testFeed} className="mt-5 space-y-3"><label className="block text-sm font-bold" htmlFor="fixture">Fixture-id</label><div className="flex gap-2"><input id="fixture" value={fixtureId} onChange={(event) => setFixtureId(event.target.value)} placeholder="f.eks. 123456" required inputMode="numeric" className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#294964] bg-[#071522] px-4 text-base outline-none placeholder:text-[#66809a] focus:border-[#159cff]" /><button className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-[#168cff] px-4 font-bold" disabled={loading}>{loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}<span className="sr-only">Test feed</span></button></div></form></section>
    {result && <section className="mt-4 rounded-2xl border border-[#1b3853] bg-[#071522] p-4"><div className="flex items-center gap-2 font-bold">{result.ok ? <CheckCircle2 className="text-[#20e891]" /> : <TriangleAlert className="text-[#ffbd4a]" />} {result.ok ? 'Forbindelse virker' : `Svarstatus ${result.status || 'ukendt'}`}</div><pre className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-[#040c16] p-3 text-xs leading-5 text-[#b8cce1]">{JSON.stringify(result.data, null, 2)}</pre></section>}
    <a href="https://oddspapi.io" target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 text-sm text-[#55b7ff]">Åbn OddsPapi dokumentation <ExternalLink className="size-4" /></a>
  </main>
}
