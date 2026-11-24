import 'server-only'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import type { Locale } from '@/lib/i18n'

export type SeoTotals = { clicks: number; impressions: number; ctr: number; position: number | null }
export type SeoDay = { date: string; clicks: number; impressions: number; position: number | null }
export type SeoKeywordRow = {
  id: number
  keyword: string
  targetPath: string
  position: number | null
  previousPosition: number | null
  bestPosition: number | null
  clicks: number
  impressions: number
}
export type SeoDiscoveredQuery = { query: string; clicks: number; impressions: number; position: number }

const num = (value: unknown) => (value === null || value === undefined ? null : Number(value))

async function totals(locale: Locale, fromOffset: number, toOffset: number): Promise<SeoTotals> {
  const { rows } = await db.execute(sql`
    with anchor as (select coalesce(max(date), current_date) as d from seo_site_daily where locale = ${locale})
    select coalesce(sum(clicks), 0)::int as clicks,
           coalesce(sum(impressions), 0)::int as impressions,
           sum(position * impressions) / nullif(sum(impressions), 0) as position
    from seo_site_daily, anchor
    where locale = ${locale} and date > anchor.d - ${fromOffset}::int and date <= anchor.d - ${toOffset}::int`)
  const row = rows[0] as { clicks: number; impressions: number; position: unknown }
  return { clicks: row.clicks, impressions: row.impressions, ctr: row.impressions ? row.clicks / row.impressions : 0, position: num(row.position) }
}

export async function getSeoDashboard(locale: Locale) {
  const [current, previous, seriesResult, keywordResult, discoveredResult, metaResult] = await Promise.all([
    totals(locale, 28, 0),
    totals(locale, 56, 28),
    db.execute(sql`select to_char(date, 'YYYY-MM-DD') as date, clicks, impressions, position from seo_site_daily where locale = ${locale} order by date desc limit 90`),
    db.execute(sql`
      with anchor as (select coalesce(max(date), current_date) as d from seo_site_daily where locale = ${locale})
      select k.id, k.keyword, k.target_path,
        sum(q.position * q.impressions) filter (where q.date > anchor.d - 7) / nullif(sum(q.impressions) filter (where q.date > anchor.d - 7), 0) as position,
        sum(q.position * q.impressions) filter (where q.date > anchor.d - 14 and q.date <= anchor.d - 7) / nullif(sum(q.impressions) filter (where q.date > anchor.d - 14 and q.date <= anchor.d - 7), 0) as previous_position,
        min(q.position) as best_position,
        coalesce(sum(q.clicks) filter (where q.date > anchor.d - 28), 0)::int as clicks,
        coalesce(sum(q.impressions) filter (where q.date > anchor.d - 28), 0)::int as impressions
      from seo_keywords k
      cross join anchor
      left join seo_query_daily q on q.locale = k.locale and q.query = lower(k.keyword) and q.date > anchor.d - 90
      where k.locale = ${locale}
      group by k.id, k.keyword, k.target_path
      order by position asc nulls last, impressions desc, k.keyword`),
    db.execute(sql`
      with anchor as (select coalesce(max(date), current_date) as d from seo_site_daily where locale = ${locale})
      select q.query, sum(q.clicks)::int as clicks, sum(q.impressions)::int as impressions,
             sum(q.position * q.impressions) / nullif(sum(q.impressions), 0) as position
      from seo_query_daily q, anchor
      where q.locale = ${locale} and q.date > anchor.d - 28
        and q.query not in (select lower(keyword) from seo_keywords where locale = ${locale})
      group by q.query
      order by impressions desc
      limit 15`),
    db.execute(sql`select key, value from seo_meta`),
  ])

  const meta = Object.fromEntries((metaResult.rows as { key: string; value: string }[]).map((row) => [row.key, row.value]))

  return {
    current,
    previous,
    series: (seriesResult.rows as { date: string; clicks: number; impressions: number; position: unknown }[])
      .map((row) => ({ date: row.date, clicks: row.clicks, impressions: row.impressions, position: num(row.position) }))
      .reverse() satisfies SeoDay[],
    keywords: (keywordResult.rows as Record<string, unknown>[]).map((row) => ({
      id: Number(row.id),
      keyword: String(row.keyword),
      targetPath: String(row.target_path),
      position: num(row.position),
      previousPosition: num(row.previous_position),
      bestPosition: num(row.best_position),
      clicks: Number(row.clicks),
      impressions: Number(row.impressions),
    })) satisfies SeoKeywordRow[],
    discovered: (discoveredResult.rows as Record<string, unknown>[]).map((row) => ({
      query: String(row.query),
      clicks: Number(row.clicks),
      impressions: Number(row.impressions),
      position: Number(row.position),
    })) satisfies SeoDiscoveredQuery[],
    lastSync: meta.last_sync ?? null,
    lastStatus: meta.last_status ?? null,
  }
}
