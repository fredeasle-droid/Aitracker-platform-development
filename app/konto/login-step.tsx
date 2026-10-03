'use client'

import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react'

type Props = { onBack: () => void; onNext: () => void }

export function LoginStep({ onBack, onNext }: Props) {
  return <section>
    <h1 className="text-[27px] font-extrabold leading-tight">Log ind</h1>
    <p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">Velkommen tilbage til BetTracker.</p>
    <div className="mt-7 space-y-3">
      <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><span className="text-lg text-[#e3ebf8]">@</span><input required type="email" placeholder="Email" className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label>
      <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><LockKeyhole className="size-5" /><input required type="password" placeholder="Adgangskode" className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label>
    </div>
    <button type="button" className="mt-3 min-h-10 text-sm text-[#42aeff] underline">Glemt adgangskode?</button>
    <button type="button" onClick={onNext} className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold">Log ind <ArrowRight className="size-5" /></button>
    <button type="button" onClick={onBack} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 text-sm text-[#8cb3d9]"><ArrowLeft className="size-4" /> Opret gratis konto</button>
  </section>
}
