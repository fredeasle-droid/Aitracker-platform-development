import { fetchBetHeroMessages, describeBetHeroMessages, BETHERO_SOURCE } from '@/lib/scrapers/bethero'
import { getBetHeroSnapshotAgeMs, saveBetHeroMessages } from '@/lib/bethero-ingest'
import { recordBetHeroStatus, resolveBetHeroCookie } from '@/lib/bethero-cookie'
import { getSessionInfo } from '@/lib/scraper-session'
import { refreshOpportunities } from '@/lib/scanner-sync'

import { db } from '@/lib/db'
import { sourceSnapshots } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

// A fresh connection is the only way to get Bet Hero's full list; the long-running VPS socket only
// receives changes, so rows pruned earlier would never come back without this periodic full pull.
const FULL_PULL_SOURCE = 'bethero-fullpull'
const PUBLIC_MIN_INTERVAL_MS = 3.5 * 60 * 1000
const BROWSER_FRESH_MS = 45 * 1000

export type BetHeroSyncResult =
  | { ok: true; skipped: true }
  | { ok: true; skipped?: false; saved: Awaited<ReturnType<typeof saveBetHeroMessages>>; summary: string }
  | { ok: false; status: number; error: string }

async function isThrottled() {
  const [row] = await db.select({ updatedAt: sourceSnapshots.updatedAt }).from(sourceSnapshots).where(eq(sourceSnapshots.source, FULL_PULL_SOURCE)).limit(1).catch(() => [])
  const last = row?.updatedAt.getTime() ?? 0
  return Date.now() - last < PUBLIC_MIN_INTERVAL_MS
}

async function markFullPull() {
  await db
    .insert(sourceSnapshots)
    .values({ source: FULL_PULL_SOURCE, payload: '[]', summary: 'full pull', rowCount: 0 })
    .onConflictDoUpdate({ target: sourceSnapshots.source, set: { updatedAt: sql`now()` } })
    .catch(() => undefined)
}

// Unauthorized callers (the public schedule and page visitors) are throttled and never see scraped data.
export async function syncBetHero({ authorized }: { authorized: boolean }): Promise<BetHeroSyncResult> {
  if (!authorized && (await isThrottled())) return { ok: true, skipped: true }
  const browserDataIsFresh = (await getBetHeroSnapshotAgeMs().catch(() => Number.POSITIVE_INFINITY)) < BROWSER_FRESH_MS
  const cookie = await resolveBetHeroCookie()
  if (!cookie) return { ok: false, status: 503, error: 'Ingen Bet Hero-cookie gemt under Kilder' }
  await markFullPull()
  try {
    const messages = await fetchBetHeroMessages(cookie)
    const saved = await saveBetHeroMessages(messages)
    const summary = describeBetHeroMessages(messages)
    await recordBetHeroStatus(`OK: ${summary}`)
    await refreshOpportunities().catch((error) => console.error('[bethero] opportunities refresh failed', error))
    return { ok: true, saved, summary }
  } catch (error) {
    console.error('[bethero] refresh failed', error)
    const message = error instanceof Error ? error.message : 'Bet Hero refresh failed'
    if (!browserDataIsFresh) await recordBetHeroStatus(`Fejl: ${message}`)
    await refreshOpportunities().catch((refreshError) => console.error('[bethero] opportunities refresh failed', refreshError))
    return { ok: false, status: 502, error: message }
  }
}
