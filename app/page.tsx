import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { getOpportunities } from '@/lib/data'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSubscription, ACTIVE_STATUSES } from '@/lib/billing'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    const subscription = await getSubscription(session.user.id)
    if (subscription && ACTIVE_STATUSES.includes(subscription.status) && !subscription.onboardingCompletedAt) redirect('/konto')
  }

  const opportunities = await getOpportunities()
  return (
    <main>
      <SiteHeader />
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
