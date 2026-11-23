import 'server-only'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { seoMeta, seoQueryDaily, seoSiteDaily } from '@/lib/db/schema'
import { getSearchConsoleConfig, querySearchAnalytics } from './search-console'

const PAGE_SIZE = 25000
const MAX_PAGES = 4
const CHUNK = 500

const isoDate = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Copenhagen' }).format(date)
const daysAgo = (days: number) => isoDate(new Date(Date.now() - days * 86_400_000))

async function setMeta(key: string, value: string) {
  await db.insert(seoMeta).values({ key, value }).onConflictDoUpdate({ target: seoMeta.key, set: { value } })
}

export type SeoSyncResult = { ok: true; days: number; queries: number } | { ok: false; error: string }

export async function syncSearchConsole(): Promise<SeoSyncResult> {
  const config = getSearchConsoleConfig()
  if (!config) return { ok: false, error: 'Search Console er ikke forbundet endnu.' }

  try {
    const [{ count }] = (await db.execute(sql`select count(*)::int as count from seo_site_daily`)).rows as { count: number }[]
    // First run backfills 16 months of history; later runs refresh the last days, which Google keeps revising.
    const startDate = daysAgo(count === 0 ? 480 : 6)
    const endDate = daysAgo(0)

    const site = await querySearchAnalytics(config, { startDate, endDate, dimensions: ['date'] })
    const siteRows = site.rows.map((row) => ({ date: row.keys[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }))
    for (let i = 0; i < siteRows.length; i += CHUNK) {
      await db
        .insert(seoSiteDaily)
        .values(siteRows.slice(i, i + CHUNK))
        .onConflictDoUpdate({
          target: seoSiteDaily.date,
          set: { clicks: sql`excluded.clicks`, impressions: sql`excluded.impressions`, ctr: sql`excluded.ctr`, position: sql`excluded.position` },
        })
    }

    let queryCount = 0
    for (let page = 0; page < MAX_PAGES; page++) {
      const { rows } = await querySearchAnalytics(
        config,
        { startDate, endDate, dimensions: ['date', 'query'], rowLimit: PAGE_SIZE, startRow: page * PAGE_SIZE },
        site.token,
      )
      const values = rows.map((row) => ({
        date: row.keys[0],
        query: row.keys[1].toLowerCase().slice(0, 300),
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      }))
      for (let i = 0; i < values.length; i += CHUNK) {
        await db
          .insert(seoQueryDaily)
          .values(values.slice(i, i + CHUNK))
          .onConflictDoUpdate({
            target: [seoQueryDaily.date, seoQueryDaily.query],
            set: { clicks: sql`excluded.clicks`, impressions: sql`excluded.impressions`, ctr: sql`excluded.ctr`, position: sql`excluded.position` },
          })
      }
      queryCount += values.length
      if (rows.length < PAGE_SIZE) break
    }

    await setMeta('last_sync', new Date().toISOString())
    await setMeta('last_status', `OK: ${siteRows.length} dage, ${queryCount} søgeord-rækker`)
    return { ok: true, days: siteRows.length, queries: queryCount }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ukendt fejl'
    await setMeta('last_status', `Fejl: ${message}`).catch(() => {})
    return { ok: false, error: message }
  }
}
