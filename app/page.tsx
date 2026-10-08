import { SurebetCoach } from '@/components/surebet-coach'
import { SiteHeader } from '@/components/site-header'
import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const opportunities = await getOpportunities()
  return (
    <main>
      <SiteHeader />
      <h1 className="sr-only">SikkerBets</h1>
      <OpportunityList initial={opportunities} />
      <SurebetCoach />
    </main>
  )
}
