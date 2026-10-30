'use client'

import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function SignupBanner() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending || session?.user) return null

  return (
    <section
      aria-label="Opret bruger"
      className="mx-3 mb-3 rounded-2xl border border-[#22517d] bg-[linear-gradient(180deg,#0a2240_0%,#071729_100%)] p-3.5 lg:hidden"
    >
      <p className="text-[14px] leading-snug text-[#d5ddef]">
        <span className="font-bold text-[#f3f6fc]">Ny her?</span> Opret en bruger og prøv BetTracker gratis i 7 dage.
      </p>
      <Link
        href="/konto"
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#159cff] text-[16px] font-extrabold text-[#03101e] shadow-[0_0_18px_-6px_#159cff] transition-colors hover:bg-[#42aeff]"
      >
        <UserPlus className="size-5" aria-hidden="true" />
        Opret bruger – 7 dage gratis
      </Link>
      <p className="mt-2.5 text-center text-[13px] text-[#8cb3d9]">
        Har du allerede en konto?{' '}
        <Link href="/login" className="font-semibold text-[#42aeff] underline">
          Log ind
        </Link>
      </p>
    </section>
  )
}
