import 'server-only'
import { after } from 'next/server'
import { isNotNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities, teamLogos } from '@/lib/db/schema'

type Source = 'espn' | 'thesportsdb'

const ESPN_LEAGUES: { sport: string; path: string; leagues: string[] }[] = [
  { sport: 'Ishockey', path: 'hockey', leagues: ['nhl'] },
  { sport: 'Basketball', path: 'basketball', leagues: ['nba'] },
  { sport: 'American football', path: 'football', leagues: ['nfl'] },
  { sport: 'Baseball', path: 'baseball', leagues: ['mlb'] },
  {
    sport: 'Fodbold',
    path: 'soccer',
    leagues: ['eng.1', 'eng.2', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'den.1', 'ned.1', 'por.1', 'arg.1', 'bra.1', 'sco.1', 'tur.1', 'swe.1', 'nor.1'],
  },
]

const THESPORTSDB_SPORT: Record<string, string> = {
  Fodbold: 'Soccer',
  Ishockey: 'Ice Hockey',
  Basketball: 'Basketball',
  'Håndbold': 'Handball',
  Baseball: 'Baseball',
  Cricket: 'Cricket',
  'American football': 'American Football',
}

const THESPORTSDB_KEY = process.env.THESPORTSDB_API_KEY || '123'
const LOOKUPS_PER_RUN = 8
const LOOKUP_SPACING_MS = 2_200
const RETRY_MISSES_AFTER_MS = 7 * 24 * 60 * 60 * 1000
const ESPN_INDEX_TTL_MS = 12 * 60 * 60 * 1000

export function normalizeTeamName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\((?:w|r|u\d+|res\.?)\)/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\b(fc|cf|sc|ac|afc|club|de|the|fk|if|bk|sk)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const logoKey = (sport: string, name: string) => `${sport}|${normalizeTeamName(name)}`

export async function getLogoMap() {
  const rows = await db.select({ key: teamLogos.key, url: teamLogos.logoUrl }).from(teamLogos).where(isNotNull(teamLogos.logoUrl))
  return new Map(rows.flatMap((row) => (row.url ? [[row.key, row.url] as const] : [])))
}

let espnIndex: { at: number; map: Map<string, string> } | null = null

async function getEspnIndex() {
  if (espnIndex && Date.now() - espnIndex.at < ESPN_INDEX_TTL_MS) return espnIndex.map

  const map = new Map<string, string>()
  const requests = ESPN_LEAGUES.flatMap(({ sport, path, leagues }) => leagues.map((league) => ({ sport, path, league })))
  await Promise.all(
    requests.map(async ({ sport, path, league }) => {
      try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/${league}/teams?limit=200`, { signal: AbortSignal.timeout(12_000) })
        if (!res.ok) return
        const data = await res.json()
        const teams: { displayName?: string; shortDisplayName?: string; name?: string; location?: string; logos?: { href?: string }[] }[] =
          data.sports?.[0]?.leagues?.[0]?.teams?.map((entry: { team: never }) => entry.team) ?? []
        for (const team of teams) {
          const logo = team.logos?.[0]?.href
          if (!logo) continue
          const names = [team.displayName, team.shortDisplayName, team.name, team.location && team.name ? `${team.location} ${team.name}` : undefined]
          for (const name of names) if (name) map.set(logoKey(sport, name), logo)
        }
      } catch (error) {
        console.error('[logos] espn league failed', league, error)
      }
    }),
  )

  if (map.size > 0) espnIndex = { at: Date.now(), map }
  return map
}

type LookupResult = { status: 'found'; url: string } | { status: 'none' } | { status: 'limited' }

async function lookupTheSportsDb(sport: string, name: string): Promise<LookupResult> {
  const wanted = THESPORTSDB_SPORT[sport]
  if (!wanted) return { status: 'none' }
  try {
    const query = name.replace(/\s*\((?:W|R|U\d+)\)\s*$/i, '').trim()
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/searchteams.php?t=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(8_000),
    })
    if (res.status === 429 || res.status === 403) return { status: 'limited' }
    if (!res.ok) return { status: 'limited' }
    const data = await res.json()
    const teams: { strSport?: string; strBadge?: string; strTeamBadge?: string }[] = data.teams ?? []
    const match = teams.find((team) => team.strSport === wanted && (team.strBadge || team.strTeamBadge))
    const url = match?.strBadge || match?.strTeamBadge
    return url ? { status: 'found', url } : { status: 'none' }
  } catch (error) {
    console.error('[logos] thesportsdb lookup failed', name, error)
    return { status: 'limited' }
  }
}

async function saveLogos(entries: { key: string; sport: string; name: string; url: string | null; source: Source | null }[]) {
  for (const entry of entries) {
    await db
      .insert(teamLogos)
      .values({ key: entry.key, sport: entry.sport, name: entry.name, logoUrl: entry.url, source: entry.source, checkedAt: new Date() })
      .onConflictDoUpdate({
        target: teamLogos.key,
        set: { logoUrl: entry.url, source: entry.source, checkedAt: new Date() },
      })
  }
}

async function run() {
  const [rows, known] = await Promise.all([
    db.select({ sport: opportunities.sport, home: opportunities.homeTeam, away: opportunities.awayTeam }).from(opportunities),
    db.select({ key: teamLogos.key, url: teamLogos.logoUrl, checkedAt: teamLogos.checkedAt }).from(teamLogos),
  ])

  const knownByKey = new Map(known.map((row) => [row.key, row]))
  const pending = new Map<string, { key: string; sport: string; name: string }>()
  for (const row of rows) {
    if (!THESPORTSDB_SPORT[row.sport] && !ESPN_LEAGUES.some((league) => league.sport === row.sport)) continue
    for (const name of [row.home, row.away]) {
      const key = logoKey(row.sport, name)
      const previous = knownByKey.get(key)
      const retry = previous && !previous.url && Date.now() - previous.checkedAt.getTime() > RETRY_MISSES_AFTER_MS
      if (!previous || retry) pending.set(key, { key, sport: row.sport, name })
    }
  }
  if (pending.size === 0) return { pending: 0, fromEspn: 0, fromSportsDb: 0, misses: 0, limited: false }

  const espn = await getEspnIndex()
  const fromEspn: Parameters<typeof saveLogos>[0] = []
  const remaining: { key: string; sport: string; name: string }[] = []
  for (const team of pending.values()) {
    const url = espn.get(team.key)
    if (url) fromEspn.push({ ...team, url, source: 'espn' })
    else remaining.push(team)
  }
  await saveLogos(fromEspn)

  const found: Parameters<typeof saveLogos>[0] = []
  let misses = 0
  let limited = false
  for (const team of remaining.slice(0, LOOKUPS_PER_RUN)) {
    const result = await lookupTheSportsDb(team.sport, team.name)
    if (result.status === 'limited') {
      limited = true
      break
    }
    if (result.status === 'found') found.push({ ...team, url: result.url, source: 'thesportsdb' })
    else {
      misses++
      found.push({ ...team, url: null, source: null })
    }
    await new Promise((resolve) => setTimeout(resolve, LOOKUP_SPACING_MS))
  }
  await saveLogos(found)

  return {
    pending: pending.size,
    fromEspn: fromEspn.length,
    fromSportsDb: found.filter((entry) => entry.url).length,
    misses,
    limited,
  }
}

let inFlight: ReturnType<typeof run> | null = null

export function refreshTeamLogos() {
  if (!inFlight) inFlight = run().finally(() => { inFlight = null })
  return inFlight
}

const MIN_ATTEMPT_GAP_MS = 30_000
let lastAttempt = 0

export function scheduleLogoRefresh() {
  if (Date.now() - lastAttempt < MIN_ATTEMPT_GAP_MS) return
  lastAttempt = Date.now()
  try {
    after(async () => {
      try {
        await refreshTeamLogos()
      } catch (error) {
        console.error('[logos] background refresh failed', error)
      }
    })
  } catch (error) {
    console.error('[logos] could not schedule background refresh', error)
  }
}
