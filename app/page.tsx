import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { HomeView } from '@/components/home/HomeView'
import { auth } from '@/lib/auth'
import { getSubscription, ACTIVE_STATUSES } from '@/lib/billing'
import { getHomeData } from '@/lib/home-data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    const subscription = await getSubscription(session.user.id)
    if (subscription && ACTIVE_STATUSES.includes(subscription.status) && !subscription.onboardingCompletedAt) redirect('/konto')
  }

  const data = await getHomeData()
  return (
    <main>
      <HomeView data={data} />
    </main>
  )
}
