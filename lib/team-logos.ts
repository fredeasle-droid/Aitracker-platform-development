import 'server-only'
import { after } from 'next/server'
import { isNotNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities, teamLogos } from '@/lib/db/schema'

type Source = 'espn' | 'thesportsdb' | 'wikipedia' | 'wikidata'

const ESPN_LEAGUES: { sport: string; path: string; leagues: string[] }[] = [
  { sport: 'Ishockey', path: 'hockey', leagues: ['nhl', 'mens-college-hockey'] },
  { sport: 'Basketball', path: 'basketball', leagues: ['nba', 'wnba', 'mens-college-basketball', 'womens-college-basketball'] },
  { sport: 'American football', path: 'football', leagues: ['nfl', 'college-football'] },
  { sport: 'Baseball', path: 'baseball', leagues: ['mlb', 'college-baseball'] },
  {
    sport: 'Fodbold',
    path: 'soccer',
    leagues: [
      'eng.1', 'eng.2', 'eng.3', 'eng.4', 'esp.1', 'esp.2', 'ger.1', 'ger.2', 'ita.1', 'ita.2', 'fra.1', 'fra.2',
      'den.1', 'ned.1', 'ned.2', 'por.1', 'arg.1', 'arg.2', 'bra.1', 'bra.2', 'sco.1', 'sco.2', 'tur.1', 'swe.1', 'nor.1',
      'aut.1', 'bel.1', 'sui.1', 'gre.1', 'rus.1', 'mex.1', 'usa.1', 'jpn.1', 'aus.1', 'chn.1', 'col.1', 'chi.1', 'uru.1',
      'par.1', 'per.1', 'ecu.1', 'ksa.1', 'isr.1', 'rou.1', 'rsa.1', 'ind.1', 'idn.1', 'tha.1', 'mys.1', 'cyp.1',
      'uefa.champions', 'uefa.europa', 'uefa.europa.conf', 'conmebol.libertadores', 'conmebol.sudamericana',
    ],
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
const LOOKUPS_PER_RUN = 14
const LOOKUP_SPACING_MS = 2_200
const RETRY_MISSES_AFTER_MS = 6 * 60 * 60 * 1000
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

const ANY_SPORT = '*'
const anySportKey = (name: string) => `${ANY_SPORT}|${normalizeTeamName(name)}`

const CITY_ABBREVIATIONS: Record<string, string> = {
  tb: 'Tampa Bay',
  ny: 'New York',
  la: 'Los Angeles',
  sf: 'San Francisco',
  sd: 'San Diego',
  kc: 'Kansas City',
  stl: 'St. Louis',
  wsh: 'Washington',
  chi: 'Chicago',
  gs: 'Golden State',
  okc: 'Oklahoma City',
  lv: 'Las Vegas',
  nj: 'New Jersey',
  no: 'New Orleans',
  sa: 'San Antonio',
  ari: 'Arizona',
  gb: 'Green Bay',
  ne: 'New England',
  sj: 'San Jose',
  nyk: 'New York',
  phi: 'Philadelphia',
}

const TEAM_SUFFIX_NOISE = /\s+(basketball club|basketball|hockey club|hockey|handball club|handball|football club|bc|hc)$/i

export function nameVariants(name: string) {
  const base = name.replace(/\s*\((?:W|R|U\d+)\)\s*$/i, '').trim()
  const variants = new Set<string>([base])

  const withoutSuffix = base.replace(TEAM_SUFFIX_NOISE, '').trim()
  variants.add(withoutSuffix)

  const [first, ...rest] = withoutSuffix.split(/\s+/)
  const city = CITY_ABBREVIATIONS[first.toLowerCase().replace(/\./g, '')]
  if (city && rest.length > 0) variants.add(`${city} ${rest.join(' ')}`)

  const words = withoutSuffix.split(/\s+/)
  if (words.length >= 2) variants.add(words.slice(0, -1).join(' '))
  if (words.length >= 3) variants.add(words.slice(1).join(' '))

  return [...variants].filter((variant) => variant.length >= 3)
}

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
          for (const name of names) {
            if (!name) continue
            map.set(logoKey(sport, name), logo)
            if (!map.has(anySportKey(name))) map.set(anySportKey(name), logo)
          }
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
    for (const query of nameVariants(name).slice(0, 3)) {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/searchteams.php?t=${encodeURIComponent(query)}`, {
        signal: AbortSignal.timeout(8_000),
      })
      if (res.status === 429 || res.status === 403) return { status: 'limited' }
      if (!res.ok) return { status: 'limited' }
      const data = await res.json()
      const teams: { strTeam?: string; strSport?: string; strBadge?: string; strTeamBadge?: string }[] = data.teams ?? []
      const badge = (team: { strBadge?: string; strTeamBadge?: string }) => team.strBadge || team.strTeamBadge
      const sameSport = teams.find((team) => team.strSport === wanted && badge(team))
      const sameName = teams.find((team) => badge(team) && team.strTeam && normalizeTeamName(team.strTeam) === normalizeTeamName(query))
      const url = (sameSport && badge(sameSport)) || (sameName && badge(sameName))
      if (url) return { status: 'found', url }
      await new Promise((resolve) => setTimeout(resolve, LOOKUP_SPACING_MS))
    }
    return { status: 'none' }
  } catch (error) {
    console.error('[logos] thesportsdb lookup failed', name, error)
    return { status: 'limited' }
  }
}

const WIKI_SPORT_HINT: Record<string, string> = {
  Fodbold: 'football club',
  Ishockey: 'ice hockey team',
  Basketball: 'basketball team',
  'Håndbold': 'handball club',
  Baseball: 'baseball team',
  Cricket: 'cricket team',
  'American football': 'american football team',
}
const WIKI_NOISE_TITLE = /\b(list of|season|seasons|squad|stadium|arena|league|cup|championship|national)\b/i
const WIKI_LOGO_FILE = /logo|crest|badge|emblem|wordmark|shield|seal|coat[_ ]of[_ ]arms/i
const WIKI_SPACING_MS = 1_000

function titleMatchesTeam(title: string, name: string) {
  const a = new Set(normalizeTeamName(title.replace(/\(.*?\)/g, ' ')).split(' ').filter(Boolean))
  const b = new Set(normalizeTeamName(name).split(' ').filter(Boolean))
  if (a.size === 0 || b.size === 0) return false
  const [small, large] = a.size <= b.size ? [a, b] : [b, a]
  return [...small].every((token) => large.has(token))
}

async function lookupWikipedia(sport: string, name: string): Promise<LookupResult> {
  try {
    const query = name.replace(/\s*\((?:W|R|U\d+)\)\s*$/i, '').trim()
    const search = `${query} ${WIKI_SPORT_HINT[sport] ?? ''}`.trim()
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=200' +
      `&gsrsearch=${encodeURIComponent(search)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BetTracker/1.0 (team logo lookup)' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return { status: 'limited' }
    const data = await res.json()
    const pages: { index?: number; title: string; thumbnail?: { source?: string } }[] = Object.values(data.query?.pages ?? {})
    pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    const match = pages.find((page) => {
      const image = page.thumbnail?.source
      return image && !WIKI_NOISE_TITLE.test(page.title) && titleMatchesTeam(page.title, query) && WIKI_LOGO_FILE.test(decodeURIComponent(image))
    })
    const image = match?.thumbnail?.source
    return image ? { status: 'found', url: image } : { status: 'none' }
  } catch (error) {
    console.error('[logos] wikipedia lookup failed', name, error)
    return { status: 'limited' }
  }
}

async function lookupWikidata(name: string): Promise<LookupResult> {
  try {
    const query = name.replace(/\s*\((?:W|R|U\d+)\)\s*$/i, '').trim()
    const headers = { 'User-Agent': 'BetTracker/1.0 (team logo lookup)' }
    const search = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=5&search=${encodeURIComponent(query)}`,
      { headers, signal: AbortSignal.timeout(8_000) },
    )
    if (!search.ok) return { status: 'limited' }
    const hits: { id: string; label?: string }[] = (await search.json()).search ?? []
    const ids = hits.filter((hit) => hit.label && titleMatchesTeam(hit.label, query)).map((hit) => hit.id)
    if (ids.length === 0) return { status: 'none' }

    const entities = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${ids.join('|')}`,
      { headers, signal: AbortSignal.timeout(8_000) },
    )
    if (!entities.ok) return { status: 'limited' }
    const data = await entities.json()
    for (const id of ids) {
      const file = data.entities?.[id]?.claims?.P154?.[0]?.mainsnak?.datavalue?.value
      if (typeof file === 'string') {
        return { status: 'found', url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=200` }
      }
    }
    return { status: 'none' }
  } catch (error) {
    console.error('[logos] wikidata lookup failed', name, error)
    return { status: 'limited' }
  }
}

const PLAYER_SPORT: Record<string, { sportsDb: string; wiki: string; extract: RegExp }> = {
  Tennis: { sportsDb: 'Tennis', wiki: 'tennis player', extract: /tennis/i },
  Badminton: { sportsDb: 'Badminton', wiki: 'badminton player', extract: /badminton/i },
  Bordtennis: { sportsDb: 'Table Tennis', wiki: 'table tennis player', extract: /table tennis/i },
  Golf: { sportsDb: 'Golf', wiki: 'golfer', extract: /golf/i },
  Snooker: { sportsDb: 'Snooker', wiki: 'snooker player', extract: /snooker/i },
  Dart: { sportsDb: 'Darts', wiki: 'darts player', extract: /darts/i },
  Darts: { sportsDb: 'Darts', wiki: 'darts player', extract: /darts/i },
  MMA: { sportsDb: 'Fighting', wiki: 'mixed martial artist', extract: /martial|fighter/i },
  Boksning: { sportsDb: 'Boxing', wiki: 'boxer', extract: /box/i },
}

const WIKI_NOT_A_PORTRAIT = /flag|logo|map|coat[_ ]of[_ ]arms|\.svg/i

async function lookupPlayerSportsDb(sport: string, name: string): Promise<LookupResult> {
  const config = PLAYER_SPORT[sport]
  if (!config) return { status: 'none' }
  try {
    const query = name.replace(/\s*\((?:W|R|U\d+)\)\s*$/i, '').trim()
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/searchplayers.php?p=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return { status: 'limited' }
    const data = await res.json()
    const players: { strPlayer?: string; strSport?: string; strCutout?: string; strThumb?: string }[] = data.player ?? []
    const match = players.find(
      (player) =>
        player.strPlayer &&
        normalizeTeamName(player.strPlayer) === normalizeTeamName(query) &&
        player.strSport === config.sportsDb &&
        (player.strCutout || player.strThumb),
    )
    const url = match?.strCutout || match?.strThumb
    return url ? { status: 'found', url } : { status: 'none' }
  } catch (error) {
    console.error('[logos] thesportsdb player lookup failed', name, error)
    return { status: 'limited' }
  }
}

async function lookupPlayerWikipedia(sport: string, name: string): Promise<LookupResult> {
  const config = PLAYER_SPORT[sport]
  if (!config) return { status: 'none' }
  try {
    const query = name.replace(/\s*\((?:W|R|U\d+)\)\s*$/i, '').trim()
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=5&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=240&exintro=1&explaintext=1&exchars=400&exlimit=max' +
      `&gsrsearch=${encodeURIComponent(`${query} ${config.wiki}`)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'BetTracker/1.0 (player photo lookup)' }, signal: AbortSignal.timeout(8_000) })
    if (!res.ok) return { status: 'limited' }
    const data = await res.json()
    const pages: { index?: number; title: string; extract?: string; thumbnail?: { source?: string } }[] = Object.values(data.query?.pages ?? {})
    pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    const match = pages.find((page) => {
      const image = page.thumbnail?.source
      return (
        image &&
        !WIKI_NOT_A_PORTRAIT.test(decodeURIComponent(image)) &&
        titleMatchesTeam(page.title, query) &&
        normalizeTeamName(page.title.replace(/\(.*?\)/g, ' ')) === normalizeTeamName(query) &&
        config.extract.test(page.extract ?? '')
      )
    })
    const image = match?.thumbnail?.source
    return image ? { status: 'found', url: image } : { status: 'none' }
  } catch (error) {
    console.error('[logos] wikipedia player lookup failed', name, error)
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
    if (!THESPORTSDB_SPORT[row.sport] && !PLAYER_SPORT[row.sport] && !ESPN_LEAGUES.some((league) => league.sport === row.sport)) continue
    for (const name of [row.home, row.away]) {
      const key = logoKey(row.sport, name)
      const previous = knownByKey.get(key)
      const retry = previous && !previous.url && Date.now() - previous.checkedAt.getTime() > RETRY_MISSES_AFTER_MS
      if (!previous || retry) pending.set(key, { key, sport: row.sport, name })
    }
  }
  if (pending.size === 0) return { pending: 0, fromEspn: 0, fromSportsDb: 0, fromWikipedia: 0, misses: 0, limited: false }

  const espn = await getEspnIndex()
  const fromEspn: Parameters<typeof saveLogos>[0] = []
  const remaining: { key: string; sport: string; name: string }[] = []
  const knownAnySport = new Map<string, string>()
  for (const row of known) {
    if (!row.url) continue
    const name = row.key.slice(row.key.indexOf('|') + 1)
    if (!knownAnySport.has(name)) knownAnySport.set(name, row.url)
  }

  for (const team of pending.values()) {
    if (PLAYER_SPORT[team.sport]) {
      remaining.push(team)
      continue
    }
    const variants = nameVariants(team.name)
    const url =
      espn.get(team.key) ??
      variants.map((variant) => espn.get(logoKey(team.sport, variant))).find(Boolean) ??
      variants.map((variant) => espn.get(anySportKey(variant))).find(Boolean) ??
      variants.map((variant) => knownAnySport.get(normalizeTeamName(variant))).find(Boolean)
    if (url) fromEspn.push({ ...team, url, source: 'espn' })
    else remaining.push(team)
  }
  await saveLogos(fromEspn)

  const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  const found: Parameters<typeof saveLogos>[0] = []
  let misses = 0
  let sportsDbLimited = false
  let wikiLimited = false
  for (const team of remaining.slice(0, LOOKUPS_PER_RUN)) {
    let result: LookupResult = { status: 'none' }
    let source: Source = 'thesportsdb'

    const isPlayer = Boolean(PLAYER_SPORT[team.sport])

    if (!sportsDbLimited) {
      result = isPlayer ? await lookupPlayerSportsDb(team.sport, team.name) : await lookupTheSportsDb(team.sport, team.name)
      if (result.status === 'limited') sportsDbLimited = true
      else await pause(LOOKUP_SPACING_MS)
    }
    if (result.status !== 'found' && !wikiLimited) {
      const wiki = isPlayer ? await lookupPlayerWikipedia(team.sport, team.name) : await lookupWikipedia(team.sport, team.name)
      if (wiki.status === 'limited') wikiLimited = true
      else {
        result = wiki
        source = 'wikipedia'
        await pause(WIKI_SPACING_MS)
      }
    }
    if (result.status !== 'found' && !isPlayer) {
      const wikidata = await lookupWikidata(team.name)
      if (wikidata.status === 'found') {
        result = wikidata
        source = 'wikidata'
      }
      await pause(WIKI_SPACING_MS)
    }

    if (result.status === 'found') found.push({ ...team, url: result.url, source })
    else if (!sportsDbLimited && !wikiLimited) {
      misses++
      found.push({ ...team, url: null, source: null })
    }
    if (sportsDbLimited && wikiLimited) break
  }
  await saveLogos(found)

  return {
    pending: pending.size,
    fromEspn: fromEspn.length,
    fromSportsDb: found.filter((entry) => entry.source === 'thesportsdb').length,
    fromWikipedia: found.filter((entry) => entry.source === 'wikipedia').length,
    misses,
    limited: sportsDbLimited && wikiLimited,
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
