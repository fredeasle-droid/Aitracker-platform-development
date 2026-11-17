import { Suspense } from 'react'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Surebets | BetTrackerAI' }

export default async function SurebetsPage() {
  const opportunities = await getOpportunities()
  return (
    <main>
      <h1 className="sr-only">Sure bets</h1>
      <div className="lg:flex lg:items-start lg:gap-4 lg:px-4 lg:pt-4">
        <Suspense fallback={null}>
          <OpportunityList initial={opportunities} />
        </Suspense>
        <DesktopAside opportunities={opportunities} />
      </div>
    </main>
  )
}
