import { SCRAPER_HEADERS, decodeHtml, displayBookmaker, displaySport, splitTeams, type ScrapedSurebet } from './types'

const SOURCE_URL = 'https://www.betmonitor.com/mobile/surebets/'
const LABELS: Record<string, string> = { O: 'Over', U: 'Under', '1': '1', '2': '2', X: 'X' }

function parseRows(html: string): ScrapedSurebet[] {
  const anchors = [...html.matchAll(/<a\b[^>]*class=["'][^"']*surebets-event[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)]
  const rows: ScrapedSurebet[] = []

  for (const anchor of anchors) {
    const markup = anchor[1]
    const profit = Number(markup.match(/event-profit[\s\S]*?<span[^>]*>\s*(\d+(?:\.\d+)?)\s*%/i)?.[1])
    const timestamp = Number(markup.match(/data-timestamp="(\d+)"/i)?.[1])
    const teams = splitTeams(decodeHtml(markup.match(/event-teams[^>]*>([^<]+)</i)?.[1]))
    const info = markup.match(/event-info[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    const market = markup.match(/event-bl[^>]*>([^<]+)</i)?.[1]
    if (!profit || !timestamp || !teams || !info || !market) continue

    const [sport, league] = decodeHtml(info).split('·').map((part) => part.trim())
    const legs = [...markup.matchAll(/data-name="([^"]+)"[^>]*>\s*(O|U|1|2|X)\s+[\s\S]*?class="odd-decimal[^>]*>\s*(\d+\.\d{2,})/gi)]
      .map((leg) => ({ label: LABELS[leg[2].toUpperCase()] ?? leg[2], bookmaker: displayBookmaker(leg[1]), odds: Number(leg[3]) }))
      .filter((leg) => leg.odds > 1)
      .slice(0, 3)
    if (legs.length < 2) continue

    rows.push({
      source: 'betmonitor',
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: league || 'Ukendt liga',
      sport: displaySport(sport ?? ''),
      market: decodeHtml(market),
      kickoff: new Date(timestamp * 1000),
      profit,
      legs,
    })
  }
  return rows
}

export async function scrapeBetMonitor() {
  const response = await fetch(SOURCE_URL, { headers: SCRAPER_HEADERS, cache: 'no-store', signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`BetMonitor svarede ${response.status}`)
  return parseRows(await response.text())
}
