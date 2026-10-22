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

type Sport = { key: string; title: string; group: string; country?: string }
type Outcome = { name: string; price: number }
type Market = { key: string; outcomes: Outcome[] }
type Bookmaker = { title: string; markets: Market[] }
type Event = {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Bookmaker[]
}

const API_URL = 'https://api.the-odds-api.com/v4'

async function getJson<T>(url: string, key: string): Promise<T> {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}apiKey=${encodeURIComponent(key)}`, {
    next: { revalidate: 30 },
  })
  if (!response.ok) throw new Error(`Odds provider returned ${response.status}`)
  return response.json() as Promise<T>
}

export function scannerStatus() {
  return { configured: Boolean(process.env.ODDS_API_KEY), provider: 'The Odds API' }
}

export async function scanLiveOpportunities(): Promise<ScannerOpportunity[]> {
  const key = process.env.ODDS_API_KEY
  if (!key) return []

  const sports = await getJson<Sport[]>(`${API_URL}/sports`, key)
  const events = (await Promise.all(
    sports.filter((sport) => sport.key && sport.group !== 'Outrights').map((sport) =>
      getJson<Event[]>(`${API_URL}/sports/${encodeURIComponent(sport.key)}/odds?regions=us,uk,eu,au&markets=h2h&oddsFormat=decimal`, key),
    ),
  )).flat()

  const seen = new Set<string>()
  const opportunities: ScannerOpportunity[] = []
  for (const event of events) {
    const best = new Map<string, { outcome: string; bookmaker: string; price: number }>()
    for (const bookmaker of event.bookmakers ?? []) {
      for (const market of bookmaker.markets ?? []) {
        if (market.key !== 'h2h') continue
        for (const outcome of market.outcomes ?? []) {
          if (!Number.isFinite(outcome.price) || outcome.price <= 1) continue
          const current = best.get(outcome.name)
          if (!current || outcome.price > current.price) best.set(outcome.name, { outcome: outcome.name, bookmaker: bookmaker.title, price: outcome.price })
        }
      }
    }
    const home = best.get(event.home_team)
    const away = best.get(event.away_team)
    if (!home || !away || best.size !== 2) continue
    const margin = marginPercent(home.price, away.price)
    if (margin <= 0) continue
    const signature = `${event.id}:${home.outcome}:${away.outcome}`
    if (seen.has(signature)) continue
    seen.add(signature)
    opportunities.push({
      sport: event.sport_title,
      country: sports.find((sport) => sport.key === event.sport_key)?.country ?? 'International',
      countryCode: '',
      league: event.sport_title,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      market: '2-way result',
      kickoff: new Date(event.commence_time),
      aLabel: event.home_team,
      aBookmaker: home.bookmaker,
      aOdds: home.price.toFixed(2),
      bLabel: event.away_team,
      bBookmaker: away.bookmaker,
      bOdds: away.price.toFixed(2),
    })
  }
  return opportunities
}

export { guaranteedProfit }
