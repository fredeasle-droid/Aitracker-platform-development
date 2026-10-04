import 'server-only'

import { fetchSportsGameOddsEvents, type SportsGameOddsEvent } from './sportsgameodds-dashboard'

type BookmakerQuote = { bookmaker: string; american: number; decimal: number; line?: string | number }
export type ArbitrageLeg = BookmakerQuote & { side: string; stakePercent: number }
export type ArbitrageOpportunity = {
  id: string
  matchup: string
  sport: string
  league: string
  market: 'spread' | 'total' | 'moneyline'
  profitPercent: number
  legs: ArbitrageLeg[]
}

export type MarketSide = { odds: number; american: number; spread?: string | number; available: boolean }
export type GroupedMarket = { key: string; statID: string; betTypeID: string; sides: Record<string, MarketSide> }
export type GroupedBookmaker = { bookmakerID: string; markets: GroupedMarket[] }

function decimal(american: unknown) {
  const value = Number(american)
  if (!Number.isFinite(value) || value === 0) return null
  return value > 0 ? value / 100 + 1 : 100 / Math.abs(value) + 1
}

function eventName(event: SportsGameOddsEvent) {
  const teams = event.teams as Record<string, any> | undefined
  return `${teams?.away?.names?.long ?? 'Udehold'} @ ${teams?.home?.names?.long ?? 'Hjemmehold'}`
}

function lineFor(betType: string, quote: any) {
  if (betType === 'sp') return quote?.spread ?? quote?.line ?? quote?.points
  if (betType === 'ou') return quote?.overUnder ?? quote?.line ?? quote?.points
  return undefined
}

function normalizeLine(value: unknown, betType: string) {
  if (value == null || value === '') return 'none'
  const parsed = Number(String(value).replace(',', '.'))
  if (!Number.isFinite(parsed)) return String(value).trim().toLowerCase()
  const normalized = Math.abs(parsed).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
  return betType === 'sp' ? normalized : parsed.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
}

export function findArbitrage(events: SportsGameOddsEvent[]) {
  const opportunities: ArbitrageOpportunity[] = []

  for (const event of events) {
    const groups = new Map<string, Record<string, BookmakerQuote[]>>()
    for (const odd of Object.values((event.odds ?? {}) as Record<string, any>)) {
      const betType = String(odd?.betTypeID ?? '')
      const side = String(odd?.sideID ?? '')
      const period = String(odd?.periodID ?? 'game')
      const statID = String(odd?.statID ?? '')
      const statEntityID = String(odd?.statEntityID ?? odd?.statEntityId ?? '')
      if (!['sp', 'ou', 'ml'].includes(betType) || period !== 'game' || !statID) continue
      const sampleQuote = Object.values(odd?.byBookmaker ?? {})[0] as any
      const line = lineFor(betType, sampleQuote)
      // The line belongs in the market identity. For spreads, opposite sides
      // use opposite signs, so normalize both to the same absolute line.
      const key = `${statID}:${statEntityID}:${betType}:${period}:${normalizeLine(line, betType)}`
      const sides = groups.get(key) ?? {}
      sides[side] ??= []
      for (const [bookmaker, quote] of Object.entries(odd?.byBookmaker ?? {})) {
        if ((quote as any)?.available === false) continue
        const american = Number((quote as any)?.odds)
        const odds = decimal(american)
        if (odds) sides[side].push({ bookmaker, american, decimal: odds, line: lineFor(betType, quote) })
      }
      groups.set(key, sides)
    }

    for (const [key, sides] of groups) {
      const [betType] = key.split(':')
      const pair = betType === 'ou' ? ['over', 'under'] : ['home', 'away']
      if (!sides[pair[0]]?.length || !sides[pair[1]]?.length) continue
      // A valid arb must use the same total line, or opposing spread lines.
      // Pair every quote instead of combining unrelated alternate lines.
      let best: [BookmakerQuote, BookmakerQuote] | null = null
      for (const first of sides[pair[0]]) for (const second of sides[pair[1]]) {
        const firstLine = first.line == null ? null : Number(String(first.line).replace(',', '.'))
        const secondLine = second.line == null ? null : Number(String(second.line).replace(',', '.'))
        const compatible = betType === 'ou'
          ? firstLine !== null && secondLine !== null && Math.abs(firstLine - secondLine) < 0.001
          : betType === 'sp'
            ? firstLine !== null && secondLine !== null && Math.abs(firstLine + secondLine) < 0.001
            : event.sportID !== 'soccer'
        if (!compatible) continue
        if (!best || first.decimal * second.decimal > best[0].decimal * best[1].decimal) best = [first, second]
      }
      if (!best) continue
      const implied = best.reduce((sum, quote) => sum + 1 / quote.decimal, 0)
      if (implied >= 1) continue
      const profitPercent = (1 / implied - 1) * 100
      opportunities.push({
        id: `${event.eventID ?? event.id ?? eventName(event)}-${key}`,
        matchup: eventName(event),
        sport: String(event.sportID ?? ''),
        league: String(event.leagueID ?? ''),
        market: betType === 'sp' ? 'spread' : betType === 'ou' ? 'total' : 'moneyline',
        profitPercent,
        legs: best.map((quote, index) => ({ ...quote, side: pair[index], stakePercent: (1 / quote.decimal / implied) * 100 })),
      })
    }
  }
  return opportunities.sort((a, b) => b.profitPercent - a.profitPercent)
}

export function groupAllMarketsByBookmaker(event: SportsGameOddsEvent): GroupedBookmaker[] {
  const grouped: Record<string, Record<string, GroupedMarket>> = {}
  for (const odd of Object.values((event.odds ?? {}) as Record<string, any>)) {
    if (String(odd?.periodID ?? 'game') !== 'game' || !odd?.statID || !odd?.betTypeID) continue
    const marketKey = `${odd.statID}-${odd.betTypeID}`
    for (const [bookmakerID, bookmakerOdds] of Object.entries(odd.byBookmaker ?? {})) {
      const quote = bookmakerOdds as any
      if (quote?.available === false) continue
      const american = Number(quote?.odds)
      const odds = decimal(american)
      if (!odds) continue
      grouped[bookmakerID] ??= {}
      grouped[bookmakerID][marketKey] ??= { key: marketKey, statID: String(odd.statID), betTypeID: String(odd.betTypeID), sides: {} }
      grouped[bookmakerID][marketKey].sides[String(odd.sideID)] = { odds, american, spread: quote?.spread, available: quote?.available !== false }
    }
  }
  return Object.entries(grouped).map(([bookmakerID, markets]) => ({ bookmakerID, markets: Object.values(markets) }))
}

export async function fetchArbitrageDashboard(leagueID = 'EPL') {
  const { data } = await fetchSportsGameOddsEvents({ leagueID, limit: 100 })
  return { opportunities: findArbitrage(data), events: data.map((event) => ({ event, markets: groupAllMarketsByBookmaker(event) })) }
}

export async function fetchArbitrageOpportunities(leagueID = 'EPL') {
  return (await fetchArbitrageDashboard(leagueID)).opportunities
}
