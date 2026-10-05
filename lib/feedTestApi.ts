// lib/feedTestApi.ts

const API_KEY = process.env.SPORTS_GAME_ODDS_API_KEY || '';
const BASE_URL = 'https://api.sportsgameodds.com/v2';

export async function fetchFootballFeed() {
  try {
    // Trin 1: Hent den opdaterede liste over ligaer, som din API-nøgle har adgang til
    const leaguesResponse = await fetch(`${BASE_URL}/leagues?apiKey=${API_KEY}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cacher i 1 time, da ligaer sjældent ændrer sig
    });

    if (!leaguesResponse.ok) {
      throw new Error(`Fejl ved hentning af liga-oversigt: ${leaguesResponse.statusText}`);
    }

    const leaguesJson = await leaguesResponse.json();
    const leaguesArray = leaguesJson.leagues || leaguesJson.data || leaguesJson;

    if (!Array.isArray(leaguesArray)) {
      console.warn('Uventet format fra /leagues endpointet');
      return null;
    }

    // Trin 2: Filtrér udelukkende fodbold/soccer league ID'er ud
    const soccerLeagueIDs = leaguesArray
      .filter((l: any) => {
        const sportName = (l.sport || l.sportName || '').toLowerCase();
        return sportName.includes('soccer') || sportName.includes('football');
      })
      .map((l: any) => l.leagueID || l.id)
      .filter(Boolean);

    if (soccerLeagueIDs.length === 0) {
      console.warn('Ingen fodbold-ligaer fundet for denne nøgle.');
      return null;
    }

    // Sæt dem sammen til en komma-separeret streng
    const leagueIDString = soccerLeagueIDs.join(',');

    // Trin 3: Hent events og odds for præcis de fundne ligaer
    const eventsUrl = `${BASE_URL}/events?leagueID=${leagueIDString}&oddsAvailable=true&apiKey=${API_KEY}`;
    
    const eventsResponse = await fetch(eventsUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 }, // Cacher i 60 sekunder
    });

    if (!eventsResponse.ok) {
      throw new Error(`Fejl ved hentning af events: ${eventsResponse.statusText}`);
    }

    const data = await eventsResponse.json();
    return data;

  } catch (error) {
    console.error('Fejl i fetchFootballFeed:', error);
    return null;
  }
}
