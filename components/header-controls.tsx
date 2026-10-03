'use client'

import Link from 'next/link'
import { ChevronDown, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

const countries = [
  { code: 'DK', name: 'Danmark', flag: '🇩🇰' },
  { code: 'SE', name: 'Sverige', flag: '🇸🇪' },
  { code: 'NO', name: 'Norge', flag: '🇳🇴' },
  { code: 'DE', name: 'Tyskland', flag: '🇩🇪' },
]

export function HeaderControls() {
  const [country, setCountry] = useState(countries[0])
  const [open, setOpen] = useState(false)
  const [online, setOnline] = useState(1247)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOnline((value) => value + (Math.random() > 0.5 ? 1 : -1))
    }, 2400)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="flex items-center gap-1.5 border-r border-[#143456] pr-1.5 sm:gap-2 sm:pr-3">
        <span className="size-2 animate-pulse rounded-full bg-[#16ee93] shadow-[0_0_12px_#16ee93] sm:size-2.5" />
        <span className="text-[11px] font-medium text-[#f2f7ff] tabular-nums transition-transform duration-500 sm:text-[13px]">{online.toLocaleString('da-DK')}<span className="hidden sm:inline"> online</span></span>
      </div>
      <div className="relative">
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="listbox" className="flex min-h-11 items-center gap-1.5 rounded-lg px-1.5 text-[14px] font-semibold text-[#eaf3ff] hover:bg-[#102744]">
          <span className="text-[22px] leading-none">{country.flag}</span><span>{country.code}</span><ChevronDown className="size-4" />
        </button>
        {open && <div role="listbox" className="absolute right-0 top-12 z-50 min-w-36 rounded-xl border border-[#22517d] bg-[#071729] p-1.5 shadow-[0_16px_32px_-12px_#000]">
          {countries.map((item) => <button key={item.code} type="button" role="option" aria-selected={country.code === item.code} onClick={() => { setCountry(item); setOpen(false) }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-[#123253]"><span className="text-lg">{item.flag}</span>{item.name}</button>)}
        </div>}
      </div>
      <Link href="/konto" className="flex min-h-11 items-center gap-1.5 rounded-xl border border-[#159cff] px-3 text-[13px] font-bold text-[#8dd0ff] shadow-[0_0_14px_-8px_#159cff] transition-colors hover:bg-[#102e4e] sm:gap-2 sm:px-4 sm:text-[15px]">
        <UserRound className="size-[18px]" /> <span>Log ind</span>
      </Link>
    </div>
  )
}
