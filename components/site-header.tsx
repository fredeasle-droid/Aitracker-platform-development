import Link from 'next/link'
import { BrandMark } from '@/components/icons'
import { HeaderControls } from '@/components/header-controls'

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-[#102b49] bg-[linear-gradient(180deg,#061a31_0%,#050f1f_100%)] px-4 pb-3 pt-[calc(1rem+env(safe-area-inset-top))]">
      <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="BetTracker forside">
        <BrandMark className="h-9 w-12 shrink-0" />
        <span className="flex min-w-0 flex-col">
          <span className="text-[28px] font-extrabold leading-none tracking-tight">
            Bet<span className="text-primary">Tracker</span>
          </span>
          <span className="mt-1 text-[8px] font-medium leading-tight text-[#a9b6d3] min-[400px]:text-[8.5px]">
            {'SIKKERBETS · ENKLERE · STØRRE OVERBLIK'}
          </span>
        </span>
      </Link>
      <HeaderControls />
    </header>
  )
}
