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
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`SportsGameOdds API fejl: ${response.statusText}`);
    }

    const data = await response.json();

    const events: GameEvent[] = (data.events || data || []).map((ev: any) => ({
      id: ev.id || Math.random().toString(),
      homeTeam: ev.homeTeam || ev.home_team || "Hjemmehold",
      awayTeam: ev.awayTeam || ev.away_team || "Udehold",
      commenceTime: ev.commenceTime || ev.commence_time || new Date().toISOString(),
      league: ev.leagueName || ev.league || "Diverse",
      sport: ev.sportName || ev.sport || "Sport",
      markets: ev.markets || [],
    }));

    return scanForSurebets(events, bankroll);
  } catch (error) {
    console.error("Fejl ved hentning af feed-test odds:", error);
    return [];
  }
}
