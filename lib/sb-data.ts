import 'server-only'
import { getOpportunities, type Opportunity } from '@/lib/data'
import { displaySport } from '@/lib/scrapers/types'
import type { BookmakerCategory, BookmakerInfo, Surebet } from '@/components/sb/data'

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

const EXCHANGES = new Set(['betfair', 'smarkets', 'matchbook', 'betdaq'])
const CRYPTO = new Set(['1xbet', 'stake', 'cloudbet', 'bitcasino', 'sportsbet.io', 'thunderpick'])

export const bookmakerKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

function categoryOf(key: string): BookmakerCategory {
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

function toSurebet(o: Opportunity, now: number): Surebet {
  return {
    id: o.id,
    sport: displaySport(o.sport),
    home: { name: o.homeTeam, crest: o.homeLogo ?? null },
    away: { name: o.awayTeam, crest: o.awayLogo ?? null },
    league: o.league,
    leagueShort: leagueShort(o.league),
    foundAgo: foundAgo(o.createdTs, now),
    time: o.kickoffLabel,
    market: o.market,
    legs: [
      { bookmaker: bookmakerKey(o.a.bookmaker), pick: o.a.label, odds: o.a.odds },
      { bookmaker: bookmakerKey(o.b.bookmaker), pick: o.b.label, odds: o.b.odds },
    ],
    accent: accentFor(o.margin),
    favorite: o.favorite,
  }
}

export async function getSbData(): Promise<SbData> {
  const all = await getOpportunities()
  const now = Date.now()
  const fresh = [...all].sort((a, b) => b.createdTs - a.createdTs)

  const names = new Map<string, string>()
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
    surebets: fresh.map((o) => toSurebet(o, now)),
    bookmakers,
    sports,
    lastScanSec: fresh[0] ? Math.max(1, Math.floor((now - fresh[0].createdTs) / 1000)) : null,
    trend: fresh.slice(0, 12).reverse().map((o) => o.margin),
  }
}
