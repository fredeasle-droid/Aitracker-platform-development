import type { TestGameEvent, TestSurebetOpportunity, TestSurebetLeg, TestOddOutcome } from '@/types/surebet-test'

export function scanTestFeedForSurebets(events: TestGameEvent[], totalBankroll = 1000): TestSurebetOpportunity[] {
  const results: TestSurebetOpportunity[] = []

  for (const event of events) {
    for (const market of event.markets ?? []) {
      const best: Record<string, TestOddOutcome> = {}

      for (const outcome of market.outcomes ?? []) {
        if (!outcome.name || !Number.isFinite(outcome.price) || outcome.price <= 1) continue
        const key = outcome.name.trim().toLowerCase()
        if (!best[key] || outcome.price > best[key].price) best[key] = outcome
      }

      const outcomes = Object.values(best)
      if (outcomes.length < 2) continue

      const inverseSum = outcomes.reduce((sum, outcome) => sum + 1 / outcome.price, 0)
      if (!(inverseSum > 0 && inverseSum < 1)) continue

      const profitPercentage = (1 - inverseSum) * 100
      const legs: TestSurebetLeg[] = outcomes.map((outcome) => {
        const stake = (totalBankroll * (1 / outcome.price)) / inverseSum
        return {
          selection: outcome.name,
          bookmaker: outcome.bookmakerName || outcome.bookmakerId || 'Ukendt bookmaker',
          odds: outcome.price,
          stake: Math.round(stake * 100) / 100,
          returnAmount: Math.round(stake * outcome.price * 100) / 100,
        }
      })

      results.push({
        id: event.id + '-' + market.marketName,
        sport: event.sport || 'Sport',
        match: event.homeTeam + ' vs ' + event.awayTeam,
        league: event.league || 'Ukendt liga',
        commenceTime: event.commenceTime,
        market: market.marketName,
        profitPercentage: Math.round(profitPercentage * 100) / 100,
        legs,
        totalInvestment: Math.round(legs.reduce((sum, leg) => sum + leg.stake, 0) * 100) / 100,
        guaranteedReturn: Math.round((legs[0]?.returnAmount ?? 0) * 100) / 100,
      })
    }
  }

  return results.sort((a, b) => b.profitPercentage - a.profitPercentage)
}
