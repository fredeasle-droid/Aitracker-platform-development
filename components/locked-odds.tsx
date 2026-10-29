'use client'

import Link from 'next/link'
import { LockKeyhole } from 'lucide-react'
import useSWR from 'swr'
import { getHasOddsAccess } from '@/app/access-actions'
import { authClient } from '@/lib/auth-client'
import { formatOdds } from '@/lib/odds'
import { cn } from '@/lib/utils'

export function useHasAccess() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id ?? null
  const { data } = useSWR(userId ? ['odds-access', userId] : null, () => getHasOddsAccess(), {
    revalidateOnFocus: true,
  })
  return Boolean(userId && data)
}

export function LockBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn('flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f2a4f] text-[#55a8ff]', className)}
      aria-hidden="true"
    >
      <LockKeyhole className="size-[55%]" />
    </span>
  )
}

export function LockTile({ bookmaker, className }: { bookmaker?: string; className?: string }) {
  return (
    <Link
      href="/konto"
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 rounded-xl border border-[#1a3557] bg-[#081123] px-2 text-center transition-colors hover:border-primary',
        className,
      )}
    >
      {bookmaker && (
        <span className="absolute left-2.5 top-2 max-w-[calc(100%-1.25rem)] truncate text-[10px] font-semibold uppercase tracking-wide text-[#d5ddef]">
          {bookmaker}
        </span>
      )}
      <LockBadge className="mt-2 size-7" />
      <span className="text-[12px] font-medium text-[#55a8ff] underline underline-offset-2">Lås op med Premium</span>
    </Link>
  )
}

export function LockedOdds({ odds, className }: { odds: number; className?: string }) {
  const hasAccess = useHasAccess()

  if (hasAccess) return <span className={className}>{formatOdds(odds)}</span>

  return (
    <Link
      href="/konto"
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#55a8ff] underline underline-offset-2"
      aria-label="Bliv kunde for at se oddsene"
    >
      <LockBadge className="size-6" />
      Lås op
    </Link>
  )
}
