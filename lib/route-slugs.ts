import type { Locale } from '@/lib/i18n'

// Public URLs for the translated sections use words people actually search for in each country.
// Internally every page still lives at its Danish path; the proxy rewrites localized URLs to it.
type Section = 'guide' | 'sport' | 'bookmaker'
type Translated = Exclude<Locale, 'da'>

const SECTION_NAMES: Record<Translated, Record<Section, string>> = {
  en: { guide: 'guides', sport: 'sports', bookmaker: 'bookmakers' },
  sv: { guide: 'guider', sport: 'sport', bookmaker: 'spelbolag' },
  no: { guide: 'guider', sport: 'sport', bookmaker: 'bookmakere' },
  de: { guide: 'ratgeber', sport: 'sportarten', bookmaker: 'buchmacher' },
}

const SLUGS: Record<Translated, Record<string, string>> = {
  en: {
    'er-surebets-lovligt': 'are-surebets-legal',
    'undgaa-begraensning': 'avoid-bookmaker-limits',
    'surebet-beregner': 'surebet-calculator',
    'odds-beregner': 'odds-calculator',
    'bedste-bookmakere-til-surebets': 'best-bookmakers-for-surebets',
    'skat-paa-spillegevinster': 'tax-on-gambling-winnings',
    'hvad-er-surebets': 'what-are-surebets',
    'fodbold-surebets': 'football-surebets',
    'bookmakerens-margin': 'bookmaker-margin',
    'asiatisk-handicap': 'asian-handicap',
    'surebet-danmark-alternativ': 'surebet-tool-comparison',
    'betting-regnskab': 'betting-accounts',
    fodbold: 'football',
    ishockey: 'ice-hockey',
    esport: 'esports',
  },
  sv: {
    'er-surebets-lovligt': 'ar-surebets-lagligt',
    'undgaa-begraensning': 'undvik-begransade-konton',
    'surebet-beregner': 'surebet-kalkylator',
    'odds-beregner': 'oddskalkylator',
    'value-betting-vs-surebets': 'value-bets-vs-surebets',
    'bedste-bookmakere-til-surebets': 'basta-spelbolag-for-surebets',
    'skat-paa-spillegevinster': 'skatt-pa-spelvinster',
    'arbitrage-betting': 'arbitragespel',
    'hvad-er-surebets': 'vad-ar-surebets',
    'tennis-surebets': 'surebets-tennis',
    'fodbold-surebets': 'surebets-fotboll',
    'bookmakerens-margin': 'spelbolagets-marginal',
    'asiatisk-handicap': 'asiatiskt-handicap',
    'surebet-danmark-alternativ': 'surebet-verktyg-jamforelse',
    'betting-regnskab': 'spelredovisning',
    'dutching-betting': 'dutching',
    'tjen-penge-paa-odds-uden-risiko': 'tjana-pengar-pa-odds-utan-risk',
    'find-surebets-automatisk': 'hitta-surebets-automatiskt',
    'find-value-bets-med-ai': 'hitta-value-bets-med-ai',
    'bedste-odds-vaerktoej-danmark': 'basta-oddsverktyget-sverige',
    fodbold: 'fotboll',
    basketball: 'basket',
    esport: 'e-sport',
  },
  no: {
    'er-surebets-lovligt': 'er-surebets-lovlig',
    'undgaa-begraensning': 'unnga-begrensede-kontoer',
    'surebet-beregner': 'surebet-kalkulator',
    'odds-beregner': 'odds-kalkulator',
    'bedste-bookmakere-til-surebets': 'beste-bookmakere-for-surebets',
    'skat-paa-spillegevinster': 'skatt-pa-spillegevinster',
    'arbitrage-betting': 'arbitrasjespill',
    'hvad-er-surebets': 'hva-er-surebets',
    'dutching-betting': 'dutching',
    'tennis-surebets': 'surebets-tennis',
    'fodbold-surebets': 'surebets-fotball',
    'surebet-danmark-alternativ': 'surebet-verktoy-sammenligning',
    'betting-regnskab': 'spillregnskap',
    'tjen-penge-paa-odds-uden-risiko': 'tjen-penger-pa-odds-uten-risiko',
    'find-surebets-automatisk': 'finn-surebets-automatisk',
    'find-value-bets-med-ai': 'finn-value-bets-med-ai',
    'bedste-odds-vaerktoej-danmark': 'beste-odds-verktoy-norge',
    fodbold: 'fotball',
    esport: 'e-sport',
  },
  de: {
    'er-surebets-lovligt': 'sind-surebets-legal',
    'undgaa-begraensning': 'kontolimits-vermeiden',
    'surebet-beregner': 'surebet-rechner',
    'odds-beregner': 'quotenrechner',
    'value-betting-vs-surebets': 'value-bets-vs-surebets',
    'bedste-bookmakere-til-surebets': 'beste-wettanbieter-fuer-surebets',
    'skat-paa-spillegevinster': 'steuer-auf-sportwetten-gewinne',
    'bankroll-management': 'bankroll-management-wetten',
    'arbitrage-betting': 'sportwetten-arbitrage',
    'hvad-er-surebets': 'was-sind-surebets',
    'dutching-betting': 'dutching-wetten',
    'tennis-surebets': 'surebets-tennis',
    'fodbold-surebets': 'surebets-fussball',
    'bookmakerens-margin': 'buchmacher-marge',
    'asiatisk-handicap': 'asiatisches-handicap',
    'bet-tracker': 'wetten-verfolgen',
    'roi-betting': 'roi-wetten',
    'surebet-danmark-alternativ': 'arbitrage-wetten-tool-vergleich',
    'betting-regnskab': 'wettbuchhaltung',
    fodbold: 'fussball',
    ishockey: 'eishockey',
  },
}

// Stand-alone pages that exist in every language. Keys are the canonical (Danish) paths.
const PAGE_NAMES: Record<Translated, Record<string, string>> = {
  en: { '/dagens-surebets': '/todays-surebets', '/beregn': '/calculator', '/konto': '/account' },
  sv: { '/faq': '/vanliga-fragor', '/beregn': '/kalkylator', '/konto': '/mitt-konto' },
  no: { '/faq': '/vanlige-sporsmal', '/beregn': '/kalkulator' },
  de: { '/dagens-surebets': '/surebets-heute', '/beregn': '/rechner', '/konto': '/mein-konto' },
}

const REVERSE_PAGE_NAMES = Object.fromEntries(
  (Object.keys(PAGE_NAMES) as Translated[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(PAGE_NAMES[locale]).map(([canonical, localized]) => [localized, canonical])),
  ]),
) as Record<Translated, Record<string, string>>

const SECTIONS: Section[] = ['guide', 'sport', 'bookmaker']

function isSection(value: string): value is Section {
  return (SECTIONS as string[]).includes(value)
}

// Reverse lookups, built once.
const REVERSE_SECTION = Object.fromEntries(
  (Object.keys(SECTION_NAMES) as Translated[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(SECTION_NAMES[locale]).map(([section, name]) => [name, section])),
  ]),
) as Record<Translated, Record<string, Section>>

const REVERSE_SLUGS = Object.fromEntries(
  (Object.keys(SLUGS) as Translated[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(SLUGS[locale]).map(([canonical, localized]) => [localized, canonical])),
  ]),
) as Record<Translated, Record<string, string>>

function splitSuffix(path: string) {
  const index = path.search(/[?#]/)
  return index === -1 ? { pathname: path, suffix: '' } : { pathname: path.slice(0, index), suffix: path.slice(index) }
}

export function localizeSlug(locale: Locale, slug: string) {
  return locale === 'da' ? slug : (SLUGS[locale][slug] ?? slug)
}

// Canonical (Danish) path -> the public path for a language.
export function localizeRoute(locale: Locale, path: string) {
  if (locale === 'da') return path
  const { pathname, suffix } = splitSuffix(path)
  const [, section, slug, ...rest] = pathname.split('/')
  if (!section || !isSection(section)) {
    const page = PAGE_NAMES[locale][pathname]
    return page ? `${page}${suffix}` : path
  }
  const segments = [SECTION_NAMES[locale][section]]
  if (slug) segments.push(localizeSlug(locale, slug))
  return `/${[...segments, ...rest].join('/')}${suffix}`
}

// Public path for a language -> canonical (Danish) path. Danish names are accepted too,
// so old links keep resolving and can be redirected to the new address.
export function canonicalRoute(locale: Locale, path: string) {
  if (locale === 'da') return path
  const { pathname, suffix } = splitSuffix(path)
  const [, first, slug, ...rest] = pathname.split('/')
  if (!first) return path
  const section = REVERSE_SECTION[locale][first] ?? (isSection(first) ? first : undefined)
  if (!section) {
    const page = REVERSE_PAGE_NAMES[locale][pathname]
    return page ? `${page}${suffix}` : path
  }
  const segments: string[] = [section]
  if (slug) segments.push(REVERSE_SLUGS[locale][slug] ?? slug)
  return `/${[...segments, ...rest].join('/')}${suffix}`
}
