import 'server-only'
import { getBookmaker, getBookmakerKey } from '@/lib/bookmakers'

type KambiBrand = { code: string; eventUrl: (id: number) => string }

// Kambi powers several Danish sportsbooks; each brand exposes the same public offering API.
// Add a brand here (offering code + event URL pattern) to enable direct match links for it.
const KAMBI_BRANDS: Record<string, KambiBrand> = {
  unibet: { code: 'ubdk', eventUrl: (id) => `https://www.unibet.dk/betting/sports/event/${id}` },
}

const KAMBI_API = 'https://eu-offering-api.kambicdn.com/offering/v2018'
const QUERY = 'lang=da_DK&market=DK'
const DAY_MS = 24 * 60 * 60 * 1000

export type MatchLink = { url: string; exact: boolean }

function tokens(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(fc|fk|if|bk|sc|ac|cf|afc|cd|sk|club|de)\b/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3)
}

function sameTeam(a: string, b: string) {
  const ta = tokens(a)
  const tb = new Set(tokens(b))
  return ta.length > 0 && ta.some((t) => tb.has(t))
}

async function kambiJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 }, signal: AbortSignal.timeout(5000) })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

type KambiSearch = { resultTerms?: { type: string; id: string; englishName?: string; localizedName?: string }[] }
type KambiList = { events?: { event: { id: number; name: string; englishName?: string; start: string } }[] }

async function findKambiEvent(brand: KambiBrand, home: string, away: string, kickoffTs: number) {
  const search = await kambiJson<KambiSearch>(
    `${KAMBI_API}/${brand.code}/term/search.json?term=${encodeURIComponent(home)}&${QUERY}`,
  )
  const participants = (search?.resultTerms ?? [])
    .filter((t) => t.type === 'PARTICIPANT' && sameTeam(home, t.englishName ?? t.localizedName ?? ''))
    .slice(0, 3)

  for (const p of participants) {
    const list = await kambiJson<KambiList>(`${KAMBI_API}/${brand.code}/listView${p.id}.json?${QUERY}&useCombined=true`)
    const match = (list?.events ?? []).find(({ event }) => {
      const name = `${event.englishName ?? ''} ${event.name}`
      const closeInTime = !kickoffTs || Math.abs(new Date(event.start).getTime() - kickoffTs) < DAY_MS
      return closeInTime && sameTeam(away, name)
    })
    if (match) return brand.eventUrl(match.event.id)
  }
  return null
}

const PINNACLE_API = 'https://guest.api.arcadia.pinnacle.com/0.1'
// Public guest key that Pinnacle's own website embeds for anonymous visitors.
const PINNACLE_HEADERS = { 'x-api-key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R' }
const PINNACLE_SPORTS: Record<string, { id: number; slug: string }> = {
  Fodbold: { id: 29, slug: 'soccer' },
  Basketball: { id: 4, slug: 'basketball' },
  Tennis: { id: 33, slug: 'tennis' },
  Ishockey: { id: 19, slug: 'hockey' },
}

export type MatchContext = { sport?: string; league?: string; country?: string }

type PinnacleLeague = { id: number; name: string; matchupCount: number }
type PinnacleMatchup = {
  id: number
  type: string
  parentId: number | null
  startTime: string
  special?: unknown
  participants: { alignment: string; name: string }[]
}

async function pinnacleJson<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${PINNACLE_API}${path}`, {
      headers: PINNACLE_HEADERS,
      next: { revalidate },
      signal: AbortSignal.timeout(5000),
    })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function findPinnacleEvent(home: string, away: string, kickoffTs: number, ctx: MatchContext) {
  const sport = PINNACLE_SPORTS[ctx.sport ?? 'Fodbold']
  if (!sport) return null

  const leagues = (await pinnacleJson<PinnacleLeague[]>(`/sports/${sport.id}/leagues?all=false`, 3600)) ?? []
  const wanted = new Set(tokens(`${ctx.country ?? ''} ${ctx.league ?? ''}`))
  const candidates = leagues
    .filter((l) => l.matchupCount > 0)
    .map((l) => ({ league: l, score: tokens(l.name).filter((t) => wanted.has(t)).length }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  for (const { league } of candidates) {
    const matchups = (await pinnacleJson<PinnacleMatchup[]>(`/leagues/${league.id}/matchups`, 300)) ?? []
    const match = matchups.find((m) => {
      if (m.type !== 'matchup' || m.parentId || m.special || m.participants?.length !== 2) return false
      const h = m.participants.find((p) => p.alignment === 'home')?.name ?? ''
      const a = m.participants.find((p) => p.alignment === 'away')?.name ?? ''
      const closeInTime = !kickoffTs || Math.abs(new Date(m.startTime).getTime() - kickoffTs) < DAY_MS
      return closeInTime && sameTeam(home, h) && sameTeam(away, a)
    })
    if (match) {
      const h = match.participants.find((p) => p.alignment === 'home')?.name ?? home
      const a = match.participants.find((p) => p.alignment === 'away')?.name ?? away
      return `https://www.pinnacle.com/en/${sport.slug}/${slugify(league.name)}/${slugify(h)}-vs-${slugify(a)}/${match.id}/`
    }
  }
  return null
}

// Affiliate templates may contain {url}; the deep link is inserted there so the
// affiliate tracking redirect lands the user directly on the match.
function withAffiliate(bookmaker: string, target: string) {
  const affiliate = getBookmaker(bookmaker).affiliate
  if (!affiliate) return target
  return affiliate.includes('{url}') ? affiliate.replace('{url}', encodeURIComponent(target)) : affiliate
}

export async function resolveMatchLink(
  bookmaker: string,
  home: string,
  away: string,
  kickoffTs: number,
  ctx: MatchContext = {},
): Promise<MatchLink> {
  const key = getBookmakerKey(bookmaker)
  const kambi = key ? KAMBI_BRANDS[key] : undefined
  let eventUrl: string | null = null
  if (kambi) eventUrl = await findKambiEvent(kambi, home, away, kickoffTs)
  else if (key === 'pinnacle') eventUrl = await findPinnacleEvent(home, away, kickoffTs, ctx)
  return {
    url: withAffiliate(bookmaker, eventUrl ?? getBookmaker(bookmaker).url),
    exact: Boolean(eventUrl),
  }
}
