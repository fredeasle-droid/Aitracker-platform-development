'use client'

import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'
import { LoginStep } from '@/app/konto/login-step'

export default function LoginPage() {
  function completeLogin() {
    document.cookie = 'bettracker_logged_in=true; Path=/; Max-Age=2592000; SameSite=Lax'
    window.location.assign('/')
  }

  return (
    <main className="min-h-dvh bg-[#050b17] px-3 pb-8 pt-2 text-[#f3f6fc] sm:px-5 lg:px-8 lg:pt-5">
      <div className="mx-auto w-full max-w-[390px]">
        <header className="flex h-14 items-center justify-between">
          <Link href="/" aria-label="Tilbage til BetTracker" className="flex size-11 items-center justify-center rounded-full hover:bg-white/5"><ArrowLeft className="size-5" /></Link>
          <span className="text-[21px] font-black tracking-tight"><span className="text-white">Bet</span><span className="text-[#1593ff]">Tracker</span></span>
          <Link href="/" aria-label="Luk" className="flex size-11 items-center justify-center rounded-full hover:bg-white/5"><X className="size-5" /></Link>
        </header>
        <div className="mb-7 flex items-center justify-center gap-0 px-5" aria-label="Trin 1 af 3">
          {[1, 2, 3].map((number) => (
            <div key={number} className="flex flex-1 items-center last:flex-none">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${number === 1 ? 'border-[#159cff] bg-[#159cff] text-[#03101e]' : 'border-[#52617a] bg-[#071321] text-[#d0d8e7]'}`}>{number}</span>
              {number < 3 && <span className="h-px w-full bg-[#34445e]" />}
            </div>
          ))}
        </div>
        <LoginStep onBack={() => window.location.assign('/konto')} onNext={completeLogin} />
      </div>
    </main>
  )
}
