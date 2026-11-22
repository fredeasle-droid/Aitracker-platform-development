import 'server-only'
import { getOpportunities, type Opportunity } from '@/lib/data'
import { displaySport } from '@/lib/scrapers/types'
import type { BookmakerCategory, BookmakerInfo, LegAlternative, Surebet } from '@/components/sb/data'

export type SbSport = { label: string; count: number }

export type SbData = {
  surebets: Surebet[]
  bookmakers: BookmakerInfo[]
  sports: SbSport[]
  /** Seconds since the newest find was stored; null when there are no finds. */
  lastScanSec: number | null
  /** Margins (oldest first) used for the small trend line. */
  trend: number[]
}

const EXCHANGES = new Set(['smarkets', 'matchbook', 'betdaq'])
const CRYPTO = new Set(['1xbet', 'cloudbet', 'bitcasino', 'sportsbet.io', 'thunderpick'])

/** Bookmakers always offered in the filter and shown as local, whether or not the scanner has found a surebet at them. */
const LOCAL_BOOKMAKERS: { id: string; name: string }[] = [
  { id: 'bet365', name: 'Bet365' },
  { id: 'danskespil', name: 'Danske Spil' },
  { id: 'betano', name: 'Betano' },
  { id: 'betfair', name: 'Betfair' },
  { id: 'betinia', name: 'Betinia' },
  { id: 'campobet', name: 'CampoBet' },
  { id: 'betsson', name: 'Betsson' },
  { id: 'nordicbet', name: 'NordicBet' },
  { id: 'unibet', name: 'Unibet' },
  { id: '888sport', name: '888sport' },
  { id: 'bwin', name: 'Bwin' },
  { id: 'comeon', name: 'ComeOn' },
  { id: 'bet25', name: 'Bet25' },
  { id: 'betmaster', name: 'Betmaster' },
  { id: 'expekt', name: 'Expekt' },
  { id: 'leovegas', name: 'LeoVegas' },
  { id: 'marathonbet', name: 'Marathonbet' },
  { id: 'mrgreen', name: 'Mr Green' },
  { id: 'pokerstars', name: 'PokerStars Sports' },
  { id: 'tipwin', name: 'Tipwin' },
  { id: 'stake', name: 'Stake' },
  { id: 'getlucky', name: 'GetLucky' },
  { id: 'swiper', name: 'Swiper' },
  { id: 'vbet', name: 'Vbet' },
]

const LOCAL_IDS = new Set(LOCAL_BOOKMAKERS.map((b) => b.id))

/** The same bookmaker under another name in the scans. */
const ALIASES: Record<string, string> = { oddset: 'danskespil', pokerstarssports: 'pokerstars' }

const rawKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

export const bookmakerKey = (name: string) => {
  const key = rawKey(name)
  return ALIASES[key] ?? key
}

/** Button text from the source site that older scans stored as a bookmaker name, e.g. "Open Calculator". */
const NOT_A_BOOKMAKER = /calculator|betslip|bet tracker|\bopen\b|\bclick\b|\bshare\b|\bcopy\b/i

const hasRealBookmakers = (o: Opportunity) =>
  [o.a.bookmaker, o.b.bookmaker].every((name) => bookmakerKey(name).length > 1 && !NOT_A_BOOKMAKER.test(name))

const MAX_ALTERNATIVES_PER_LEG = 2

const marketKey = (o: Opportunity) =>
  [o.homeTeam, o.awayTeam, o.league, o.kickoffLabel, o.market, o.player ?? '', [o.a.label, o.b.label].sort().join('/')]
    .join('|')
    .toLowerCase()

type Group = { primary: Opportunity; alternatives: LegAlternative[] }

/**
 * Scans store the same market several times with different bookmaker pairs. Keep the pair with the best
 * margin as the card, and list the other bookmakers offering each pick as alternatives.
 */
function groupOpportunities(list: Opportunity[]): Group[] {
  const byMarket = new Map<string, Group>()

  for (const o of [...list].sort((x, y) => y.margin - x.margin)) {
    const key = marketKey(o)
    const group = byMarket.get(key)
    if (!group) {
      byMarket.set(key, { primary: o, alternatives: [] })
      continue
    }

    const primaryLegs = [group.primary.a, group.primary.b]
    for (const leg of [o.a, o.b]) {
      const index = primaryLegs.findIndex((p) => p.label === leg.label)
      if (index === -1) continue
      const bookmaker = bookmakerKey(leg.bookmaker)
      const sameLeg = group.alternatives.filter((a) => a.leg === index)
      const known = bookmaker === bookmakerKey(primaryLegs[index].bookmaker) || sameLeg.some((a) => a.bookmaker === bookmaker)
      if (!known && sameLeg.length < MAX_ALTERNATIVES_PER_LEG) {
        group.alternatives.push({ leg: index as 0 | 1, bookmaker, odds: leg.odds })
      }
    }
  }

  return [...byMarket.values()]
}

function categoryOf(key: string): BookmakerCategory {
  if (LOCAL_IDS.has(key)) return 'local'
  if (EXCHANGES.has(key)) return 'exchange'
  if (CRYPTO.has(key)) return 'crypto'
  return 'local'
}

function leagueShort(league: string) {
  const words = league.split(/\s+/).filter(Boolean)
  if (words.length > 1) return words.slice(0, 3).map((w) => w[0]!).join('').toUpperCase()
  return league.slice(0, 3).toUpperCase()
}

function foundAgo(createdTs: number, now: number) {
  const sec = Math.max(1, Math.floor((now - createdTs) / 1000))
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.floor(sec / 60)}m`
  if (sec < 86400) return `${Math.floor(sec / 3600)}t`
  return `${Math.floor(sec / 86400)}d`
}

function accentFor(margin: number): Surebet['accent'] {
  if (margin >= 3) return 'success'
  if (margin >= 2) return 'warning'
  if (margin >= 1) return 'primary'
  return 'violet'
}

function toSurebet({ primary: o, alternatives }: Group, now: number): Surebet {
  return {
    alternatives,
    id: o.id,
    sport: displaySport(o.sport),
    home: { name: o.homeTeam, crest: o.homeLogo ?? null },
    away: { name: o.awayTeam, crest: o.awayLogo ?? null },
    league: o.league,
    leagueShort: leagueShort(o.league),
    foundAgo: foundAgo(o.createdTs, now),
    time: o.kickoffLabel,
    market: o.player ? `${o.player} · ${o.market}` : o.market,
    legs: [
      { bookmaker: bookmakerKey(o.a.bookmaker), pick: o.a.label, odds: o.a.odds },
      { bookmaker: bookmakerKey(o.b.bookmaker), pick: o.b.label, odds: o.b.odds },
    ],
    accent: accentFor(o.margin),
    favorite: o.favorite,
  }
}

export async function getSbData(): Promise<SbData> {
  const all = (await getOpportunities()).filter(hasRealBookmakers)
  const now = Date.now()
  const fresh = [...all].sort((a, b) => b.createdTs - a.createdTs)
  const groups = groupOpportunities(all).sort((a, b) => b.primary.createdTs - a.primary.createdTs)

  const names = new Map<string, string>(LOCAL_BOOKMAKERS.map((b) => [b.id, b.name]))
  for (const o of all) {
    for (const raw of [o.a.bookmaker, o.b.bookmaker]) {
      const key = bookmakerKey(raw)
      if (key && !names.has(key)) names.set(key, raw)
    }
  }
  const bookmakers = [...names.entries()]
    .map(([id, name]) => ({ id, name, category: categoryOf(id) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'da'))

  const sportCounts = new Map<string, number>()
  for (const o of all) {
    const label = displaySport(o.sport)
    sportCounts.set(label, (sportCounts.get(label) ?? 0) + 1)
  }
  const sports = [...sportCounts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)

  return {
    surebets: groups.map((g) => toSurebet(g, now)),
    bookmakers,
    sports,
    lastScanSec: fresh[0] ? Math.max(1, Math.floor((now - fresh[0].createdTs) / 1000)) : null,
    trend: fresh.slice(0, 12).reverse().map((o) => o.margin),
  }
}
