'use client'

import { useEffect, useState } from 'react'

const pad = (value: number) => String(value).padStart(2, '0')

export function Countdown({ opensAt }: { opensAt: number }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, opensAt - Date.now())
      setRemaining(left)
      if (left === 0) window.location.reload()
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [opensAt])

  const totalSeconds = remaining === null ? null : Math.floor(remaining / 1000)
  const units = [
    { label: 'Timer', value: totalSeconds === null ? '--' : pad(Math.floor(totalSeconds / 3600)) },
    { label: 'Minutter', value: totalSeconds === null ? '--' : pad(Math.floor((totalSeconds % 3600) / 60)) },
    { label: 'Sekunder', value: totalSeconds === null ? '--' : pad(totalSeconds % 60) },
  ]

  return (
    <div role="timer" aria-live="off" className="flex items-start justify-center gap-2 sm:gap-3">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-start gap-2 sm:gap-3">
          <div className="flex w-[84px] flex-col items-center gap-2 sm:w-[112px]">
            <div className="flex h-[84px] w-full items-center justify-center rounded-2xl border border-border bg-card/70 shadow-[0_0_32px_-8px_var(--primary)] sm:h-[112px]">
              <span className="text-4xl font-black tabular-nums text-foreground sm:text-6xl">{unit.value}</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{unit.label}</span>
          </div>
          {index < units.length - 1 && (
            <span aria-hidden className="pt-5 text-3xl font-black text-primary-glow sm:pt-7 sm:text-5xl">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
