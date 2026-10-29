import 'server-only'
import { getBetHeroMessages } from '@/lib/bethero-ingest'
import { displaySport, splitTeams, type ScrapedLeg, type ScrapedSurebet } from './types'

type BetHeroBook = { name?: string }
type BetHeroRow = {
  parent_id?: string
  event?: string
  league?: string
  sport?: string
  live?: boolean
  start?: number
  timestamp?: number
  profit?: number
  market_1?: string
  market_2?: string
  bet_name_1?: string
  bet_name_short_1?: string
  bet_name_short_2?: string
  adjusted_odds_1?: number
  adjusted_odds_2?: number
  odds_1?: number
  odds_2?: number
  books_1?: BetHeroBook[]
  books_2?: BetHeroBook[]
}

const baseName = (name: string) => name.replace(/\s*\(.*?\)\s*$/, '').trim()

// Bet Hero lists every bookmaker sharing the same odds feed (1xBet clones etc.) in arbitrary order.
// Only the bookmakers the user has selected in Bet Hero may be picked, so the shared list is filtered
// down to this whitelist (normalized names, regional suffix like "(DK)" ignored).
const ALLOWED_BOOKS = new Set([
  'bwin',
  'unibet',
  'leovegas',
  '888sport',
  'mrgreen',
  'betinia',
  'campobet',
  'oddset',
  'betsson',
  'nordicbet',
  'betfairexchange',
  'betfair',
  'bet365',
  'marathonbet',
  'dbbet',
  'rainbet',
  'mystake',
  '20bet',
  'vave',
  'wildio',
  'cloudbet',
  'shuffle',
  'sportsbetio',
])

const normalizeBook = (name: string) => baseName(name).toLowerCase().replace(/[^a-z0-9]/g, '')

function pickAllowedBook(books: BetHeroBook[] | undefined) {
  const names = (books ?? [])
    .map((book) => book.name)
    .filter((name): name is string => Boolean(name))
    .filter((name) => ALLOWED_BOOKS.has(normalizeBook(name)))
  const chosen = names.find((name) => /\(DK\)$/i.test(name)) ?? names[0]
  return chosen ? baseName(chosen) : null
}

function collectRows(value: unknown, rows: BetHeroRow[]) {
  if (Array.isArray(value)) {
    for (const item of value) collectRows(item, rows)
  } else if (value && typeof value === 'object') {
    const candidate = value as BetHeroRow
    if (typeof candidate.event === 'string' && candidate.books_1) rows.push(candidate)
    else for (const inner of Object.values(value)) collectRows(inner, rows)
  }
}

function parseRow(row: BetHeroRow, now: number): ScrapedSurebet | null {
  if (row.live || !row.start) return null
  const kickoff = new Date(row.start * 1000)
  if (kickoff.getTime() < now) return null

  const teams = splitTeams(row.event ?? '')
  const profit = Number(row.profit)
  const oddsA = Number(row.adjusted_odds_1 ?? row.odds_1)
  const oddsB = Number(row.adjusted_odds_2 ?? row.odds_2)
  if (!teams || !(profit > 0) || !(oddsA > 1) || !(oddsB > 1)) return null

  const bookA = pickAllowedBook(row.books_1)
  const bookB = pickAllowedBook(row.books_2)
  if (!bookA || !bookB || bookA === bookB) return null

  const line = row.bet_name_1?.match(/([+-]?\d+(?:\.\d+)?)\s*$/)?.[1]
  const baseMarket = row.market_1 || row.market_2 || 'Marked'
  const market = line ? `${baseMarket} ${Math.abs(Number(line))}` : baseMarket
  const legs: ScrapedLeg[] = [
    { label: row.bet_name_short_1 || 'Udfald 1', bookmaker: bookA, odds: oddsA },
    { label: row.bet_name_short_2 || 'Udfald 2', bookmaker: bookB, odds: oddsB },
  ]

  return {
    source: 'bethero',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: row.league || 'Ukendt liga',
    sport: displaySport(row.sport ?? ''),
    market,
    kickoff,
    profit,
    legs,
  }
}

export async function scrapeBetHero() {
  const messages = await getBetHeroMessages()
  if (messages.length === 0) throw new Error('Ingen Bet Hero-data gemt endnu')

  const rows: BetHeroRow[] = []
  collectRows(messages, rows)

  const latest = new Map<string, BetHeroRow>()
  for (const row of rows) {
    const key = row.parent_id ?? `${row.event}|${row.market_1}|${row.bet_name_1}`
    const current = latest.get(key)
    if (!current || Number(row.profit ?? 0) > Number(current.profit ?? 0)) latest.set(key, row)
  }

  const now = Date.now()
  return [...latest.values()].map((row) => parseRow(row, now)).filter((item): item is ScrapedSurebet => item !== null)
}
