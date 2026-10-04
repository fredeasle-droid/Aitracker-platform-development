'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginStep } from '@/app/konto/login-step'

export default function LoginPage() {
  function completeLogin() {
    document.cookie = 'bettracker_logged_in=true; Path=/; Max-Age=2592000; SameSite=Lax'
    window.location.assign('/')
  }

  return (
    <main className="min-h-dvh bg-[#050b17] px-3 pb-8 pt-2 text-[#f3f6fc] sm:px-5">
      <div className="mx-auto w-full max-w-[390px]">
        <header className="flex h-14 items-center justify-between">
          <Link href="/" aria-label="Tilbage til BetTracker" className="flex size-11 items-center justify-center rounded-full hover:bg-white/5"><ArrowLeft className="size-5" /></Link>
          <span className="text-[21px] font-black tracking-tight"><span className="text-white">Bet</span><span className="text-[#1593ff]">Tracker</span></span>
          <span className="size-11" aria-hidden="true" />
        </header>
        <div className="mb-7 flex items-center justify-center gap-0 px-5" aria-label="Login">
          <span className="h-px flex-1 bg-[#159cff]" /><span className="mx-3 flex size-9 items-center justify-center rounded-full border border-[#159cff] bg-[#159cff] text-sm font-semibold text-[#03101e]">✓</span><span className="h-px flex-1 bg-[#34445e]" />
        </div>
        <LoginStep onBack={() => window.location.assign('/konto')} onNext={completeLogin} />
      </div>
    </main>
  )
}
