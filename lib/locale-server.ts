import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, makeTranslator, type Locale } from '@/lib/i18n'

export async function getServerLocale(): Promise<Locale> {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(stored) ? stored : DEFAULT_LOCALE
}

export async function getServerT() {
  return makeTranslator(await getServerLocale())
}
