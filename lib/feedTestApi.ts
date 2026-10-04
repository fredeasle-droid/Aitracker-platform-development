import { GameEvent, SurebetOpportunity } from "@/types/surebet";
import { scanForSurebets } from "./surebetEngine";

export async function getFeedTestOpportunities(bankroll: number = 1000): Promise<SurebetOpportunity[]> {
  const apiKey = process.env.SPORTS_GAME_ODDS_API_KEY;

  if (!apiKey) {
    console.warn("Mangler SPORTS_GAME_ODDS_API_KEY i miljøvariabler (.env.local).");
    return [];
  }

  try {
    const response = await fetch("https://api.sportsgameodds.com/v2/events?include=odds,markets", {
      headers: {
        "x-api-key": apiKey,
        "Accept": "application/json",
      },
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      throw new Error(`SportsGameOdds API fejl: ${response.statusText}`);
    }

    const json = await response.json();
    
    console.log("SportsGameOdds API Raw Response:", JSON.stringify(json).slice(0, 300));

    const rawEvents = json.events || json.data || json || [];

    const events: GameEvent[] = Array.isArray(rawEvents) 
      ? rawEvents.map((ev: any) => ({
          id: ev.id || ev.eventID || Math.random().toString(),
          homeTeam: ev.homeTeam || ev.home_team || ev.homeParticipant || "Hjemmehold",
          awayTeam: ev.awayTeam || ev.away_team || ev.awayParticipant || "Udehold",
          commenceTime: ev.commenceTime || ev.commence_time || ev.startDate || new Date().toISOString(),
          league: ev.leagueName || ev.league?.name || ev.league || "Diverse",
          sport: ev.sportName || ev.sport?.name || ev.sport || "Sport",
          markets: ev.markets || ev.oddsMarkets || [],
        }))
      : [];

    const surebets = scanForSurebets(events, bankroll);
    console.log(`Fundet ${surebets.length} surebets ud af ${events.length} begivenheder.`);
    
    return surebets;
  } catch (error) {
    console.error("Fejl ved hentning af feed-test odds:", error);
    return [];
  }
}
