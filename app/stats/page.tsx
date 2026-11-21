import type { Metadata } from 'next'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { StatsView } from '@/components/stats/stats-view'
import { getBets, getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stats – BetTracker' }

export default async function StatsPage() {
  const [bets, opportunities] = await Promise.all([getBets(), getOpportunities()])
  const now = Date.now()
  return (
    <main className="lg:min-h-dvh lg:bg-[#030914]">
      <div className="flex w-full items-start gap-4 px-4 pt-3 lg:pt-4">
        <StatsView bets={bets} now={now} />
        <DesktopAside opportunities={opportunities} />
      </div>
    </main>
  )
}
