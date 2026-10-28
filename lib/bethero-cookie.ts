import 'server-only'
import { getStoredCookie, recordSessionStatus } from '@/lib/scraper-session'
import { BETHERO_SOURCE } from '@/lib/scrapers/bethero'

export async function resolveBetHeroCookie() {
  const stored = await getStoredCookie(BETHERO_SOURCE).catch(() => null)
  return stored?.trim() || process.env.BETHERO_COOKIE?.trim() || null
}

export async function recordBetHeroStatus(status: string) {
  await recordSessionStatus(BETHERO_SOURCE, status).catch(() => undefined)
}
