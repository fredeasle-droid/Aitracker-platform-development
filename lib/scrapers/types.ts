export type ScrapedLeg = { label: string; bookmaker: string; odds: number }

export type ScrapedSurebet = {
  source: 'betmonitor' | 'surebets-today' | 'oddsator'
  homeTeam: string
  awayTeam: string
  league: string
  sport: string
  market: string
  kickoff: Date
  profit: number
  legs: ScrapedLeg[]
}

export const SCRAPER_HEADERS = { 'User-Agent': 'Mozilla/5.0 SureScan/1.0' }

export function decodeHtml(value = '') {
  return value
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&middot;|&#183;/gi, '·')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function splitTeams(match: string): [string, string] | null {
  const parts = match.split(/\s+(?:vs\.?|—|–|-)\s+/i).map((part) => part.trim()).filter(Boolean)
  return parts.length === 2 ? [parts[0], parts[1]] : null
}

export function displaySport(value: string) {
  const sport = value.toLowerCase()
  if (sport.includes('american')) return 'American football'
  if (sport.includes('soccer') || sport === 'football' || sport.includes('fodbold')) return 'Fodbold'
  if (sport.includes('basket')) return 'Basketball'
  if (sport.includes('tennis')) return 'Tennis'
  if (sport.includes('hockey')) return 'Ishockey'
  if (sport.includes('handball')) return 'Håndbold'
  if (sport.includes('esport') || sport.includes('e-sport')) return 'Esport'
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Sport'
}

const TOTALS_MARKET = /^(corners?|cards?|bookings?|shots?|o\/u|over\/under|total)\b/i
const SIMPLE_LABELS: Record<string, string> = { o: 'Over', u: 'Under', y: 'Ja', n: 'Nej', x: 'X' }

export function normalizeLegLabel(raw: string, market: string, legCount: number) {
  const value = raw.trim().toLowerCase()
  if (SIMPLE_LABELS[value]) return SIMPLE_LABELS[value]
  const isTotalsMarket = TOTALS_MARKET.test(market.trim()) && /\d/.test(market) && !/handicap/i.test(market)
  if (isTotalsMarket && legCount === 2) {
    if (value === '1') return 'Over'
    if (value === '2') return 'Under'
  }
  return raw.trim()
}

export function displayBookmaker(name: string) {
  const clean = name.trim()
  if (!clean) return 'Ukendt'
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}
