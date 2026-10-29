import Link from 'next/link'
import { Bell } from 'lucide-react'
import { BrandMark } from '@/components/icons'
import { LiveOddsPill } from '@/components/live-odds-pill'

function updatedLabel() {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' }).format(new Date())
}

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-1 pb-3.5 pl-3 pr-1 pt-[calc(11px+env(safe-area-inset-top))] lg:hidden">
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BetTracker forside">
        <BrandMark showTrend={false} className="h-[25px] w-[28px] shrink-0" />
        <span className="flex flex-col">
          <span className="text-[25px] font-extrabold leading-none tracking-tight">
            Bet<span className="text-primary">Tracker</span>
          </span>
          <span className="mt-[7px] whitespace-nowrap text-[7.2px] font-semibold leading-none tracking-[0.04em] text-[#8fa3cc]">
            {'SIKKERBETS · ENKLERE · STØRRE OVERBLIK'}
          </span>
        </span>
      </Link>
      <div className="flex min-w-0 items-center">
        <LiveOddsPill updated={updatedLabel()} />
        <Link
          href="/konto"
          aria-label="Notifikationer og konto"
          className="flex size-[37px] shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
