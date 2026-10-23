import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { getOpportunities, getOpportunityPage } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [opportunities, firstPage] = await Promise.all([getOpportunities(), getOpportunityPage()])
  return (
    <main>
      <SiteHeader />
      <h1 className="sr-only">SikkerBets</h1>
      <div className="lg:flex lg:items-start lg:gap-4 lg:px-4 lg:pt-4">
        <Suspense fallback={null}>
          <OpportunityList initial={firstPage.items} total={firstPage.total} />
        </Suspense>
        <DesktopAside opportunities={opportunities} />
      </div>
    </main>
  )
}
