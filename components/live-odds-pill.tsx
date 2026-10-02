'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const REFRESH_MS = 60_000

export function LiveOddsPill({ updated }: { updated: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') startTransition(() => router.refresh())
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [router])

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-[#0a1324] px-3 py-1.5 text-left"
      aria-label={`Live odds, opdateret ${updated}. Tryk for at opdatere`}
    >
      <span className={cn('size-2.5 shrink-0 rounded-full bg-success shadow-[0_0_8px_var(--success)]', pending && 'animate-pulse')} />
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] font-medium">Live odds</span>
        <span className="text-[11px] text-[#a9b6d3]">
          {pending ? 'Opdaterer…' : `Opdateret ${updated}`}
        </span>
      </span>
    </button>
  )
}
