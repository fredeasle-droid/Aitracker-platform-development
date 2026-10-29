import Link from 'next/link'
import { Bell } from 'lucide-react'
import { BrandMark } from '@/components/icons'
import { AccountIconLink } from '@/components/header-controls'
import { LiveOddsPill } from '@/components/live-odds-pill'

function updatedLabel() {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' }).format(new Date())
}

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-[#102b49] bg-[linear-gradient(180deg,#061a31_0%,#050f1f_100%)] px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] lg:hidden">
      <Link href="/" className="flex shrink-0 items-center gap-1.5" aria-label="BetTracker forside">
        <BrandMark className="h-7 w-9 shrink-0" />
        <span className="flex flex-col">
          <span className="text-[22px] font-extrabold leading-none tracking-tight">
            Bet<span className="text-primary">Tracker</span>
          </span>
          <span className="mt-1 whitespace-nowrap text-[6.5px] font-semibold leading-none tracking-wide text-[#a9b6d3]">
            {'SIKKERBETS · ENKLERE · STØRRE OVERBLIK'}
          </span>
        </span>
      </Link>
      <div className="flex min-w-0 items-center gap-1">
        <LiveOddsPill updated={updatedLabel()} />
        <Link
          href="/konto"
          aria-label="Notifikationer"
          className="relative flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-6" aria-hidden="true" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
        </Link>
        <AccountIconLink />
      </div>
    </header>
  )
}
