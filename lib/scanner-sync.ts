import 'server-only'
import { inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { scrapeAll } from '@/lib/scrapers'

const rowKey = (home: string, away: string, market: string) => `${home}|${away}|${market}`.toLowerCase()

export async function refreshOpportunities() {
  const { items, reports } = await scrapeAll()
  if (items.length === 0) return { ok: false as const, count: 0, reports }

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
