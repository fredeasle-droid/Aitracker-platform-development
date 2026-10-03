import 'server-only'

import type { Opportunity } from '@/lib/data'

const API_URL = 'https://api.sportsgameodds.com/v2/events'

type ProviderEvent = Record<string, any>

type Quote = { bookmaker: string; odds: number; label: string; deeplink?: string }

function decimalOdds(value: unknown) {
  const american = Number(value)
  if (!Number.isFinite(american) || american === 0) return null
  return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
}

function sportName(id: string) {
  return ({ SOCCER: 'Fodbold', FOOTBALL: 'Amerikansk fodbold', BASKETBALL: 'Basketball', TENNIS: 'Tennis', HOCKEY: 'Ishockey', BASEBALL: 'Baseball', GOLF: 'Golf' } as Record<string, string>)[id] ?? id
}

function teamName(team: any, fallback: string) {
  return team?.name ?? team?.displayName ?? team?.teamName ?? team?.teamID ?? fallback
}

function eventTeams(event: ProviderEvent) {
  const teams = event.teams ?? {}
  return {
    home: teamName(teams.home, 'Hjemme'),
    away: teamName(teams.away, 'Ude'),
  }
}

function toOpportunity(event: ProviderEvent, marketID: string, picks: Quote[], index: number): Opportunity | null {
  if (picks.length < 2) return null
  const implied = picks.reduce((sum, pick) => sum + 1 / pick.odds, 0)
  const margin = (1 - implied) * 100
  if (margin <= 0) return null
  const { home, away } = eventTeams(event)
  const startsAt = new Date(event.status?.startsAt ?? event.startsAt ?? Date.now())
  const first = picks[0]
  const second = picks[1]
  return {
    id: Math.abs(`${event.eventID ?? index}-${marketID}`.split('').reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)),
    sport: sportName(event.sportID ?? 'SPORT'),
    country: event.country ?? event.region ?? 'International',
    countryCode: event.countryCode ?? 'UN',
    league: event.leagueID ?? 'Global',
    homeTeam: home,
    awayTeam: away,
    market: marketID,
    kickoffLabel: startsAt.toLocaleString('da-DK', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    kickoffTs: startsAt.getTime(),
    createdTs: Date.now(),
    a: { label: first.label, bookmaker: first.bookmaker, odds: first.odds },
    b: { label: second.label, bookmaker: second.bookmaker, odds: second.odds },
    margin,
    favorite: false,
    isDemo: false,
  }
}

function extractEvents(payload: any): ProviderEvent[] {
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.data?.events) ? payload.data.events : Array.isArray(payload?.events) ? payload.events : []
}

export async function getLiveSurebets(): Promise<Opportunity[]> {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY
  if (!apiKey) return []
  const events: ProviderEvent[] = []
  let cursor: string | undefined
  for (let page = 0; page < 100; page += 1) {
    const query = new URLSearchParams({ oddsAvailable: 'true', includeAltLines: 'false', limit: '100' })
    if (cursor) query.set('cursor', cursor)
    const response = await fetch(`${API_URL}?${query}`, { headers: { 'x-api-key': apiKey, accept: 'application/json' }, cache: 'no-store' })
    if (!response.ok) break
    const payload = await response.json()
    events.push(...extractEvents(payload))
    cursor = payload?.nextCursor ?? payload?.data?.nextCursor ?? payload?.pagination?.nextCursor
    if (!cursor || extractEvents(payload).length === 0) break
  }

  const opportunities: Opportunity[] = []
  events.forEach((event, eventIndex) => {
    const groups: Record<string, Array<{ outcome: string; market: any }>> = {}
    Object.entries(event.odds ?? {}).forEach(([oddID, market]) => {
      const parts = oddID.split('-')
      const outcome = parts.pop() ?? oddID
      const group = parts.join('-')
      ;(groups[group] ||= []).push({ outcome, market })
    })
    Object.entries(groups).forEach(([marketID, entries]) => {
      const picks = entries.map(({ outcome, market }) => {
        const offers = Object.entries((market as any)?.byBookmaker ?? {}).map(([bookmaker, quote]: [string, any]) => ({ bookmaker, odds: decimalOdds(quote?.odds), label: outcome, deeplink: quote?.deeplink })).filter((quote): quote is Quote => quote.odds !== null)
        return offers.sort((a, b) => b.odds - a.odds)[0]
      }).filter(Boolean) as Quote[]
      const opportunity = toOpportunity(event, marketID, picks, eventIndex)
      if (opportunity) opportunities.push(opportunity)
    })
  })
  return opportunities.sort((a, b) => b.margin - a.margin)
}
