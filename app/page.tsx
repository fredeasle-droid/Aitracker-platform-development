import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SignupBanner } from '@/components/signup-banner'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const opportunities = await getOpportunities()
  return (
    <main>
      <SiteHeader />
      <SignupBanner />
      <h1 className="sr-only">SikkerBets</h1>
      <div className="lg:flex lg:items-start lg:gap-4 lg:px-4 lg:pt-4">
        <Suspense fallback={null}>
          <OpportunityList initial={opportunities} />
        </Suspense>
        <DesktopAside opportunities={opportunities} />
      </div>
    </main>
  )
}
