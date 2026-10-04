"use client"

import { useEffect, useState } from "react"

export default function OddsApiTestPage() {
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/arbitrage")
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (!response.ok || !payload.ok) throw new Error(payload.error || "Calculator failed")
        setOutput(payload.stdout)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Calculator failed"))
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">SportsGameOdds</p>
        <h1 className="mt-2 text-3xl font-bold">GitHub arbitrage calculator</h1>
        <p className="mt-2 text-slate-400">Output fra den originale arb_calculator.py uden ændringer i beregningskoden.</p>
        <section className="mt-6 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4">
          {error ? <p className="text-red-400">{error}</p> : output ? <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-slate-200">{output}</pre> : <p className="text-slate-400">Kører GitHub-kalkulatoren…</p>}
        </section>
      </div>
    </main>
  )
}
