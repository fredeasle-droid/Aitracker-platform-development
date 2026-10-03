import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { SiteHeader } from '@/components/site-header'
import { getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function SikkerBetsPreviewPage() {
  const opportunities = await getOpportunities()

  return (
    <main>
      <SiteHeader />
      <h1 className="sr-only">SikkerBets test-preview</h1>
      <OpportunityList initial={opportunities} />
    </main>
  )
}
