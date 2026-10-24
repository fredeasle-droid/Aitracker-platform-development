import { SCRAPER_HEADERS, decodeHtml, displayBookmaker, displaySport, normalizeLegLabel, type ScrapedSurebet } from './types'

const SOURCE_URL = 'https://www.sure-bets.today/sure-bets'

type SourceLeg = { bet?: string; odds?: number; bookmaker?: string }

function pick(block: string, pattern: RegExp) {
  return block.match(pattern)?.[1] ?? ''
}

function minutesUntil(label: string) {
  const days = Number(label.match(/(\d+)\s*d/i)?.[1] ?? 0)
  const hours = Number(label.match(/(\d+)\s*h/i)?.[1] ?? 0)
  const minutes = Number(label.match(/(\d+)\s*m/i)?.[1] ?? 0)
  const total = days * 1440 + hours * 60 + minutes
  return /\d/.test(label) ? total : null
}

function parseCards(html: string): ScrapedSurebet[] {
  const sourceOdds = new Map<string, SourceLeg[]>()
  for (const match of html.matchAll(/"teams":("(?:[^"\\]|\\.)*"),"league":"(?:[^"\\]|\\.)*","betType":("(?:[^"\\]|\\.)*"),"odds":(\[[\s\S]*?\]),"profit"/gi)) {
    try {
      const teams = (JSON.parse(match[1]) as string).replace(/\s*[—–-]\s*/, '|').toLowerCase()
      const betType = (JSON.parse(match[2]) as string).trim().toLowerCase()
      sourceOdds.set(`${teams}|${betType}`, JSON.parse(match[3]) as SourceLeg[])
    } catch {
      continue
    }
  }
  const blocks = html
    .split(/<div\s+class=["']sb-bet["'][^>]*>/i)
    .slice(1)
    .map((part) => part.split(/<div\s+class=["']sb-bet["'][^>]*>/i)[0])
  const now = Date.now()
  const rows: ScrapedSurebet[] = []

  blocks.forEach((block) => {
    const metaParts = [...pick(block, /class=["']sb-bet-meta["'][^>]*>([\s\S]*?)<\/div>/i).matchAll(/<span>([^<]+)<\/span>/g)]
      .map((part) => decodeHtml(part[1]))
      .filter((part) => part && part !== '·')
    const teamHtml = pick(block, /class=["']sb-bet-teams["'][^>]*>([\s\S]*?)<\/div>/i)
    const teams = decodeHtml(teamHtml.replace(/<span[^>]*class=["']sb-vs["'][^>]*>[\s\S]*?<\/span>/gi, ' | ')).split('|').map((team) => team.trim())
    const market = decodeHtml(pick(block, /class=["']sb-bet-market["'][^>]*>([\s\S]*?)<\/div>/i)).replace(/\s*·\s*\d+\s+legs?\s+across\s+\d+\s+books?/i, '').trim()
    const profit = Number(decodeHtml(pick(block, /class=["']sb-pct["'][^>]*>([\s\S]*?)<\/div>/i)).replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0])
    const minutes = minutesUntil(decodeHtml(pick(block, /class=["']sb-bet-time["'][^>]*>([\s\S]*?)<\/div>/i)).replace(/^Begins in\s*/i, ''))
    const sourceLegs = sourceOdds.get(`${teams[0]}|${teams[1]}|${market}`.toLowerCase()) ?? []
    const legs = sourceLegs
      .map((leg, legIndex) => ({
        label: leg.bet ? normalizeLegLabel(leg.bet, market, sourceLegs.length) : `Udfald ${legIndex + 1}`,
        bookmaker: displayBookmaker(leg.bookmaker ?? ''),
        odds: Number(leg.odds),
      }))
      .filter((leg) => leg.odds > 1)
    if (teams.length !== 2 || !teams[0] || !teams[1] || !profit || !market || minutes === null || legs.length < 2) return

    rows.push({
      source: 'surebets-today',
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: metaParts[1] || 'Ukendt liga',
      sport: displaySport(metaParts[2] ?? ''),
      market,
      kickoff: new Date(now + minutes * 60000),
      profit,
      legs,
    })
  })
  return rows
}

export async function scrapeSureBetsToday() {
  const response = await fetch(SOURCE_URL, { headers: { ...SCRAPER_HEADERS, Accept: 'text/html' }, cache: 'no-store', signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`sure-bets.today svarede ${response.status}`)
  return parseCards(await response.text())
}
