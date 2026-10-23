import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { DesktopStats } from '@/components/desktop/desktop-stats'
import { StatsView } from '@/components/stats/stats-view'
import { getBets, getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stats – BetTracker' }

export default async function StatsPage() {
  const [bets, opportunities] = await Promise.all([getBets(), getOpportunities()])
  const now = Date.now()
  return (
    <main className="lg:min-h-dvh lg:bg-[#030914]">
      <div className="hidden w-full gap-4 px-4 lg:flex lg:items-start lg:pb-6 lg:pt-4">
        <DesktopStats bets={bets} now={now} />
        <DesktopAside opportunities={opportunities} />
      </div>
      <div className="lg:hidden">
        <SiteHeader />
        <StatsView bets={bets} now={now} />
      </div>
    </main>
  )
}
