'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/locale-provider'
import { cn } from '@/lib/utils'

const REFRESH_MS = 60_000

export function LiveOddsPill({ updated }: { updated: string }) {
  const { t } = useLocale()
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
      className="flex h-[37px] items-center gap-[7px] rounded-full border border-[#1b3a5e] bg-[#08142a] pl-3 pr-3 text-left"
      aria-label={t('liveOddsAria', { time: updated })}
    >
      <span className={cn('size-2 shrink-0 rounded-full bg-success shadow-[0_0_8px_var(--success)]', pending && 'animate-pulse')} />
      <span className="flex flex-col gap-[3px] whitespace-nowrap">
        <span className="text-[9.2px] font-medium leading-none">{t('liveOdds')}</span>
        <span className="text-[8.3px] leading-none tabular-nums text-[#a9b6d3]">{pending ? t('updating') : t('updatedAt', { time: updated })}</span>
      </span>
    </button>
  )
}
