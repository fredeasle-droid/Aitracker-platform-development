"use client"

import { useEffect, useState } from "react"

type ApiPayload = { data?: unknown; error?: string }

export default function OddsApiTestPage() {
  const [payload, setPayload] = useState<ApiPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/sportsgameodds?sportID=SOCCER&leagueID=EPL&limit=100")
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || "API-request fejlede")
        return body
      })
      .then(setPayload)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "API-request fejlede"))
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">SportsGameOdds</p>
        <h1 className="mt-2 text-3xl font-bold">Rå API-data</h1>
        <p className="mt-2 text-slate-400">SOCCER · EPL · limit=100</p>
        <section className="mt-6 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4">
          {error ? <p className="text-red-400">{error}</p> : payload ? <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-slate-200">{JSON.stringify(payload.data ?? payload, null, 2)}</pre> : <p className="text-slate-400">Henter rå API-data…</p>}
        </section>
      </div>
    </main>
  )
}
