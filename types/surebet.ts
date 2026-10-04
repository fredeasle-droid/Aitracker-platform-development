export interface OddOutcome { bookmakerId:string; bookmakerName:string; price:number; name:string }
export interface MarketOdds { marketName:string; outcomes:OddOutcome[] }
export interface GameEvent { id:string; homeTeam:string; awayTeam:string; commenceTime:string; league:string; sport:string; markets:MarketOdds[] }
export interface SurebetLeg { selection:string; bookmaker:string; odds:number; stake:number; returnAmount:number }
export interface SurebetOpportunity { id:string; sport:string; match:string; league:string; commenceTime:string; market:string; profitPercentage:number; legs:SurebetLeg[]; totalInvestment:number; guaranteedReturn:number }
