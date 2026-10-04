import type { TestGameEvent, TestSurebetOpportunity } from '@/types/surebet-test'
import { scanTestFeedForSurebets } from '@/lib/surebetTestEngine'

export async function getFeedTestOpportunities(bankroll = 1000): Promise<TestSurebetOpportunity[]> {
  const apiKey = process.env.SPORTS_GAME_ODDS_API_KEY || process.env.SPORTSGAMEODDS_API_KEY

  if (!apiKey) {
    console.warn('[Feed-test] Mangler SPORTS_GAME_ODDS_API_KEY/SPORTSGAMEODDS_API_KEY')
    return []
  }

  try {
    const response = await fetch('https://api.sportsgameodds.com/v2/events?include=odds,markets', {
      headers: { 'x-api-key': apiKey, Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) throw new Error('SportsGameOdds API fejl: ' + response.status)

    const data = await response.json()
    const rawEvents = Array.isArray(data) ? data : Array.isArray(data.events) ? data.events : []

    const events: TestGameEvent[] = rawEvents.map((ev: any, index: number) => ({
      id: String(ev.id ?? index),
      homeTeam: ev.homeTeam ?? ev.home_team ?? 'Hjemmehold',
      awayTeam: ev.awayTeam ?? ev.away_team ?? 'Udehold',
      commenceTime: ev.commenceTime ?? ev.commence_time ?? new Date().toISOString(),
      league: ev.leagueName ?? ev.league ?? 'Diverse',
      sport: ev.sportName ?? ev.sport ?? 'Sport',
      markets: Array.isArray(ev.markets) ? ev.markets : [],
    }))

    return scanTestFeedForSurebets(events, bankroll)
  } catch (error) {
    console.error('[Feed-test] Feed-fejl', error)
    return []
  }
}
