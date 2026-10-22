import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { StatsView } from '@/components/stats/stats-view'
import { getBets } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stats – BetTracker' }

export default async function StatsPage() {
  const bets = await getBets()
  return (
    <main>
      <SiteHeader />
      <StatsView bets={bets} now={Date.now()} />
    </main>
  )
}
