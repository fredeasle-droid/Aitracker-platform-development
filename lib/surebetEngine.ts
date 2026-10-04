import { GameEvent, SurebetOpportunity, SurebetLeg, OddOutcome } from "@/types/surebet";

export function scanForSurebets(events: GameEvent[], totalBankroll: number = 1000): SurebetOpportunity[] {
  const surebets: SurebetOpportunity[] = [];

  for (const event of events) {
    if (!event.markets || !Array.isArray(event.markets)) continue;

    for (const market of event.markets) {
      const bestOutcomes: Record<string, OddOutcome> = {};

      if (!market.outcomes || !Array.isArray(market.outcomes)) continue;

      for (const outcome of market.outcomes) {
        if (!outcome.name || !outcome.price) continue;
        const key = outcome.name.toLowerCase().trim();

        if (!bestOutcomes[key] || outcome.price > bestOutcomes[key].price) {
          bestOutcomes[key] = outcome;
        }
      }

      const outcomesList = Object.values(bestOutcomes);
      if (outcomesList.length < 2) continue;

      const inverseSum = outcomesList.reduce((sum, item) => sum + (1 / item.price), 0);

      if (inverseSum < 1 && inverseSum > 0) {
        const profitMargin = (1 - inverseSum) * 100;

        const legs: SurebetLeg[] = outcomesList.map((item) => {
          const exactStake = (totalBankroll * (1 / item.price)) / inverseSum;
          const returnAmount = exactStake * item.price;
          return {
            selection: item.name,
            bookmaker: item.bookmakerName || item.bookmakerId || "Ukendt Bookmaker",
            odds: item.price,
            stake: Math.round(exactStake * 100) / 100,
            returnAmount: Math.round(returnAmount * 100) / 100,
          };
        });

        const totalInvestment = legs.reduce((acc, leg) => acc + leg.stake, 0);
        const guaranteedReturn = legs[0]?.returnAmount || 0;

        surebets.push({
          id: `${event.id}-${market.marketName}`,
          sport: event.sport || "Generelt",
          match: `${event.homeTeam} vs ${event.awayTeam}`,
          league: event.league || "Ukendt Liga",
          commenceTime: event.commenceTime,
          market: market.marketName,
          profitPercentage: Math.round(profitMargin * 100) / 100,
          legs,
          totalInvestment: Math.round(totalInvestment * 100) / 100,
          guaranteedReturn: Math.round(guaranteedReturn * 100) / 100,
        });
      }
    }
  }

  return surebets.sort((a, b) => b.profitPercentage - a.profitPercentage);
}
