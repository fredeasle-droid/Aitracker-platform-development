// Kept free of app imports so the translator and the UI can share it without import cycles.
// Source copy and plan prices are written in Danish kroner (DKK). Every market shows its own currency instead.

type Market = { currency: string; tag: string; rate: number }

// `rate` is how much of the local currency 1 DKK is worth. Approximate display rates, not billing rates.
const MARKETS: Record<string, Market> = {
  da: { currency: 'DKK', tag: 'da-DK', rate: 1 },
  en: { currency: 'EUR', tag: 'en-IE', rate: 0.134 },
  sv: { currency: 'SEK', tag: 'sv-SE', rate: 1.45 },
  no: { currency: 'NOK', tag: 'nb-NO', rate: 1.58 },
  de: { currency: 'EUR', tag: 'de-DE', rate: 0.134 },
  es: { currency: 'EUR', tag: 'es-ES', rate: 0.134 },
  br: { currency: 'BRL', tag: 'pt-BR', rate: 0.83 },
  pt: { currency: 'EUR', tag: 'pt-PT', rate: 0.134 },
  fr: { currency: 'EUR', tag: 'fr-FR', rate: 0.134 },
  it: { currency: 'EUR', tag: 'it-IT', rate: 0.134 },
  pl: { currency: 'PLN', tag: 'pl-PL', rate: 0.57 },
  fi: { currency: 'EUR', tag: 'fi-FI', rate: 0.134 },
  nl: { currency: 'EUR', tag: 'nl-NL', rate: 0.134 },
  tr: { currency: 'TRY', tag: 'tr-TR', rate: 6.3 },
  cs: { currency: 'CZK', tag: 'cs-CZ', rate: 3.25 },
  el: { currency: 'EUR', tag: 'el-GR', rate: 0.134 },
  hu: { currency: 'HUF', tag: 'hu-HU', rate: 52 },
  hr: { currency: 'EUR', tag: 'hr-HR', rate: 0.134 },
  sk: { currency: 'EUR', tag: 'sk-SK', rate: 0.134 },
  mx: { currency: 'MXN', tag: 'es-MX', rate: 2.8 },
  ar: { currency: 'ARS', tag: 'es-AR', rate: 215 },
  ch: { currency: 'CHF', tag: 'de-CH', rate: 0.125 },
  at: { currency: 'EUR', tag: 'de-AT', rate: 0.134 },
  be: { currency: 'EUR', tag: 'nl-BE', rate: 0.134 },
}

const marketOf = (locale: string) => MARKETS[locale] ?? MARKETS.da

/** Keeps two or three significant digits so converted amounts read like real prices (1.340 -> 1.300). */
function roundForDisplay(value: number) {
  if (value < 100) return Math.round(value)
  const step = 10 ** (Math.floor(Math.log10(value)) - 1)
  return Math.round(value / step) * step
}

const formatterCache = new Map<string, Intl.NumberFormat>()
function formatter(locale: string) {
  let format = formatterCache.get(locale)
  if (!format) {
    const { tag, currency } = marketOf(locale)
    format = new Intl.NumberFormat(tag, { style: 'currency', currency, maximumFractionDigits: 0, minimumFractionDigits: 0 })
    formatterCache.set(locale, format)
  }
  return format
}

export function currencyCode(locale: string) {
  return marketOf(locale).currency
}

/** The market's currency sign on its own, e.g. "€", "kr", "zł". */
export function currencySymbol(locale: string) {
  const part = formatter(locale).formatToParts(0).find((p) => p.type === 'currency')
  return part?.value ?? currencyCode(locale)
}

/** Converts an amount written in DKK to the market's currency, rounded for display. */
export function convertDkk(amountDkk: number, locale: string) {
  const { rate } = marketOf(locale)
  return rate === 1 ? Math.round(amountDkk) : roundForDisplay(amountDkk * rate)
}

/** Formats an amount written in DKK as money in the market's own currency, e.g. 499 -> "67 €". */
export function formatMoney(amountDkk: number, locale: string) {
  return formatter(locale).format(convertDkk(amountDkk, locale))
}

const NUMBER = String.raw`\d{1,3}(?:[.,\s\u00a0\u202f]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?`
const AMOUNT_AFTER = new RegExp(`(${NUMBER})[\\s\\u00a0\\u202f]*(?:kr\\b\\.?|DKK\\b)`, 'g')
const AMOUNT_BEFORE = new RegExp(`\\bDKK[\\s\\u00a0\\u202f]*(${NUMBER})`, 'g')
const BARE_KR = /(?<![\w/])kr\b\.?/g

function parseAmount(raw: string) {
  const text = raw.replace(/[\s\u00a0\u202f]/g, '')
  const lastSeparator = Math.max(text.lastIndexOf('.'), text.lastIndexOf(','))
  const decimals = lastSeparator >= 0 ? text.length - lastSeparator - 1 : 0
  if (lastSeparator >= 0 && decimals <= 2) {
    return Number(`${text.slice(0, lastSeparator).replace(/[.,]/g, '')}.${text.slice(lastSeparator + 1)}`)
  }
  return Number(text.replace(/[.,]/g, ''))
}

/**
 * Rewrites Danish-kroner amounts inside copy ("10.000 kr.", "DKK 1,000") as the market's currency.
 * Copy that is already in the right currency (Danish, or text without kr/DKK) is returned unchanged.
 */
export function localizeMoneyText(text: string, locale: string) {
  if (locale === 'da' || !/kr\b|DKK/.test(text)) return text
  const money = (raw: string) => formatMoney(parseAmount(raw), locale)
  return text
    .replace(AMOUNT_AFTER, (_m, amount: string) => money(amount))
    .replace(AMOUNT_BEFORE, (_m, amount: string) => money(amount))
    .replace(BARE_KR, currencySymbol(locale))
}
