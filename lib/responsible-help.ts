import type { Locale } from '@/lib/i18n'
import data from './responsible-help.json'

export type LocalHelp = {
  minAge: number
  ageLabel: string
  text: string
  links: { label: string; href: string }[]
}

const HELP = data as Record<string, LocalHelp>

/** Local responsible-gambling help for a market; null for Danish, which uses StopSpillet and ROFUS. */
export function localHelp(locale: Locale): LocalHelp | null {
  if (locale === 'da') return null
  return HELP[locale] ?? HELP.en
}
