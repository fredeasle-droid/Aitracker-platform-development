import type { Metadata } from 'next'
import { HREFLANG, LOCALE_PREFIX, localePath, type Locale } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

export const ALL_LOCALES: Locale[] = ['da', 'en', 'sv', 'no', 'de']

// Sections whose body copy exists in every language. Everything else is still Danish-only,
// so its translated URLs point back to the Danish page instead of competing with it.
export const TRANSLATED_SECTIONS = ['/guide', '/sport', '/bookmaker'] as const

export function translatedLocalesFor(path: string): Locale[] {
  const translated = TRANSLATED_SECTIONS.some((section) => path === section || path.startsWith(`${section}/`))
  return translated ? ALL_LOCALES : ['da']
}

export function absoluteUrl(locale: Locale, path: string) {
  const localized = localePath(locale, path)
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`
}

export function buildAlternates(path: string, locale: Locale): NonNullable<Metadata['alternates']> {
  const available = translatedLocalesFor(path)
  const canonicalLocale = available.includes(locale) ? locale : 'da'
  const canonical = absoluteUrl(canonicalLocale, path)
  if (available.length < 2) return { canonical }

  const languages: Record<string, string> = Object.fromEntries(available.map((item) => [HREFLANG[item], absoluteUrl(item, path)]))
  languages['x-default'] = absoluteUrl('da', path)
  return { canonical, languages }
}

export { LOCALE_PREFIX }
