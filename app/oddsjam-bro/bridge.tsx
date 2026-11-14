'use client'

import { useEffect, useState } from 'react'

type Entry = { time: string; text: string; ok: boolean }
type IncomingRow = { text?: string; labels?: string[]; legs?: unknown[]; capturedAt?: number; timezoneOffset?: number }

const time = () => new Date().toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen' })

export function Bridge() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const log = (text: string, ok: boolean) => setEntries((current) => {
      if (current[0]?.text === text && current[0]?.ok === ok) return current
      return [{ time: time(), text, ok }, ...current].slice(0, 20)
    })
    let openerOrigin = ''
    try {
      const referrer = new URL(document.referrer)
      if (referrer.hostname === 'oddsjam.com' || referrer.hostname === 'www.oddsjam.com') openerOrigin = referrer.origin
    } catch {}

    async function onMessage(event: MessageEvent) {
      if (!openerOrigin || event.origin !== openerOrigin || event.source !== window.opener) return
      const data = event.data as { type?: string; rows?: unknown }
      if (data?.type !== 'oddsjam-data' || !Array.isArray(data.rows)) return
      try {
        const response = await fetch('/api/ingest/oddsjam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows: (data.rows as IncomingRow[]).slice(0, 100) }),
        })
        const result = await response.json().catch(() => ({})) as { summary?: string; error?: string; rowCount?: number }
        const text = response.ok ? result.summary || `Gemt ${result.rowCount ?? 0} rækker` : result.error || 'Kunne ikke gemme rækker'
        log(text, response.ok)
        ;(event.source as Window | null)?.postMessage({ type: 'oddsjam-result', ok: response.ok, text }, event.origin)
      } catch {
        log('Kunne ikke sende til BetTracker', false)
        ;(event.source as Window | null)?.postMessage({ type: 'oddsjam-result', ok: false, text: 'netværksfejl' }, event.origin)
      }
    }

    window.addEventListener('message', onMessage)
    if (openerOrigin) window.opener?.postMessage({ type: 'oddsjam-ready' }, openerOrigin)
    else log('Åbn bridge-vinduet fra OddsJam med Tampermonkey-scriptet', false)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 bg-[#06111d] px-5 py-8 text-white">
      <h1 className="text-xl font-extrabold">OddsJam modtager</h1>
      <p className="text-sm leading-relaxed text-[#d6deeb]">Vinduet modtager kun arbitrage-rækker, der er synlige i din OddsJam-fane. Lad det stå åbent, mens BetTracker opdateres.</p>
      <ul className="flex flex-col gap-2 text-sm" aria-live="polite">
        {entries.length === 0 && <li className="text-[#9fb2cc]">Venter på OddsJam-rækker…</li>}
        {entries.map((entry, index) => (
          <li key={`${entry.time}-${index}`} className={entry.ok ? 'text-[#8be28b]' : 'text-[#ff9b9b]'}>
            {entry.time} – {entry.text}
          </li>
        ))}
      </ul>
    </main>
  )
}
