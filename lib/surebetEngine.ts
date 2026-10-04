import { GameEvent, SurebetOpportunity, SurebetLeg, OddOutcome } from "@/types/surebet";

export function scanForSurebets(events: GameEvent[], totalBankroll:number=1000):SurebetOpportunity[] {
  const surebets:SurebetOpportunity[]=[];
  for(const event of events){
    for(const market of event.markets ?? []){
      const bestOutcomes:Record<string,OddOutcome>={};
      for(const outcome of market.outcomes ?? []){
        if(!outcome.name || !outcome.price) continue;
        const key=outcome.name.toLowerCase().trim();
        if(!bestOutcomes[key] || outcome.price>bestOutcomes[key].price) bestOutcomes[key]=outcome;
      }
      const outcomes=Object.values(bestOutcomes);
      if(outcomes.length<2) continue;
      const inverseSum=outcomes.reduce((sum,item)=>sum+(1/item.price),0);
      if(inverseSum<1 && inverseSum>0){
        const profitMargin=(1-inverseSum)*100;
        const legs:SurebetLeg[]=outcomes.map(item=>{
          const exactStake=(totalBankroll*(1/item.price))/inverseSum;
          return {selection:item.name,bookmaker:item.bookmakerName||item.bookmakerId||"Ukendt Bookmaker",odds:item.price,stake:Math.round(exactStake*100)/100,returnAmount:Math.round(exactStake*item.price*100)/100};
        });
        surebets.push({id:`${event.id}-${market.marketName}`,sport:event.sport||"Generelt",match:`${event.homeTeam} vs ${event.awayTeam}`,league:event.league||"Ukendt Liga",commenceTime:event.commenceTime,market:market.marketName,profitPercentage:Math.round(profitMargin*100)/100,legs,totalInvestment:Math.round(legs.reduce((a,l)=>a+l.stake,0)*100)/100,guaranteedReturn:legs[0]?.returnAmount||0});
      }
    }
  }
  return surebets.sort((a,b)=>b.profitPercentage-a.profitPercentage);
}
