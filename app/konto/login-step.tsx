'use client'

import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react'

function GoogleMark() { return <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.83-1.76-5.62-4.13H3.04v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.38 13.89A6 6 0 0 1 6.06 12c0-.66.11-1.3.32-1.89V7.52H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.48l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.95 2.99 14.7 2 12 2a10 10 0 0 0-8.96 5.52l3.34 2.59C7.17 7.74 9.39 5.98 12 5.98Z"/></svg> }

type Props = { onBack: () => void; onNext: () => void }

export function LoginStep({ onBack, onNext }: Props) {
  return <section>
    <h1 className="text-[27px] font-extrabold leading-tight">Log ind</h1>
    <p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">Velkommen tilbage til BetTracker.</p>
    <div className="mt-7 space-y-3">
      <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><span className="text-lg text-[#e3ebf8]">@</span><input required type="email" placeholder="Email" className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label>
      <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><LockKeyhole className="size-5" /><input required type="password" placeholder="Adgangskode" className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label>
    </div>
    <label className="mt-3 flex items-center gap-2 text-sm text-[#d6deeb]"><input type="checkbox" defaultChecked className="size-4 accent-[#159cff]" /> Husk mig <span className="ml-auto text-[#42aeff] underline">Glemt adgangskode?</span></label>
    <button type="button" onClick={onNext} className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold">Log ind <ArrowRight className="size-5" /></button>
    <div className="my-5 flex items-center gap-3 text-sm text-[#d7deeb]"><span className="h-px flex-1 bg-[#243650]" /> eller fortsæt med <span className="h-px flex-1 bg-[#243650]" /></div>
    <div className="grid grid-cols-2 gap-3"><button type="button" onClick={onNext} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#344861] bg-[#0a1725] text-[15px]"><GoogleMark /> Google</button><button type="button" onClick={onNext} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#344861] bg-[#0a1725] text-[15px]"><span className="text-xl">➤</span> Telegram</button></div>
    <button type="button" onClick={onBack} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 text-sm text-[#8cb3d9]"><ArrowLeft className="size-4" /> Opret gratis konto</button>
  </section>
}
