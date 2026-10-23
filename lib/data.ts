import 'server-only'
import { cache } from 'react'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { bets, favorites, opportunities } from '@/lib/db/schema'
import { getOptionalUserId, getUserId } from '@/lib/user'
import { marginPercent } from '@/lib/odds'
import { formatKickoff, formatShortDate } from '@/lib/dates'
import { demoOpportunities, isDemoMode } from '@/lib/demo-opportunities'
import { getDemoBets } from '@/lib/demo-bets'
import { getLogoMap, logoKey, scheduleLogoRefresh } from '@/lib/team-logos'

export type Opportunity = {
  id: number
  sport: string
  country: string
  countryCode: string
  league: string
  homeTeam: string
  awayTeam: string
  homeLogo?: string | null
  awayLogo?: string | null
  market: string
  kickoffLabel: string
  kickoffTs: number
  createdTs: number
  a: { label: string; bookmaker: string; odds: number }
  b: { label: string; bookmaker: string; odds: number }
  margin: number
  favorite: boolean
  isDemo?: boolean
}

export type BetRow = {
  id: number
  sport: string
  match: string
  market: string
  stake: number
  expectedProfit: number
  profit: number | null
  status: 'open' | 'won' | 'lost'
  kickoffLabel: string
  dateLabel: string
  placedTs: number
}

function toOpportunity(row: typeof opportunities.$inferSelect, favIds: Set<number>, now: Date, logos: Map<string, string>): Opportunity {
  const aOdds = Number(row.aOdds)
  const bOdds = Number(row.bOdds)
  return {
    id: row.id,
    sport: row.sport,
    country: row.country,
    countryCode: row.countryCode,
    league: row.league,
    homeTeam: row.homeTeam,
    awayTeam: row.awayTeam,
    homeLogo: logos.get(logoKey(row.sport, row.homeTeam)) ?? null,
    awayLogo: logos.get(logoKey(row.sport, row.awayTeam)) ?? null,
    market: row.market,
    kickoffLabel: formatKickoff(row.kickoff, now),
    kickoffTs: row.kickoff.getTime(),
    createdTs: row.createdAt.getTime(),
    a: { label: row.aLabel, bookmaker: row.aBookmaker, odds: aOdds },
    b: { label: row.bLabel, bookmaker: row.bBookmaker, odds: bOdds },
    margin: marginPercent(aOdds, bOdds),
    favorite: favIds.has(row.id),
  }
}

async function getFavoriteIds(userId: string) {
  const favs = await db
    .select({ id: favorites.opportunityId })
    .from(favorites)
    .where(eq(favorites.userId, userId))
  return new Set(favs.map((f) => f.id))
}

export const getOpportunities = cache(async () => {
  const userId = await getOptionalUserId()
  if (isDemoMode()) {
    try {
      const favIds = userId ? await getFavoriteIds(userId) : new Set<number>()
      return demoOpportunities.map((opportunity) => ({
        ...opportunity,
        favorite: favIds.has(opportunity.id),
      }))
    } catch (error) {
      console.error('[data] demo favorites unavailable', error)
      return demoOpportunities
    }
  }

  try {
    let rows = await db.select().from(opportunities).orderBy(desc(opportunities.createdAt))
    if (rows.length === 0) {
      const { refreshOpportunities } = await import('@/lib/scanner-sync')
      const refreshed = await refreshOpportunities()
      if (refreshed.ok) rows = await db.select().from(opportunities).orderBy(desc(opportunities.createdAt))
    } else {
      const { scheduleStaleRefresh } = await import('@/lib/scanner-sync')
      scheduleStaleRefresh(Math.max(...rows.map((r) => r.updatedAt.getTime())))
    }
    let favIds = new Set<number>()
    if (userId) {
      try {
        favIds = await getFavoriteIds(userId)
      } catch (error) {
        console.error('[data] favorites unavailable; continuing with opportunities', error)
      }
    }
    let logos = new Map<string, string>()
    try {
      logos = await getLogoMap()
      scheduleLogoRefresh()
    } catch (error) {
      console.error('[data] team logos unavailable; continuing without them', error)
    }
    const now = new Date()
    return rows.map((r) => toOpportunity(r, favIds, now, logos))
  } catch (error) {
    console.error('[data] opportunities unavailable', error)
    return []
  }
})

export const OPPORTUNITY_PAGE_SIZE = 30

export async function getOpportunityPage(offset = 0, limit = OPPORTUNITY_PAGE_SIZE) {
  const all = await getOpportunities()
  const ranked = [...all].sort((a, b) => b.margin - a.margin || a.id - b.id)
  return { items: ranked.slice(offset, offset + limit), total: ranked.length }
}

export async function getOpportunity(id?: number) {
  const all = await getOpportunities()
  if (id) {
    const match = all.find((o) => o.id === id)
    if (match) return match
  }
  return [...all].sort((x, y) => y.margin - x.margin)[0] ?? null
}

export async function getBets(): Promise<BetRow[]> {
  const userId = await getOptionalUserId()
  if (!userId) return []
  try {
    const rows = await db
      .select()
      .from(bets)
      .where(eq(bets.userId, userId))
      .orderBy(desc(bets.kickoff))
    const now = new Date()
    return rows.map((r) => ({
    id: r.id,
    sport: r.sport,
    match: r.match,
    market: r.market,
    stake: Number(r.stake),
    expectedProfit: Number(r.expectedProfit),
    profit: r.profit === null ? null : Number(r.profit),
    status: r.status as BetRow['status'],
    kickoffLabel: formatKickoff(r.kickoff, now),
    dateLabel: formatShortDate(r.kickoff),
      placedTs: (r.settledAt ?? r.kickoff).getTime(),
    }))
  } catch (error) {
    if (!process.env.ODDS_API_KEY && process.env.VERCEL_ENV !== 'production') {
      return getDemoBets(userId)
    }
    console.error('[data] bets unavailable', error)
    return []
  }
}

export async function getBetForUser(id: number, userId: string) {
  const [row] = await db
    .select()
    .from(bets)
    .where(and(eq(bets.id, id), eq(bets.userId, userId)))
    .limit(1)
  return row ?? null
}
