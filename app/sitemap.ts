import type { MetadataRoute } from 'next'
import { GUIDES } from '@/lib/guides'
import { guideLocales } from '@/lib/content-i18n'
import { HREFLANG, type Locale } from '@/lib/i18n'
import { BOOKMAKER_PAGES, SPORT_PAGES, UPDATED } from '@/lib/landing-pages'
import { INDEXABLE_LOCALES, absoluteUrl } from '@/lib/seo/alternates'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/site'

type Entry = MetadataRoute.Sitemap[number]

function translatedEntries(path: string, lastModified: Date, priority: number, locales: Locale[] = INDEXABLE_LOCALES): Entry[] {
  const available = INDEXABLE_LOCALES.filter((locale) => locales.includes(locale))
  const languages: Record<string, string> = Object.fromEntries(available.map((locale) => [HREFLANG[locale], absoluteUrl(locale, path)]))
  languages['x-default'] = absoluteUrl('da', path)
  return available.map((locale) => ({
    url: absoluteUrl(locale, path),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: locale === 'da' ? priority : Math.max(priority - 0.1, 0.3),
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Entry[] = PUBLIC_PAGES.flatMap(({ path, priority, changeFrequency }) => {
    if (path === '/guide' || path === '/' || path === '/dagens-surebets' || path === '/faq') return translatedEntries(path, new Date(), priority)
    return [{ url: `${SITE_URL}${path === '/' ? '' : path}`, lastModified: new Date(), changeFrequency, priority }]
  })
  const guides = GUIDES.flatMap((guide) => translatedEntries(`/guide/${guide.slug}`, new Date(guide.updated), 0.7, guideLocales(guide.slug)))
  const landing = [
    ...SPORT_PAGES.map((page) => ({ path: `/sport/${page.slug}`, priority: 0.7 })),
    ...BOOKMAKER_PAGES.map((page) => ({ path: `/bookmaker/${page.slug}`, priority: 0.6 })),
  ].flatMap(({ path, priority }) => translatedEntries(path, new Date(UPDATED), priority))
  return [...pages, ...guides, ...landing]
}
