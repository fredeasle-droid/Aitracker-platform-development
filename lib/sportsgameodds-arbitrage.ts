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
  if (betType === 'sp') return quote?.spread
  if (betType === 'ou') return quote?.overUnder
  return undefined
}

export function findArbitrage(events: SportsGameOddsEvent[]) {
  const opportunities: ArbitrageOpportunity[] = []

  for (const event of events) {
    const groups = new Map<string, Record<string, BookmakerQuote[]>>()
    for (const odd of Object.values((event.odds ?? {}) as Record<string, any>)) {
      const betType = String(odd?.betTypeID ?? '')
      const side = String(odd?.sideID ?? '')
      const period = String(odd?.periodID ?? 'game')
      if (!['sp', 'ou', 'ml'].includes(betType) || period !== 'game') continue
      const key = `${betType}:${period}`
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

export async function fetchArbitrageOpportunities(leagueID = 'EPL') {
  const { data } = await fetchSportsGameOddsEvents({ leagueID, limit: 100 })
  return findArbitrage(data)
}
