import 'server-only'
import { getStoredCookie, recordSessionStatus } from '@/lib/scraper-session'
import { BETHERO_SOURCE } from '@/lib/scrapers/bethero'

function stripCookieLabel(value: string | null | undefined) {
  return value?.replace(/^\s*Cookie\s*[:\t ]+/i, '').trim() || null
}

export async function resolveBetHeroCookie() {
  const stored = await getStoredCookie(BETHERO_SOURCE).catch(() => null)
  return stripCookieLabel(stored) || stripCookieLabel(process.env.BETHERO_COOKIE) || null
}

export async function recordBetHeroStatus(status: string) {
  await recordSessionStatus(BETHERO_SOURCE, status).catch(() => undefined)
}
