import { guaranteedProfit, marginPercent } from '@/lib/odds'

export type ScannerOpportunity = {
  sport: string
  country: string
  countryCode: string
  league: string
  homeTeam: string
  awayTeam: string
  market: string
  kickoff: Date
  aLabel: string
  aBookmaker: string
  aOdds: string
  bLabel: string
  bBookmaker: string
  bOdds: string
}

type SportsGameOddsEvent = {
  eventID?: string
  id?: string
  sportID?: string
  sportName?: string
  leagueName?: string
  homeTeam?: string
  awayTeam?: string
  startTime?: string
  commenceTime?: string
  odds?: Record<string, { byBookmaker?: Record<string, unknown> }>
}

const API_URL = 'https://api.sportsgameodds.com/v2/events'

async function getJson<T>(url: string, key: string): Promise<T> {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}apiKey=${encodeURIComponent(key)}`, {
    next: { revalidate: 30 },
  })
  if (!response.ok) throw new Error(`SportsGameOdds returned ${response.status}`)
  return response.json() as Promise<T>
}

function firstNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  if (value && typeof value === 'object') {
    for (const key of ['odds', 'price', 'decimal', 'value']) {
      const number = firstNumber((value as Record<string, unknown>)[key])
      if (Number.isFinite(number)) return number
    }
  }
  return Number.NaN
}

function displaySport(event: SportsGameOddsEvent) {
  const value = `${event.sportName ?? ''} ${event.sportID ?? ''}`.toLowerCase()
  if (value.includes('basket')) return 'Basketball'
  if (value.includes('tennis')) return 'Tennis'
  if (value.includes('hockey')) return 'Ishockey'
  if (value.includes('handball')) return 'Håndbold'
  return 'Fodbold'
}

export function scannerStatus() {
  return { configured: Boolean(process.env.SPORTSGAMEODDS_API_KEY), provider: 'SportsGameOdds' }
}

export async function scanLiveOpportunities(): Promise<ScannerOpportunity[]> {
  const key = process.env.SPORTSGAMEODDS_API_KEY
  if (!key) return []
  const payload = await getJson<SportsGameOddsEvent[] | { data?: SportsGameOddsEvent[] }>(`${API_URL}?oddsAvailable=true&limit=100`, key)
  const events = Array.isArray(payload) ? payload : payload.data ?? []
  const opportunities: ScannerOpportunity[] = []

  for (const event of events) {
    const best = new Map<string, { bookmaker: string; price: number }>()
    for (const [oddId, odd] of Object.entries(event.odds ?? {})) {
      for (const [bookmaker, raw] of Object.entries(odd.byBookmaker ?? {})) {
        const price = firstNumber(raw)
        if (Number.isFinite(price) && price > 1) {
          const label = oddId.toLowerCase().includes('away') ? event.awayTeam : oddId.toLowerCase().includes('home') ? event.homeTeam : oddId
          if (label && (!best.has(label) || price > best.get(label)!.price)) best.set(label, { bookmaker, price })
        }
      }
    }
    const home = event.homeTeam ? best.get(event.homeTeam) : undefined
    const away = event.awayTeam ? best.get(event.awayTeam) : undefined
    if (!home || !away) continue
    const margin = marginPercent(home.price, away.price)
    if (margin <= 0) continue
    opportunities.push({
      sport: displaySport(event), country: 'International', countryCode: '',
      league: event.leagueName ?? event.sportName ?? 'Live', homeTeam: event.homeTeam!, awayTeam: event.awayTeam!,
      market: '2-way result', kickoff: new Date(event.startTime ?? event.commenceTime ?? Date.now()),
      aLabel: event.homeTeam!, aBookmaker: home.bookmaker, aOdds: home.price.toFixed(2),
      bLabel: event.awayTeam!, bBookmaker: away.bookmaker, bOdds: away.price.toFixed(2),
    })
  }
  return opportunities
}

export { guaranteedProfit }
