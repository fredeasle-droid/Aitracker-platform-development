import type { MetadataRoute } from 'next'
import { GUIDES } from '@/lib/guides'
import { HREFLANG } from '@/lib/i18n'
import { BOOKMAKER_PAGES, SPORT_PAGES, UPDATED } from '@/lib/landing-pages'
import { ALL_LOCALES, absoluteUrl } from '@/lib/seo/alternates'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/site'

type Entry = MetadataRoute.Sitemap[number]

function translatedEntries(path: string, lastModified: Date, priority: number): Entry[] {
  const languages: Record<string, string> = Object.fromEntries(ALL_LOCALES.map((locale) => [HREFLANG[locale], absoluteUrl(locale, path)]))
  languages['x-default'] = absoluteUrl('da', path)
  return ALL_LOCALES.map((locale) => ({
    url: absoluteUrl(locale, path),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: locale === 'da' ? priority : Math.max(priority - 0.1, 0.3),
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Entry[] = PUBLIC_PAGES.flatMap(({ path, priority, changeFrequency }) => {
    if (path === '/guide') return translatedEntries(path, new Date(), priority)
    return [{ url: `${SITE_URL}${path === '/' ? '' : path}`, lastModified: new Date(), changeFrequency, priority }]
  })
  const guides = GUIDES.flatMap((guide) => translatedEntries(`/guide/${guide.slug}`, new Date(guide.updated), 0.7))
  const landing = [
    ...SPORT_PAGES.map((page) => ({ path: `/sport/${page.slug}`, priority: 0.7 })),
    ...BOOKMAKER_PAGES.map((page) => ({ path: `/bookmaker/${page.slug}`, priority: 0.6 })),
  ].flatMap(({ path, priority }) => translatedEntries(path, new Date(UPDATED), priority))
  return [...pages, ...guides, ...landing]
}
