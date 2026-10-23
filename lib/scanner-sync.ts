import 'server-only'
import { after } from 'next/server'
import { inArray, max } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { scrapeAll } from '@/lib/scrapers'
import { marginPercent } from '@/lib/odds'
import { MAX_OPPORTUNITIES } from '@/lib/limits'

const rowKey = (home: string, away: string, market: string) => `${home}|${away}|${market}`.toLowerCase()

const MIN_REFRESH_INTERVAL_MS = 45_000

async function refreshedRecently() {
  const [latest] = await db.select({ at: max(opportunities.updatedAt) }).from(opportunities)
  return latest?.at ? Date.now() - new Date(latest.at).getTime() < MIN_REFRESH_INTERVAL_MS : false
}

async function runRefresh() {
  if (await refreshedRecently()) return { ok: true as const, skipped: true as const, count: 0 }

  const { items: scraped, reports } = await scrapeAll()
  if (scraped.length === 0) return { ok: false as const, count: 0, reports }

  const items = [...scraped]
    .sort((x, y) => marginPercent(y.legs[0].odds, y.legs[1].odds) - marginPercent(x.legs[0].odds, x.legs[1].odds))
    .slice(0, MAX_OPPORTUNITIES)

  const stats = await db.transaction(async (tx) => {
    const existing = await tx.select().from(opportunities)
    const byKey = new Map(existing.map((row) => [rowKey(row.homeTeam, row.awayTeam, row.market), row]))
    const seen = new Set<number>()
    let inserted = 0
    let updated = 0

    for (const item of items) {
      const [a, b] = item.legs
      const values = {
        sport: item.sport,
        country: 'International',
        countryCode: '',
        league: item.league,
        homeTeam: item.homeTeam,
        awayTeam: item.awayTeam,
        market: item.market,
        kickoff: item.kickoff,
        aLabel: a.label,
        aBookmaker: a.bookmaker,
        aOdds: a.odds.toFixed(2),
        bLabel: b.label,
        bBookmaker: b.bookmaker,
        bOdds: b.odds.toFixed(2),
      }
      const match = byKey.get(rowKey(item.homeTeam, item.awayTeam, item.market))
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
  if (!inFlight) inFlight = runRefresh().finally(() => { inFlight = null })
  return inFlight
}

const STALE_AFTER_MS = 2 * 60_000
const RETRY_AFTER_MS = 60_000
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
