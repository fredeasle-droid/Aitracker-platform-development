import 'server-only'

import type { Opportunity } from '@/lib/data'

const API_URL = 'https://api.sportsgameodds.com/v2/events'

type ProviderEvent = Record<string, any>

type Quote = {
  bookmaker: string
  odds: number
  label: string
  deeplink?: string
  marketName?: string
  spread?: string | number
  lineValue?: number
  outcomeKey?: string
}

type RawMarket = { marketName?: string; sideID?: string; outcome?: string; line?: string | number; points?: string | number; [key: string]: any }

function decimalOdds(value: unknown) {
  const american = Number(value)
  if (!Number.isFinite(american) || american === 0) return null
  return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
}

function sportName(id: string) {
  return ({ SOCCER: 'Fodbold', FOOTBALL: 'Amerikansk fodbold', BASKETBALL: 'Basketball', TENNIS: 'Tennis', HOCKEY: 'Ishockey', BASEBALL: 'Baseball', GOLF: 'Golf' } as Record<string, string>)[id] ?? id
}

function teamName(team: any, fallback: string) {
  return team?.names?.long ?? team?.names?.medium ?? team?.name ?? team?.displayName ?? team?.teamName ?? team?.teamID ?? fallback
}

function eventTeams(event: ProviderEvent) {
  const teams = event.teams ?? {}
  return {
    home: teamName(teams.home, 'Hjemme'),
    away: teamName(teams.away, 'Ude'),
  }
}

function danishNumber(value: string) {
  return value.replace(/(\\d+)\\.(\\d+)/g, '$1,$2')
}

function outcomeLabel(outcome: string, market?: RawMarket) {
  const source = String(market?.sideID ?? market?.outcome ?? outcome)
  const rawLine = market?.line ?? market?.points
  const lineText = rawLine === undefined || rawLine === null || rawLine === '' ? '' : danishNumber(String(rawLine))
  const marketText = String(market?.marketName ?? '').toLowerCase()
  const handicapLine = lineText || source.match(/[+-]?\d+(?:\.\d+)?/)?.[0] || ''
  if (/spread|handicap/.test(marketText) && handicapLine) {
    const normalizedSource = source.toLowerCase()
    const signedLine = handicapLine.startsWith('-') || handicapLine.startsWith('+')
      ? handicapLine
      : `${normalizedSource.includes('away') || normalizedSource === '2' ? '+' : '-'}${handicapLine}`
    const side = normalizedSource.includes('away') || normalizedSource === '2' ? 'Udehold' : 'Hjemmehold'
    return `${side} ${signedLine}`
  }
  const line = lineText ? ` ${lineText}` : ''
  const value = `${source.replace(/[_-]+/g, ' ').trim()}${line}`
  const normalized = value.toLowerCase()
  if (normalized.startsWith('over ')) return `Over ${danishNumber(value.slice(5).trim())}`
  if (normalized.startsWith('under ')) return `Under ${danishNumber(value.slice(6).trim())}`
  if (normalized === 'home' || normalized === 'h' || normalized === 'home team' || normalized === '1') return 'Hjemmeholdet (1)'
  if (normalized === 'away' || normalized === 'a' || normalized === 'away team' || normalized === '2') return 'Udeholdet (2)'
  if (normalized === 'draw' || normalized === 'tie' || normalized === 'x') return 'Uafgjort (X)'
  if (normalized === '1x' || normalized === 'home or draw' || normalized === 'home/draw') return 'Dobbeltchance: Hjemmeholdet eller uafgjort (1X)'
  if (normalized === 'x2' || normalized === 'draw or away' || normalized === 'draw/away') return 'Dobbeltchance: Uafgjort eller udeholdet (X2)'
  if (normalized === '12' || normalized === 'home or away' || normalized === 'home/away') return 'Dobbeltchance: Hjemmeholdet eller udeholdet (12)'
  if (normalized === 'yes' || normalized === 'y') return 'Ja'
  if (normalized === 'no' || normalized === 'n') return 'Nej'
  if (normalized === 'sp' || normalized === 'spread') return 'Handicap'
  if (normalized === 'odd') return 'Ulige'
  if (normalized === 'even') return 'Lige'
  return danishNumber(value)
}

function marketLabel(marketID: string, picks: Quote[]) {
  const source = (picks[0]?.marketName ?? marketID).toLowerCase()
  const marketSource = `${source} ${marketID.toLowerCase()}`
  const hasTotals = /(^|[-_\s])(ou|o\/u|total|totals|over|under)([-_\s]|$)/.test(marketSource) || picks.some((pick) => /^(over|under)\s/i.test(pick.label))
  if (hasTotals) {
    const line = picks.map((pick) => pick.label.match(/(?:over|under)\\s+(.+)/i)?.[1]).find(Boolean)
    return line ? `Over/Under ${danishNumber(line)} mål` : 'Over/Under mål'
  }
  if (source.includes('both teams') || source.includes('btts')) return 'Begge hold scorer'
  if (source.includes('double chance')) return 'Dobbeltchance på kampresultat'
  if (source.includes('moneyline') || source.includes('winner') || source.includes('result')) return 'Kampresultat'
  if (source.includes('spread') || source.includes('handicap') || source.includes('points-game-sp')) return 'Handicap på kamp'
  if (source.includes('odd') && source.includes('even')) return 'Lige/Ulige antal'
  const readable = (picks[0]?.marketName ?? marketID).replace(/[-_]+/g, ' ')
  return readable.charAt(0).toUpperCase() + readable.slice(1)
}

function isComplementaryPair(marketID: string, picks: Quote[]) {
  if (picks.length !== 2) return false
  const labels = picks.map((pick) => pick.label.trim().toLowerCase())
  const market = `${marketID} ${picks[0].marketName ?? ''}`.toLowerCase()

  if (/spread|handicap|points-game-sp/.test(market)) {
    const handicaps = picks.map((pick) => pick.lineValue ?? Number(pick.label.match(/([+-]\d+(?:,\d+)?)/)?.[1]?.replace(',', '.')))
    const hasTwoLines = handicaps.every((value) => Number.isFinite(value))
    return hasTwoLines && Math.abs((handicaps[0] ?? 0) + (handicaps[1] ?? 0)) < 0.001 && labels[0] !== labels[1]
  }

  if (labels.every((label) => /^(over|under)\s/.test(label))) {
    const lines = labels.map((label) => label.replace(/^(over|under)\s+/, ''))
    return lines[0] === lines[1] && labels[0].split(/\s+/)[0] !== labels[1].split(/\s+/)[0]
  }

  if (labels.every((label) => ['ja', 'nej'].includes(label))) return true
  if (labels.every((label) => ['lige', 'ulige'].includes(label))) return true
  // A normal football 1X2 market is not covered by only 1 + 2 because X (draw) is missing.
  // Double-chance combinations remain valid because they explicitly cover the draw.
  if (labels.includes('dobbeltchance: hjemmeholdet eller uafgjort (1x)') && labels.includes('udeholdet (2)')) return true
  if (labels.includes('dobbeltchance: uafgjort eller udeholdet (x2)') && labels.includes('hjemmeholdet (1)')) return true
  if (labels.includes('dobbeltchance: hjemmeholdet eller udeholdet (12)') && labels.includes('uafgjort (x)')) return true

  return false
}

function toOpportunity(event: ProviderEvent, marketID: string, picks: Quote[], index: number): Opportunity | null {
  if (!isComplementaryPair(marketID, picks)) return null
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
    market: marketLabel(marketID, picks),
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
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.data?.data) ? payload.data.data : Array.isArray(payload?.data?.events) ? payload.data.events : Array.isArray(payload?.events) ? payload.events : []
}

function nextCursor(payload: any) {
  return payload?.nextCursor ?? payload?.data?.nextCursor ?? payload?.data?.data?.nextCursor ?? payload?.pagination?.nextCursor ?? payload?.data?.pagination?.nextCursor
}

export async function getLiveSurebets(): Promise<Opportunity[]> {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY
  if (!apiKey) return []
  const leagueIDs = ['EPL', 'LA_LIGA', 'BUNDESLIGA', 'IT_SERIE_A', 'FR_LIGUE_1', 'UEFA_CHAMPIONS_LEAGUE', 'NBA', 'EHF_EURO']
  const eventPages = await Promise.all(leagueIDs.map(async (leagueID) => {
    const query = new URLSearchParams({ oddsAvailable: 'true', includeAltLines: 'false', limit: '100', leagueID })
    const response = await fetch(`${API_URL}?${query}`, { headers: { 'x-api-key': apiKey, accept: 'application/json' }, cache: 'no-store' })
    if (!response.ok) return []
    return extractEvents(await response.json())
  }))
  const events = Array.from(new Map(eventPages.flat().map((event) => [event.eventID ?? JSON.stringify(event), event])).values())

  const opportunities: Opportunity[] = []
  events.forEach((event, eventIndex) => {
    const groups: Record<string, Array<{ outcome: string; market: RawMarket }>> = {}
    Object.entries(event.odds ?? {}).forEach(([oddID, market]) => {
      const rawMarket = market as RawMarket
      const parts = oddID.split('-')
      const outcome = parts.pop() ?? oddID
      const betType = parts.pop() ?? ''
      const period = parts.pop() ?? ''
      const entity = parts.pop() ?? ''
      const stat = parts.join('-')
      // Keep both sides in one market family. The entity (home/away) is the
      // side of a handicap, not a separate market, so including it here can
      // prevent the two opposing lines from ever being matched.
      const marketName = String(rawMarket.marketName ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      // SportsGameOdds uses different oddID segments for each side and for
      // some bookmaker feeds. The provider's marketName plus period is the
      // stable market identity; outcome/side belongs inside that group.
      const group = [marketName || stat || betType || 'market', period].filter(Boolean).join('-')
      ;(groups[group] ||= []).push({ outcome, market: rawMarket })
    })
    Object.entries(groups).forEach(([marketID, entries]) => {
      // Keep every bookmaker quote. A single oddID can contain several lines
      // (for example -0.5 and +0.5), and selecting one quote before pairing
      // can discard the only mathematically compatible surebet.
      const quotes = entries.flatMap(({ outcome, market }) => Object.entries(market.byBookmaker ?? {}).flatMap(([bookmaker, quote]: [string, any]) => {
        const odds = decimalOdds(quote?.odds)
        const spread = quote?.spread ?? quote?.line ?? quote?.points ?? quote?.handicap ?? market.spread ?? market.line ?? market.points ?? market.bookSpread ?? market.fairSpread
        const numericLine = Number(String(spread ?? '').replace(',', '.').match(/^[+-]?\d+(?:\.\d+)?/)?.[0])
        const lineValue = Number.isFinite(numericLine) ? numericLine : undefined
        const labelMarket = spread === undefined ? market : { ...market, line: spread, spread }
        if (odds === null) return []
        return [{ bookmaker, odds, label: outcomeLabel(outcome, labelMarket), marketName: market.marketName, spread, lineValue, outcomeKey: outcome, deeplink: quote?.deeplink as string | undefined }]
      }))

      // Test every cross-bookmaker pair. Compatibility is checked from the
      // original side and line values, never from the displayed text alone.
      let bestOpportunity: Opportunity | null = null
      for (let i = 0; i < quotes.length; i += 1) {
        for (let j = i + 1; j < quotes.length; j += 1) {
          if (quotes[i].bookmaker === quotes[j].bookmaker && quotes[i].outcomeKey === quotes[j].outcomeKey) continue
          const opportunity = toOpportunity(event, marketID, [quotes[i], quotes[j]], eventIndex)
          if (opportunity && (!bestOpportunity || opportunity.margin > bestOpportunity.margin)) bestOpportunity = opportunity
        }
      }
      if (bestOpportunity) opportunities.push(bestOpportunity)
    })
  })
  return opportunities.sort((a, b) => b.margin - a.margin)
}
