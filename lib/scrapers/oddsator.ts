import { SCRAPER_HEADERS, displayBookmaker, displaySport, type ScrapedSurebet } from './types'

const SOURCE_URL = 'https://www.oddsator.com/api/arbitrage?limit=150'
const SIDE_LABELS: Record<string, string> = { home: '1', draw: 'X', away: '2' }

type OddsatorItem = {
  sport?: string
  home_team?: string
  away_team?: string
  start_time?: string
  best_pair?: Record<string, string | number>
}

export async function scrapeOddsator(): Promise<ScrapedSurebet[]> {
  const response = await fetch(SOURCE_URL, { headers: { ...SCRAPER_HEADERS, Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`Oddsator svarede ${response.status}`)
  const data = (await response.json()) as { items?: OddsatorItem[] }
  const rows: ScrapedSurebet[] = []

  for (const item of data.items ?? []) {
    const pair = item.best_pair ?? {}
    const legs = Object.keys(pair)
      .filter((key) => key.endsWith('_book'))
      .map((key) => {
        const side = key.replace('_book', '')
        return { label: SIDE_LABELS[side] ?? side, bookmaker: displayBookmaker(String(pair[key])), odds: Number(pair[`${side}_odds`]) }
      })
      .filter((leg) => leg.odds > 1)
    const profit = Number((Number(pair.edge) * 100).toFixed(2))
    const kickoff = new Date(item.start_time ?? '')
    if (!item.home_team || !item.away_team || legs.length < 2 || !(profit > 0) || Number.isNaN(kickoff.getTime())) continue

    rows.push({
      source: 'oddsator',
      homeTeam: item.home_team,
      awayTeam: item.away_team,
      league: displaySport(item.sport ?? ''),
      sport: displaySport(item.sport ?? ''),
      market: legs.length === 3 ? '1X2' : '2-way',
      kickoff,
      profit,
      legs,
    })
  }
  return rows
}
