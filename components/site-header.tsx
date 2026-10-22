import Link from 'next/link'
import { BarChart3, Gift, Home } from 'lucide-react'
import { BrandMark } from '@/components/icons'
import { HeaderControls } from '@/components/header-controls'

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#102b49] bg-[linear-gradient(180deg,#061a31_0%,#050f1f_100%)] px-4 pb-3 pt-[calc(1rem+env(safe-area-inset-top))] md:px-8 md:py-5 lg:px-10">
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
      <nav className="hidden items-center gap-1 md:flex" aria-label="Hovednavigation">
        <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"><Home className="size-4" /> SikkerBets</Link>
        <Link href="/stats" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"><BarChart3 className="size-4" /> Stats</Link>
        <Link href="/bonus" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"><Gift className="size-4" /> Bonus</Link>
      </nav>
      <HeaderControls />
    </header>
  )
}
