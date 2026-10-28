'use client'

import { useEffect, useState } from 'react'

type Entry = { time: string; text: string; ok: boolean }

const time = () => new Date().toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen' })

export function Bridge() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const log = (text: string, ok: boolean) => setEntries((current) => [{ time: time(), text, ok }, ...current].slice(0, 20))

    async function onMessage(event: MessageEvent) {
      if (!/^https:\/\/(www\.)?betherosports\.com$/.test(event.origin)) return
      const data = event.data as { type?: string; token?: unknown; messages?: unknown }
      if (data?.type !== 'bettracker' || !Array.isArray(data.messages)) return
      try {
        const response = await fetch('/api/ingest/bethero', {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ token: data.token, messages: data.messages }),
        })
        const text = await response.text()
        log(`${data.messages.length} beskeder: ${text}`, response.ok)
        ;(event.source as Window | null)?.postMessage({ type: 'bettracker-result', ok: response.ok, text }, event.origin)
      } catch {
        log('Kunne ikke sende til BetTracker', false)
        ;(event.source as Window | null)?.postMessage({ type: 'bettracker-result', ok: false, text: 'netværksfejl' }, event.origin)
      }
    }

    window.addEventListener('message', onMessage)
    window.opener?.postMessage({ type: 'bettracker-ready' }, '*')
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 bg-[#06111d] px-5 py-8 text-white">
      <h1 className="text-xl font-extrabold">BetTracker modtager</h1>
      <p className="text-sm leading-relaxed text-[#d6deeb]">Lad dette vindue stå åbent. Det sender Bet Hero-data videre til BetTracker hvert minut.</p>
      <ul className="flex flex-col gap-2 text-sm" aria-live="polite">
        {entries.length === 0 && <li className="text-[#9fb2cc]">Venter på data…</li>}
        {entries.map((entry, index) => (
          <li key={`${entry.time}-${index}`} className={entry.ok ? 'text-[#8be28b]' : 'text-[#ff9b9b]'}>
            {entry.time} – {entry.text}
          </li>
        ))}
      </ul>
    </main>
  )
}
