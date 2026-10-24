import { applySetCookies, getStoredCookie, parseCookieHeader, recordSessionStatus, saveStoredCookie, serializeCookies } from '@/lib/scraper-session'
import { SCRAPER_HEADERS, displayBookmaker, displaySport, splitTeams, type ScrapedSurebet } from './types'

const FEED_URL = 'https://surebetdanmark.dk/api/internal/feed'

type FeedLeg = { bookmaker?: string; selection?: string; decimal_odds?: string | number; source_current?: boolean }
type FeedRow = {
  sport?: string
  event?: { name?: string; start_time?: string; league?: string | null }
  market?: { label?: string }
  edge?: { pct?: number }
  legs?: FeedLeg[]
  freshness?: { actionable_now?: boolean }
  validation?: { status?: string }
  blocking_flags?: string[]
}
type FeedResponse = { state?: string; feed?: { rows?: FeedRow[] } }

function parseRow(row: FeedRow): ScrapedSurebet | null {
  if (row.validation?.status !== 'validated' || !row.freshness?.actionable_now) return null
  if (row.blocking_flags?.length) return null

  const teams = splitTeams(row.event?.name ?? '')
  const kickoff = row.event?.start_time ? new Date(row.event.start_time) : null
  const profit = Number(row.edge?.pct)
  if (!teams || !kickoff || Number.isNaN(kickoff.getTime()) || !(profit > 0)) return null

  const legs = (row.legs ?? [])
    .filter((leg) => leg.bookmaker && leg.selection && leg.source_current !== false)
    .map((leg) => ({ label: leg.selection as string, bookmaker: displayBookmaker((leg.bookmaker as string).replace(/\s+DK$/i, '')), odds: Number(leg.decimal_odds) }))
    .filter((leg) => leg.odds > 1)
  if (legs.length < 2) return null

  return {
    source: 'surebetdanmark',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: row.event?.league || 'Ukendt liga',
    sport: displaySport(row.sport ?? ''),
    market: row.market?.label || 'Marked',
    kickoff,
    profit,
    legs,
  }
}

export const SUREBETDANMARK_SOURCE = 'surebetdanmark'

export function assertValidCookie(cookie: string) {
  if (/[^\x20-\x7e]/.test(cookie)) throw new Error('Cookien er afkortet eller indeholder ugyldige tegn (fx "…"). Kopiér hele Cookie-headeren igen')
}

export async function requestFeed(cookie: string) {
  assertValidCookie(cookie)
  const response = await fetch(FEED_URL, {
    headers: { ...SCRAPER_HEADERS, Accept: 'application/json', Cookie: cookie },
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (response.status === 401 || response.status === 403) throw new Error('Surebet Danmark-sessionen er udløbet')
  if (!response.ok) throw new Error(`Surebet Danmark svarede ${response.status}`)

  const data = (await response.json()) as FeedResponse
  if (data.state === 'ACCESS_DENIED') throw new Error('Surebet Danmark nægtede adgang (session udløbet eller intet medlemskab)')

  const surebets = (data.feed?.rows ?? []).map(parseRow).filter((item): item is ScrapedSurebet => item !== null)
  return { surebets, setCookies: response.headers.getSetCookie() }
}

export async function scrapeSureBetDanmark() {
  const stored = await getStoredCookie(SUREBETDANMARK_SOURCE).catch(() => null)
  const cookie = stored ?? process.env.SUREBETDANMARK_COOKIE?.trim()
  if (!cookie) throw new Error('Ingen Surebet Danmark-session. Indsæt cookien på /kilder')

  try {
    const { surebets, setCookies } = await requestFeed(cookie)
    if (stored) {
      const cookies = parseCookieHeader(stored)
      if (applySetCookies(cookies, setCookies)) await saveStoredCookie(SUREBETDANMARK_SOURCE, serializeCookies(cookies), `OK, ${surebets.length} surebets (session fornyet)`)
      else await recordSessionStatus(SUREBETDANMARK_SOURCE, `OK, ${surebets.length} surebets`)
    }
    return surebets
  } catch (error) {
    if (stored) await recordSessionStatus(SUREBETDANMARK_SOURCE, error instanceof Error ? error.message : 'Ukendt fejl').catch(() => {})
    throw error
  }
}
