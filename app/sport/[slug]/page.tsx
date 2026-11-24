import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LandingArticle } from '@/components/seo/landing-article'
import { getLocalizedLanding } from '@/lib/content-i18n'
import { OG_LOCALE } from '@/lib/i18n'
import { SPORT_PAGES } from '@/lib/landing-pages'
import { getServerLocale } from '@/lib/locale-server'
import { absoluteUrl, buildAlternates, localeRobots } from '@/lib/seo/alternates'

export const dynamicParams = false

export function generateStaticParams() {
  return SPORT_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getServerLocale()
  const page = getLocalizedLanding('sport', (await params).slug, locale)
  if (!page) return {}
  const path = `/sport/${page.slug}`
  return {
    title: page.metaTitle,
    description: page.description,
    keywords: [page.keyword],
    alternates: buildAlternates(path, locale),
    robots: localeRobots(locale),
    openGraph: { type: 'website', url: absoluteUrl(locale, path), locale: OG_LOCALE[locale], title: page.metaTitle, description: page.description },
  }
}

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getServerLocale()
  const page = getLocalizedLanding('sport', (await params).slug, locale)
  if (!page) notFound()
  return <LandingArticle page={page} kind="sport" locale={locale} />
}
