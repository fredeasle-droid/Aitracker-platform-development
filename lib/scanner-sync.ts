import 'server-only'
import { after } from 'next/server'
import { inArray, max } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { scrapeAll } from '@/lib/scrapers'
import { displayLeague, surebetIdentity } from '@/lib/scrapers/types'
import { marginPercent } from '@/lib/odds'
import { MAX_STORED_OPPORTUNITIES } from '@/lib/limits'

const opportunityKey = (row: typeof opportunities.$inferSelect) => surebetIdentity({
  homeTeam: row.homeTeam,
  awayTeam: row.awayTeam,
  market: row.market,
  player: row.player,
  kickoff: row.kickoff,
  legs: [
    { label: row.aLabel, bookmaker: row.aBookmaker, odds: Number(row.aOdds) },
    { label: row.bLabel, bookmaker: row.bBookmaker, odds: Number(row.bOdds) },
  ],
})

const MAX_PER_MATCH = 3

const normalizeTeam = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9æøå]+/)
    .filter(Boolean)
    .sort()
    .join(' ')

const matchKey = (item: { homeTeam: string; awayTeam: string; kickoff: Date | string | null }) => {
  const day = item.kickoff ? new Date(item.kickoff).toISOString().slice(0, 10) : ''
  return `${normalizeTeam(item.homeTeam)}|${normalizeTeam(item.awayTeam)}|${day}`
}

const MIN_REFRESH_INTERVAL_MS = 20_000

async function refreshedRecently() {
  const [latest] = await db.select({ at: max(opportunities.updatedAt) }).from(opportunities)
  return latest?.at ? Date.now() - new Date(latest.at).getTime() < MIN_REFRESH_INTERVAL_MS : false
}

async function runRefresh() {
  if (await refreshedRecently()) return { ok: true as const, skipped: true as const, count: 0 }

  const { items: scraped, reports } = await scrapeAll()
  if (scraped.length === 0) return { ok: false as const, count: 0, reports }

  const perMatch = new Map<string, number>()
  const items = [...scraped]
    .sort((x, y) => marginPercent(y.legs[0].odds, y.legs[1].odds) - marginPercent(x.legs[0].odds, x.legs[1].odds))
    .filter((item) => {
      const key = matchKey(item)
      const count = perMatch.get(key) ?? 0
      if (count >= MAX_PER_MATCH) return false
      perMatch.set(key, count + 1)
      return true
    })
    .slice(0, MAX_STORED_OPPORTUNITIES)

  const stats = await db.transaction(async (tx) => {
    const existing = await tx.select().from(opportunities)
    const byKey = new Map(existing.map((row) => [opportunityKey(row), row]))
    const seen = new Set<number>()
    let inserted = 0
    let updated = 0

    for (const item of items) {
      const [a, b] = item.legs
      const values = {
        sport: item.sport,
        country: 'International',
        countryCode: '',
        league: displayLeague(item.league, item.sport),
        homeTeam: item.homeTeam,
        awayTeam: item.awayTeam,
        market: item.market,
        player: item.player ?? null,
        kickoff: item.kickoff,
        aLabel: a.label,
        aBookmaker: a.bookmaker,
        aOdds: a.odds.toFixed(2),
        bLabel: b.label,
        bBookmaker: b.bookmaker,
        bOdds: b.odds.toFixed(2),
      }
      const match = byKey.get(surebetIdentity(item))
      if (match) {
        seen.add(match.id)
        await tx.update(opportunities).set({ ...values, updatedAt: new Date() }).where(inArray(opportunities.id, [match.id]))
        updated++
      } else {
        await tx.insert(opportunities).values(values)
        inserted++
      }
    }

    const stale = existing.filter((row) => !seen.has(row.id)).map((row) => row.id)
    if (stale.length > 0) await tx.delete(opportunities).where(inArray(opportunities.id, stale))
    return { inserted, updated, removed: stale.length }
  })

  return { ok: true as const, count: items.length, ...stats, reports }
}

let inFlight: ReturnType<typeof runRefresh> | null = null

export function refreshOpportunities() {
  if (process.env.VERCEL_ENV === 'preview') {
    return Promise.resolve({ ok: true as const, skipped: true as const, count: 0 })
  }
  if (!inFlight) inFlight = runRefresh().finally(() => { inFlight = null })
  return inFlight
}

const STALE_AFTER_MS = 60_000
const RETRY_AFTER_MS = 30_000
let lastVisitAttempt = 0

export function scheduleStaleRefresh(latestUpdateMs: number | null) {
  const now = Date.now()
  if (latestUpdateMs !== null && now - latestUpdateMs < STALE_AFTER_MS) return
  if (now - lastVisitAttempt < RETRY_AFTER_MS) return
  lastVisitAttempt = now
  try {
    after(async () => {
      try {
        await refreshOpportunities()
      } catch (error) {
        console.error('[scanner] background refresh failed', error)
      }
    })
  } catch (error) {
    console.error('[scanner] could not schedule background refresh', error)
  }
}
