import 'server-only'

const API_URL = 'https://api.sportsgameodds.com/v2/events'

export type SportsGameOddsEvent = {
  eventID?: string
  sportID?: string
  leagueID?: string
  teams?: Record<string, unknown>
  status?: Record<string, unknown>
  odds?: Record<string, unknown>
  [key: string]: unknown
}

export type EventsResponse = {
  data: SportsGameOddsEvent[]
  nextCursor?: string
}

function extractEvents(payload: unknown): EventsResponse {
  if (!payload || typeof payload !== 'object') return { data: [] }
  const body = payload as Record<string, unknown>
  const nested = body.data
  if (Array.isArray(nested)) return { data: nested as SportsGameOddsEvent[], nextCursor: typeof body.nextCursor === 'string' ? body.nextCursor : undefined }
  if (nested && typeof nested === 'object') {
    const nestedBody = nested as Record<string, unknown>
    if (Array.isArray(nestedBody.events)) return { data: nestedBody.events as SportsGameOddsEvent[], nextCursor: typeof nestedBody.nextCursor === 'string' ? nestedBody.nextCursor : undefined }
    if (Array.isArray(nestedBody.data)) return { data: nestedBody.data as SportsGameOddsEvent[], nextCursor: typeof nestedBody.nextCursor === 'string' ? nestedBody.nextCursor : undefined }
  }
  if (Array.isArray(body.events)) return { data: body.events as SportsGameOddsEvent[], nextCursor: typeof body.nextCursor === 'string' ? body.nextCursor : undefined }
  return { data: [] }
}

export async function fetchSportsGameOddsEvents(params: { leagueID?: string; cursor?: string; limit?: number } = {}) {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY
  if (!apiKey) throw new Error('SPORTSGAMEODDS_API_KEY is not configured')

  const search = new URLSearchParams({
    oddsAvailable: 'true',
    limit: String(params.limit ?? 100),
  })
  if (params.leagueID) search.set('leagueID', params.leagueID)
  if (params.cursor) search.set('cursor', params.cursor)

  const response = await fetch(`${API_URL}?${search}`, {
    headers: { 'x-api-key': apiKey, accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`SportsGameOdds returned ${response.status}`)
  return extractEvents(await response.json())
}
