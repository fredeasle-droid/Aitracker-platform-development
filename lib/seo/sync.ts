import 'server-only'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { LOCALE_PREFIX, type Locale } from '@/lib/i18n'
import { seoMeta, seoQueryDaily, seoSiteDaily } from '@/lib/db/schema'
import { getSearchConsoleConfig, querySearchAnalytics } from './search-console'

const PAGE_SIZE = 25000
const MAX_PAGES = 4
const CHUNK = 500

export const SEO_LOCALES: Locale[] = ['da', 'en', 'sv', 'no', 'de', 'es', 'br', 'pt', 'fr', 'it', 'pl', 'fi', 'nl']

const isoDate = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Copenhagen' }).format(date)
const daysAgo = (days: number) => isoDate(new Date(Date.now() - days * 86_400_000))

// Danish lives at the root, so it is every page that is NOT under another language prefix.
function pageFilter(locale: Locale) {
  const prefixes = SEO_LOCALES.map((item) => LOCALE_PREFIX[item]).filter(Boolean)
  const filter =
    locale === 'da'
      ? { dimension: 'page' as const, operator: 'excludingRegex' as const, expression: `^https?://[^/]+/(${prefixes.join('|')})(/|$)` }
      : { dimension: 'page' as const, operator: 'includingRegex' as const, expression: `^https?://[^/]+/${LOCALE_PREFIX[locale]}(/|$)` }
  return [{ groupType: 'and' as const, filters: [filter] }]
}

async function setMeta(key: string, value: string) {
  await db.insert(seoMeta).values({ key, value }).onConflictDoUpdate({ target: seoMeta.key, set: { value } })
}

export type SeoSyncResult = { ok: true; days: number; queries: number } | { ok: false; error: string }

export async function syncSearchConsole(): Promise<SeoSyncResult> {
  const config = getSearchConsoleConfig()
  if (!config) return { ok: false, error: 'Search Console er ikke forbundet endnu.' }

  try {
    const counts = (await db.execute(sql`select locale, count(*)::int as count from seo_site_daily group by locale`)).rows as { locale: string; count: number }[]
    const endDate = daysAgo(0)
    let totalDays = 0
    let totalQueries = 0
    let token: string | undefined

    for (const locale of SEO_LOCALES) {
      // First run per country backfills 16 months; later runs refresh the last days, which Google keeps revising.
      const hasHistory = (counts.find((row) => row.locale === locale)?.count ?? 0) > 0
      const startDate = daysAgo(hasHistory ? 6 : 480)
      const dimensionFilterGroups = pageFilter(locale)

      const site = await querySearchAnalytics(config, { startDate, endDate, dimensions: ['date'], dimensionFilterGroups }, token)
      token = site.token
      const siteRows = site.rows.map((row) => ({ locale, date: row.keys[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }))
      for (let i = 0; i < siteRows.length; i += CHUNK) {
        await db
          .insert(seoSiteDaily)
          .values(siteRows.slice(i, i + CHUNK))
          .onConflictDoUpdate({
            target: [seoSiteDaily.locale, seoSiteDaily.date],
            set: { clicks: sql`excluded.clicks`, impressions: sql`excluded.impressions`, ctr: sql`excluded.ctr`, position: sql`excluded.position` },
          })
      }
      totalDays += siteRows.length

      for (let page = 0; page < MAX_PAGES; page++) {
        const { rows } = await querySearchAnalytics(
          config,
          { startDate, endDate, dimensions: ['date', 'query'], rowLimit: PAGE_SIZE, startRow: page * PAGE_SIZE, dimensionFilterGroups },
          token,
        )
        const values = rows.map((row) => ({
          locale,
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
              target: [seoQueryDaily.locale, seoQueryDaily.date, seoQueryDaily.query],
              set: { clicks: sql`excluded.clicks`, impressions: sql`excluded.impressions`, ctr: sql`excluded.ctr`, position: sql`excluded.position` },
            })
        }
        totalQueries += values.length
        if (rows.length < PAGE_SIZE) break
      }
    }

    await setMeta('last_sync', new Date().toISOString())
    await setMeta('last_status', `OK: ${totalDays} dage, ${totalQueries} søgeord-rækker`)
    return { ok: true, days: totalDays, queries: totalQueries }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ukendt fejl'
    await setMeta('last_status', `Fejl: ${message}`).catch(() => {})
    return { ok: false, error: message }
  }
}
