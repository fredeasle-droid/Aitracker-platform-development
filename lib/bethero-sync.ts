import { fetchBetHeroMessages, describeBetHeroMessages, BETHERO_SOURCE } from '@/lib/scrapers/bethero'
import { getBetHeroSnapshotAgeMs, saveBetHeroMessages } from '@/lib/bethero-ingest'
import { recordBetHeroStatus, resolveBetHeroCookie } from '@/lib/bethero-cookie'
import { getSessionInfo } from '@/lib/scraper-session'
import { refreshOpportunities } from '@/lib/scanner-sync'

const PUBLIC_MIN_INTERVAL_MS = 25 * 1000
const BROWSER_FRESH_MS = 45 * 1000

export type BetHeroSyncResult =
  | { ok: true; skipped: true }
  | { ok: true; skipped?: false; saved: Awaited<ReturnType<typeof saveBetHeroMessages>>; summary: string }
  | { ok: false; status: number; error: string }

async function isThrottled() {
  const info = await getSessionInfo(BETHERO_SOURCE).catch(() => null)
  const last = info?.lastCheckedAt?.getTime() ?? 0
  return Date.now() - last < PUBLIC_MIN_INTERVAL_MS
}

// Unauthorized callers (the public schedule and page visitors) are throttled and never see scraped data.
export async function syncBetHero({ authorized }: { authorized: boolean }): Promise<BetHeroSyncResult> {
  if (!authorized && (await isThrottled())) return { ok: true, skipped: true }
  const browserDataIsFresh = (await getBetHeroSnapshotAgeMs().catch(() => Number.POSITIVE_INFINITY)) < BROWSER_FRESH_MS
  if (browserDataIsFresh && !authorized) return { ok: true, skipped: true }
  const cookie = await resolveBetHeroCookie()
  if (!cookie) return { ok: false, status: 503, error: 'Ingen Bet Hero-cookie gemt under Kilder' }
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
