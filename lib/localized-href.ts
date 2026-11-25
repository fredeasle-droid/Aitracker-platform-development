import { localePath, stripLocalePrefix, type Locale } from '@/lib/i18n'
import { canonicalRoute } from '@/lib/route-slugs'

export function localizedInternalHref(locale: Locale, href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const suffixIndex = href.search(/[?#]/)
  const pathname = suffixIndex === -1 ? href : href.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex)
  const { locale: sourceLocale, path } = stripLocalePrefix(pathname)
  const source = sourceLocale ?? locale

  if (pathname.startsWith('/api/') || pathname === '/api' || pathname.startsWith('/_next/')) return href

  return localePath(locale, `${canonicalRoute(source, path)}${suffix}`)
}
