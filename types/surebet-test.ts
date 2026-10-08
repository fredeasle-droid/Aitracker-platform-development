export interface TestOddOutcome {
  bookmakerId: string
  bookmakerName: string
  price: number
  name: string
}

export interface TestMarketOdds {
  marketName: string
  outcomes: TestOddOutcome[]
}

export interface TestGameEvent {
  id: string
  homeTeam: string
  awayTeam: string
  commenceTime: string
  league: string
  sport: string
  markets: TestMarketOdds[]
}

export interface TestSurebetLeg {
  selection: string
  bookmaker: string
  odds: number
  stake: number
  returnAmount: number
}

export interface TestSurebetOpportunity {
  id: string
  sport: string
  match: string
  league: string
  commenceTime: string
  market: string
  profitPercentage: number
  legs: TestSurebetLeg[]
  totalInvestment: number
  guaranteedReturn: number
}
