import 'server-only'
import { getBetHeroMessages } from '@/lib/bethero-ingest'
import { isApprovedBookmaker, isLocalBookmaker } from '@/lib/local-bookmakers'
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

// Only bookmakers on the limited list may be picked; a side with none of them drops the whole surebet.
function pickBook(books: BetHeroBook[] | undefined) {
  const names = (books ?? []).map((book) => book.name).filter((name): name is string => Boolean(name))
  const allowed = names.filter(isApprovedBookmaker)
  const local = allowed.filter(isLocalBookmaker)
  const pool = local.length > 0 ? local : allowed
  const chosen = pool.find((name) => /\(DK\)$/i.test(name)) ?? pool[0]
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
  const kickoffTimestamp = row.start ?? row.timestamp
  if (row.live || !kickoffTimestamp) return null
  const kickoff = new Date(kickoffTimestamp * 1000)
  if (kickoff.getTime() < now) return null

  const teams = splitTeams(row.event ?? '')
  const profit = Number(row.profit)
  const oddsA = Number(row.adjusted_odds_1 ?? row.odds_1)
  const oddsB = Number(row.adjusted_odds_2 ?? row.odds_2)
  if (!teams || !(profit > 0) || !(oddsA > 1) || !(oddsB > 1)) return null

  const bookA = pickBook(row.books_1)
  const bookB = pickBook(row.books_2)
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

  const now = Date.now()
  const parsed = rows
    .map((row) => parseRow(row, now))
    .filter((item): item is ScrapedSurebet => item !== null)

  const latest = new Map<string, ScrapedSurebet>()
  for (const item of parsed) {
    const key = `${item.homeTeam}|${item.awayTeam}|${item.market}|${item.legs.map((leg) => `${leg.bookmaker}:${leg.label}`).join('|')}`
    const current = latest.get(key)
    if (!current || item.profit > current.profit) latest.set(key, item)
  }

  return [...latest.values()]
}
