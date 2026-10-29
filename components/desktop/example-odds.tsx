'use client'

import { BookmakerLogo } from '@/components/bookmaker-logo'
import { LockTile, useHasAccess } from '@/components/locked-odds'
import { formatOdds } from '@/lib/odds'

export function ExampleOdds({ bookmaker, label, odds }: { bookmaker: string; label: string; odds: number }) {
  const hasAccess = useHasAccess()

  if (!hasAccess) return <LockTile className="min-h-[92px] flex-1" />

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-[#1a3557] bg-[#081123] p-2.5">
      <BookmakerLogo name={bookmaker} className="size-11 shrink-0 rounded-[10px]" />
      <div className="min-w-0">
        <p className="truncate text-[12px] text-[#d5ddef]">{bookmaker}</p>
        <p className="truncate text-[12px] text-[#d5ddef]">{label}</p>
        <p className="text-[19px] font-extrabold tabular-nums text-[#55a8ff]">{formatOdds(odds)}</p>
      </div>
    </div>
  )
}
