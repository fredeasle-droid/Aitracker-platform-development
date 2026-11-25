// Kept free of imports so data tables and the language packs can share it without import cycles.
export const BASE_LOCALES = ['da', 'en', 'sv', 'no', 'de', 'es', 'br', 'pt', 'fr', 'it', 'pl', 'fi', 'nl'] as const
export const NEW_LOCALES = ['tr', 'cs', 'el', 'hu', 'hr', 'sk', 'mx', 'ar', 'ch', 'at', 'be'] as const

export type BaseLocale = (typeof BASE_LOCALES)[number]
export type NewLocale = (typeof NEW_LOCALES)[number]
export type Locale = BaseLocale | NewLocale
export type BaseTranslated = Exclude<BaseLocale, 'da'>

// Each new market is written from an existing language: new languages from English,
// regional variants from their parent language (then adapted to the country, not copied).
export const LOCALE_SOURCE: Record<NewLocale, BaseTranslated> = {
  tr: 'en',
  cs: 'en',
  el: 'en',
  hu: 'en',
  hr: 'en',
  sk: 'en',
  mx: 'es',
  ar: 'es',
  ch: 'de',
  at: 'de',
  be: 'nl',
}

export const LOCALE_MONEY: Record<NewLocale, { numberTag: string; currency: string }> = {
  tr: { numberTag: 'tr-TR', currency: 'TRY' },
  cs: { numberTag: 'cs-CZ', currency: 'CZK' },
  el: { numberTag: 'el-GR', currency: 'EUR' },
  hu: { numberTag: 'hu-HU', currency: 'HUF' },
  hr: { numberTag: 'hr-HR', currency: 'EUR' },
  sk: { numberTag: 'sk-SK', currency: 'EUR' },
  mx: { numberTag: 'es-MX', currency: 'MXN' },
  ar: { numberTag: 'es-AR', currency: 'ARS' },
  ch: { numberTag: 'de-CH', currency: 'CHF' },
  at: { numberTag: 'de-AT', currency: 'EUR' },
  be: { numberTag: 'nl-BE', currency: 'EUR' },
}
