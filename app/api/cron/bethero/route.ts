import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { fetchBetHeroMessages, describeBetHeroMessages } from '@/lib/scrapers/bethero'
import { getBetHeroSnapshotAgeMs, saveBetHeroMessages } from '@/lib/bethero-ingest'
import { recordBetHeroStatus, resolveBetHeroCookie } from '@/lib/bethero-cookie'
import { getSessionInfo } from '@/lib/scraper-session'
import { refreshOpportunities } from '@/lib/scanner-sync'
import { BETHERO_SOURCE } from '@/lib/scrapers/bethero'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const PUBLIC_MIN_INTERVAL_MS = 4 * 60 * 1000
const BROWSER_FRESH_MS = 3 * 60 * 1000

// The GitHub Actions schedule calls this without a secret (GitHub secrets are unavailable),
// so unauthenticated calls are throttled and never expose scraped data.
async function isThrottled() {
  const info = await getSessionInfo(BETHERO_SOURCE).catch(() => null)
  const last = info?.lastCheckedAt?.getTime() ?? 0
  return Date.now() - last < PUBLIC_MIN_INTERVAL_MS
}

export async function GET(request: Request) {
  const authorized = isAuthorizedScan(request)
  if (!authorized && (await isThrottled())) return NextResponse.json({ ok: true, skipped: true })
  const browserDataIsFresh = (await getBetHeroSnapshotAgeMs().catch(() => Number.POSITIVE_INFINITY)) < BROWSER_FRESH_MS
  if (browserDataIsFresh && !authorized) return NextResponse.json({ ok: true, skipped: true })
  const cookie = await resolveBetHeroCookie()
  if (!cookie) return NextResponse.json({ ok: false, error: 'Ingen Bet Hero-cookie gemt under Kilder' }, { status: 503 })
  try {
    const messages = await fetchBetHeroMessages(cookie)
    const saved = await saveBetHeroMessages(messages)
    const summary = describeBetHeroMessages(messages)
    await recordBetHeroStatus(`OK: ${summary}`)
    await refreshOpportunities().catch((error) => console.error('[bethero] opportunities refresh failed', error))
    return NextResponse.json(authorized ? { ok: true, ...saved, summary } : { ok: true })
  } catch (error) {
    console.error('[bethero] cron refresh failed', error)
    const message = error instanceof Error ? error.message : 'Bet Hero refresh failed'
    if (!browserDataIsFresh) await recordBetHeroStatus(`Fejl: ${message}`)
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}
