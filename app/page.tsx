import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { redirect } from 'next/navigation'
import { HomeView } from '@/components/home/HomeView'
import { auth } from '@/lib/auth'
import { getSubscription, ACTIVE_STATUSES } from '@/lib/billing'
import { getHomeData } from '@/lib/home-data'
import { localePath, LOCALES, OG_LOCALE, type Locale } from '@/lib/i18n'
import { getServerLocale, getServerT } from '@/lib/locale-server'
import { absoluteUrl, buildAlternates, localeRobots } from '@/lib/seo/alternates'
import { videoObjectJsonLd } from '@/lib/video'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const { t } = await getServerT()
  return {
    alternates: buildAlternates('/', locale),
    robots: localeRobots(locale),
    openGraph: {
      url: absoluteUrl(locale, '/'),
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: t('metaTitle'),
      description: t('metaDesc'),
    },
  }
}

function homeJsonLd(locale: Locale, description: string) {
  const url = absoluteUrl(locale, '/')
  return JSON.stringify([
    ...(locale === 'da' ? [videoObjectJsonLd()] : []),
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      legalName: 'ODDSLOGIC LTD',
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url,
      inLanguage: LOCALES[locale].tag,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web, iOS, Android',
      url,
      inLanguage: LOCALES[locale].tag,
      description,
    },
  ])
}

export default async function HomePage() {
  const locale = await getServerLocale()
  const { t } = await getServerT()
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    const subscription = await getSubscription(session.user.id)
    if (subscription && ACTIVE_STATUSES.includes(subscription.status) && !subscription.onboardingCompletedAt) redirect(localePath(locale, '/konto'))
  }

  const data = await getHomeData()
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeJsonLd(locale, t('metaDesc')) }} />
      <HomeView data={data} />
    </main>
  )
}
