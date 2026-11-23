import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { redirect } from 'next/navigation'
import { HomeView } from '@/components/home/HomeView'
import { auth } from '@/lib/auth'
import { getSubscription, ACTIVE_STATUSES } from '@/lib/billing'
import { getHomeData } from '@/lib/home-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { alternates: { canonical: '/' } }

const JSON_LD = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'da-DK',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, iOS, Android',
    url: SITE_URL,
    description: 'Surebet-scanner der finder garanteret profit på tværs af danske bookmakere i realtid.',
  },
])

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    const subscription = await getSubscription(session.user.id)
    if (subscription && ACTIVE_STATUSES.includes(subscription.status) && !subscription.onboardingCompletedAt) redirect('/konto')
  }

  const data = await getHomeData()
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <HomeView data={data} />
    </main>
  )
}
