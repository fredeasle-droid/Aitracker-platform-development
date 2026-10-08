export interface OddOutcome {
  bookmakerId: string;
  bookmakerName: string;
  price: number;
  name: string;
  /** Optional raw/API metadata. The calculator does not require a fixed market list. */
  id?: string;
  selectionId?: string;
  line?: number | string | null;
  handicap?: number | string | null;
  point?: number | string | null;
  marketId?: string;
  marketType?: string;
  period?: string;
  team?: string;
  player?: string;
  raw?: unknown;
}

export interface MarketOdds {
  marketName: string;
  marketId?: string;
  marketType?: string;
  period?: string;
  line?: number | string | null;
  outcomes: OddOutcome[];
  /** Optional canonical atomic states supplied by the feed adapter. */
  atomicStates?: string[];
}

export interface GameEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  league: string;
  sport: string;
  markets: MarketOdds[];
  raw?: unknown;
}

export interface SurebetLeg {
  selection: string;
  bookmaker: string;
  odds: number;
  stake: number;
  returnAmount: number;
}

export interface SurebetOpportunity {
  id: string;
  sport: string;
  match: string;
  league: string;
  commenceTime: string;
  market: string;
  profitPercentage: number;
  legs: SurebetLeg[];
  totalInvestment: number;
  guaranteedReturn: number;
}
