import type { Metadata } from 'next'
import { HREFLANG, LOCALE_PREFIX, localePath, type Locale } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

export const ALL_LOCALES: Locale[] = ['da', 'en', 'sv', 'no', 'de', 'es', 'br', 'pt', 'fr', 'it', 'pl', 'fi', 'nl']

// Sections whose body copy exists in every language. Everything else is still Danish-only,
// so its translated URLs point back to the Danish page instead of competing with it.
export const TRANSLATED_SECTIONS = ['/guide', '/sport', '/bookmaker'] as const

// Stand-alone pages with full copy in every language.
export const TRANSLATED_PAGES = ['/dagens-surebets', '/faq'] as const

// Languages Google may index. Every language now has its own localised copy and keywords.
export const INDEXABLE_LOCALES: Locale[] = ['da', 'en', 'sv', 'no', 'de', 'es', 'br', 'pt', 'fr', 'it', 'pl', 'fi', 'nl']

export function isIndexable(locale: Locale) {
  return INDEXABLE_LOCALES.includes(locale)
}

export function localeRobots(locale: Locale): Metadata['robots'] | undefined {
  return isIndexable(locale) ? undefined : { index: false, follow: true }
}

export function translatedLocalesFor(path: string): Locale[] {
  const translated =
    path === '/' ||
    (TRANSLATED_PAGES as readonly string[]).includes(path) ||
    TRANSLATED_SECTIONS.some((section) => path === section || path.startsWith(`${section}/`))
  return translated ? INDEXABLE_LOCALES : ['da']
}

export function absoluteUrl(locale: Locale, path: string) {
  const localized = localePath(locale, path)
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`
}

export function buildAlternates(
  path: string,
  locale: Locale,
  available: Locale[] = translatedLocalesFor(path),
): NonNullable<Metadata['alternates']> {
  if (!isIndexable(locale)) return { canonical: absoluteUrl(locale, path) }
  const canonicalLocale = available.includes(locale) ? locale : 'da'
  const canonical = absoluteUrl(canonicalLocale, path)
  if (available.length < 2) return { canonical }

  const languages: Record<string, string> = Object.fromEntries(available.map((item) => [HREFLANG[item], absoluteUrl(item, path)]))
  languages['x-default'] = absoluteUrl('da', path)
  return { canonical, languages }
}

export { LOCALE_PREFIX }
