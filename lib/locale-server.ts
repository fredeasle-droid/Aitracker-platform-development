import { cookies, headers } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_HEADER, isLocale, makeTranslator, type Locale } from '@/lib/i18n'

export async function getServerLocale(): Promise<Locale> {
  const fromUrl = (await headers()).get(LOCALE_HEADER)
  if (isLocale(fromUrl)) return fromUrl
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(stored) ? stored : DEFAULT_LOCALE
}

export async function getServerT() {
  return makeTranslator(await getServerLocale())
}
