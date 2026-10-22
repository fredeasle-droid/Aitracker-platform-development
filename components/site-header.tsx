import Link from 'next/link'
import { BrandMark } from '@/components/icons'
import { LiveOddsPill } from '@/components/live-odds-pill'
import { NotificationsMenu } from '@/components/notifications-menu'
import { getOpportunities } from '@/lib/data'
import { formatTime } from '@/lib/dates'

export async function SiteHeader() {
  const opportunities = await getOpportunities()
  const alerts = opportunities
    .filter((o) => o.margin >= 4)
    .sort((a, b) => b.margin - a.margin)
    .map((o) => ({ id: o.id, title: `${o.homeTeam} vs ${o.awayTeam}`, market: o.market, margin: o.margin, kickoff: o.kickoffLabel }))

  return (
    <header className="flex items-center justify-between gap-2 px-4 pb-3 pt-[calc(1rem+env(safe-area-inset-top))]">
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
      <div className="flex shrink-0 items-center gap-1.5">
        <LiveOddsPill updated={formatTime(new Date())} />
        <NotificationsMenu alerts={alerts} />
      </div>
    </header>
  )
}
