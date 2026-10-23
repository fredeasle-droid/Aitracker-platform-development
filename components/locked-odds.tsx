'use client'

import Link from 'next/link'
import { LockKeyhole } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { formatOdds } from '@/lib/odds'
import { cn } from '@/lib/utils'

export function useLoggedIn() {
  const { data: session } = authClient.useSession()
  return Boolean(session?.user)
}

export function LockedOdds({ odds, className }: { odds: number; className?: string }) {
  const loggedIn = useLoggedIn()

  if (loggedIn) return <span className={className}>{formatOdds(odds)}</span>

  return (
    <Link href="/konto" className="relative inline-block" aria-label="Opret gratis konto for at se oddsene">
      <span className={cn('select-none blur-[5px]', className)} aria-hidden="true">
        0.00
      </span>
      <LockKeyhole className="absolute -right-1.5 -top-1.5 size-3.5 text-[#f5c84b]" aria-hidden="true" />
    </Link>
  )
}
