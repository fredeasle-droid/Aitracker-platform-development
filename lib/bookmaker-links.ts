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

// Affiliate templates may contain {url}; the deep link is inserted there so the
// affiliate tracking redirect lands the user directly on the match.
function withAffiliate(bookmaker: string, target: string) {
  const affiliate = getBookmaker(bookmaker).affiliate
  if (!affiliate) return target
  return affiliate.includes('{url}') ? affiliate.replace('{url}', encodeURIComponent(target)) : affiliate
}

export async function resolveMatchLink(bookmaker: string, home: string, away: string, kickoffTs: number): Promise<MatchLink> {
  const key = getBookmakerKey(bookmaker)
  const kambi = key ? KAMBI_BRANDS[key] : undefined
  const eventUrl = kambi ? await findKambiEvent(kambi, home, away, kickoffTs) : null
  return {
    url: withAffiliate(bookmaker, eventUrl ?? getBookmaker(bookmaker).url),
    exact: Boolean(eventUrl),
  }
}
