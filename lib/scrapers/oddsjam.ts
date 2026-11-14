import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sourceSnapshots } from '@/lib/db/schema'
import { displayBookmaker, displaySport, normalizeLegLabel, splitTeams, type ScrapedSurebet } from './types'

export const ODDSJAM_SOURCE = 'oddsjam'
export const ODDSJAM_ARBITRAGE_URL = 'https://oddsjam.com/betting-tools/arbitrage'
const SNAPSHOT_TTL_MS = 3 * 60_000

type OddsJamBrowserLeg = { odds?: unknown; text?: unknown; labels?: unknown }
type OddsJamBrowserRow = { text?: unknown; labels?: unknown; legs?: unknown; capturedAt?: unknown; timezoneOffset?: unknown }

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean) : []
}

function parseKickoff(value: string, capturedAt: number, timezoneOffset: number) {
  const direct = new Date(value)
  if (!Number.isNaN(direct.getTime()) && !/^(?:today|tomorrow|mon|tue|wed|thu|fri|sat|sun)\b/i.test(value)) return direct

  const clock = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!clock) return null
  let hour = Number(clock[1]) % 12
  if (clock[3].toUpperCase() === 'PM') hour += 12
  const minute = Number(clock[2])
  const localNow = new Date(capturedAt - timezoneOffset * 60_000)
  let dayOffset = 0
  if (/tomorrow/i.test(value)) dayOffset = 1
  else if (/\b(mon|tue|wed|thu|fri|sat|sun)/i.test(value)) {
    const names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const target = names.findIndex((name) => value.toLowerCase().includes(name))
    if (target >= 0) dayOffset = (target - localNow.getUTCDay() + 7) % 7 || 7
  }
  const localDateAsUtc = Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate() + dayOffset, hour, minute)
  return new Date(localDateAsUtc + timezoneOffset * 60_000)
}

function bookmakerFromLabels(labels: string[]) {
  for (const label of labels) {
    const name = label
      .replace(/\b(?:sportsbook logo|sports betting|sportsbook|logo)\b/gi, '')
      .replace(/https?:\/\//gi, '')
      .replace(/\.com\b/gi, '')
      .trim()
    if (!name || name.length > 40 || /^(game|bet|dual|oddsjam|arbitrage|calculator|pin|close|open|add|remove|more|favorite|favourite|details|refresh|profit|notification)$/i.test(name)) continue
    if (/^\$?\d/.test(name) || /\b(?:over|under|home|away|draw|yes|no)\b/i.test(name)) continue
    return displayBookmaker(name)
  }
  return ''
}

function selectionFromText(text: string, fallback: string) {
  const value = text.match(/\b(?:over|under|yes|no|draw|home|away)\s*[-+]?\d*(?:\.\d+)?/i)?.[0]
    ?? text.match(/^\s*[12X]\s+(.+)$/i)?.[1]
    ?? fallback
  return value.trim().replace(/^\s*[12X]\s+/, '')
}

export function parseOddsJamBrowserRow(raw: OddsJamBrowserRow): ScrapedSurebet | null {
  if (typeof raw.text !== 'string' || raw.text.length > 1800) return null
  const lines = raw.text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const eventLine = lines.find((line) => /\s+vs\.?\s+/i.test(line))
  const teams = splitTeams(eventLine ?? '')
  const percent = raw.text.match(/(\d+(?:\.\d+)?)\s*%/)
  if (!teams || !percent) return null

  const capturedAt = Number(raw.capturedAt)
  const timezoneOffset = Number(raw.timezoneOffset)
  if (!Number.isFinite(capturedAt) || !Number.isFinite(timezoneOffset) || Math.abs(timezoneOffset) > 900) return null
  const eventIndex = lines.indexOf(eventLine as string)
  const kickoffText = lines.slice(0, eventIndex).reverse().find((line) => /(?:today|tomorrow|\b(?:mon|tue|wed|thu|fri|sat|sun)\b).*\d{1,2}:\d{2}\s*(?:AM|PM)/i.test(line))
  const kickoff = kickoffText ? parseKickoff(kickoffText, capturedAt, timezoneOffset) : null
  if (!kickoff || Number.isNaN(kickoff.getTime())) return null

  const sportLineIndex = lines.findIndex((line, index) => index > eventIndex && /[·•]/.test(line))
  if (sportLineIndex < 0) return null
  const [rawSport, rawLeague] = lines[sportLineIndex].split(/[·•]/).map((part) => part.trim())
  const market = lines.slice(sportLineIndex + 1).find((line) =>
    line.length > 2 && line.length < 100 && !/risky bet/i.test(line) && !/\d+\.\d{2}/.test(line) && !/^\$/.test(line) && !/^(?:[12X]\s+)?(?:over|under|yes|no)\b/i.test(line),
  )
  if (!market) return null

  const rawLegs = Array.isArray(raw.legs) ? raw.legs.filter((leg): leg is OddsJamBrowserLeg => Boolean(leg && typeof leg === 'object')) : []
  const fallbackSelections = lines.filter((line) => /^(?:[12X]\s+)?(?:over|under|yes|no|draw|home|away)\b/i.test(line))
  const rowLabels = asStrings(raw.labels)
  const rowBookmakers = rowLabels.filter((label) => bookmakerFromLabels([label]))
  const legs = rawLegs.slice(0, 2).map((leg, index) => {
    const odds = Number(leg.odds)
    const labels = asStrings(leg.labels)
    const bookmaker = bookmakerFromLabels(labels) || rowBookmakers[index] || ''
    const selection = selectionFromText(typeof leg.text === 'string' ? leg.text : '', fallbackSelections[index] ?? '')
    return { label: normalizeLegLabel(selection, market, 2), bookmaker, odds }
  }).filter((leg) => leg.odds > 1 && Number.isFinite(leg.odds) && leg.label && leg.bookmaker)
  if (legs.length !== 2) return null

  return {
    source: 'oddsjam',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: rawLeague || 'Ukendt liga',
    sport: displaySport(rawSport ?? ''),
    market,
    kickoff,
    profit: Number(percent[1]),
    legs,
  }
}

export async function saveOddsJamBrowserRows(rows: unknown[]) {
  const candidates = rows.filter((row): row is OddsJamBrowserRow => Boolean(row && typeof row === 'object'))
  const parsed = candidates.map(parseOddsJamBrowserRow).filter((row): row is ScrapedSurebet => row !== null)
  const unique = [...new Map(parsed.map((row) => [`${row.homeTeam}|${row.awayTeam}|${row.market}|${row.kickoff.toISOString()}`.toLowerCase(), row])).values()]
  const payload = JSON.stringify(unique)
  const summary = `OddsJam bridge: ${unique.length} rækker klar (${candidates.length} synlige kandidater)`
  await db.insert(sourceSnapshots).values({ source: ODDSJAM_SOURCE, payload, summary, rowCount: unique.length, updatedAt: new Date() }).onConflictDoUpdate({ target: sourceSnapshots.source, set: { payload, summary, rowCount: unique.length, updatedAt: new Date() } })
  return { rowCount: unique.length, candidateCount: candidates.length, summary }
}

export async function getOddsJamSnapshot() {
  const [row] = await db.select().from(sourceSnapshots).where(eq(sourceSnapshots.source, ODDSJAM_SOURCE)).limit(1)
  if (!row) return null
  return { updatedAt: row.updatedAt, summary: row.summary, rowCount: row.rowCount }
}

export async function scrapeOddsJam(): Promise<ScrapedSurebet[]> {
  const [snapshot] = await db.select().from(sourceSnapshots).where(eq(sourceSnapshots.source, ODDSJAM_SOURCE)).limit(1)
  if (!snapshot) throw new Error('Ingen OddsJam-browserfeed endnu. Forbind OddsJam fra /kilder.')
  if (Date.now() - snapshot.updatedAt.getTime() > SNAPSHOT_TTL_MS) throw new Error('OddsJam-browserfeedet er forældet. Hold Arbitrage-siden og bridge-vinduet åbne.')
  if (!snapshot.rowCount) throw new Error(snapshot.summary || 'OddsJam-broen har endnu ikke fundet brugbare rækker.')

  try {
    const rows = JSON.parse(snapshot.payload) as Array<Omit<ScrapedSurebet, 'kickoff'> & { kickoff: string }>
    return rows.map((row) => ({ ...row, kickoff: new Date(row.kickoff) })).filter((row) => !Number.isNaN(row.kickoff.getTime()))
  } catch {
    throw new Error('OddsJam-snapshot kunne ikke læses')
  }
}

export async function inspectOddsJamPage(cookie: string) {
  const response = await fetch(ODDSJAM_ARBITRAGE_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      Cookie: cookie,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  })
  const html = await response.text()

  if (response.status === 401 || response.status === 403 || response.status === 429) {
    throw new Error(`OddsJam afviste sessionen eller serveradgangen (${response.status})`)
  }
  if (/performing security verification|just a moment|cf-chl-/i.test(html)) {
    throw new Error('OddsJam viste en sikkerhedskontrol. Den bliver ikke forsøgt omgået.')
  }
  if (!response.ok) throw new Error(`OddsJam svarede ${response.status}`)
  if (response.url.includes('/login') || /sign in to your account/i.test(html)) {
    throw new Error('OddsJam viderestillede til login. Kontrollér at session-cookien er komplet.')
  }

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim().slice(0, 120) || 'Ukendt sidetitel'
  return { title, status: response.status, url: response.url }
}
