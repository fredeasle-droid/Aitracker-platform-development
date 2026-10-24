import type { Opportunity } from '@/lib/data'
import { marginPercent } from '@/lib/odds'

const kickoff = (daysFromNow: number, hour: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  date.setHours(hour, 0, 0, 0)
  return date
}

function randomizedOdds(seed: number) {
  const variation = (Math.sin(seed * 12.9898) * 43758.5453) % 1
  const first = 2.05 + Math.abs(variation) * 0.75
  // Keep the generated two-way arbitrage inside the preview test range.
  // target is the combined implied probability; values below 1 produce a positive margin.
  const target = 0.935 + (Math.abs(Math.sin(seed * 7.13)) * 0.02)
  const second = 1 / (target - 1 / first)
  return { a: Number(first.toFixed(2)), b: Number(second.toFixed(2)) }
}

const TEST_ODDS = [1, 2, 3, 4].map(randomizedOdds)

export const demoOpportunities: Opportunity[] = [
  {
    id: 9001,
    sport: 'Football',
    country: 'Danmark',
    countryCode: 'DK',
    league: 'Superligaen',
    homeTeam: 'FC København',
    awayTeam: 'Brøndby IF',
    market: 'Over/Under 2,5 mål',
    kickoffLabel: 'I dag 19:00',
    kickoffTs: kickoff(1, 18).getTime(),
    createdTs: Date.now(),
    a: { label: 'Over 2,5', bookmaker: 'Bet365', odds: TEST_ODDS[0].a },
    b: { label: 'Under 2,5', bookmaker: 'NordicBet', odds: TEST_ODDS[0].b },
    margin: marginPercent(TEST_ODDS[0].a, TEST_ODDS[0].b),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9002,
    sport: 'Football',
    country: 'England',
    countryCode: 'gb-eng',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Arsenal',
    market: '2-way result',
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(2, 20).getTime(),
    createdTs: Date.now() - 1000,
    a: { label: 'Valencia Norte', bookmaker: 'Unibet', odds: TEST_ODDS[1].a },
    b: { label: 'Sevilla Azul', bookmaker: 'Betsson', odds: TEST_ODDS[1].b },
    margin: marginPercent(TEST_ODDS[1].a, TEST_ODDS[1].b),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9003,
    sport: 'Football',
    country: 'Spain',
    countryCode: 'ES',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    market: '2-way result',
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(3, 19).getTime(),
    createdTs: Date.now() - 2000,
    a: { label: 'Stockholm Wolves', bookmaker: 'Betano', odds: TEST_ODDS[2].a },
    b: { label: 'Gothenburg HC', bookmaker: 'Danske Spil', odds: TEST_ODDS[2].b },
    margin: marginPercent(TEST_ODDS[2].a, TEST_ODDS[2].b),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9004,
    sport: 'Football',
    country: 'Italy',
    countryCode: 'IT',
    league: 'Serie A',
    homeTeam: 'Inter',
    awayTeam: 'AC Milan',
    market: '2-way result',
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(4, 14).getTime(),
    createdTs: Date.now() - 3000,
    a: { label: 'Lyonnais 1890', bookmaker: 'LeoVegas', odds: TEST_ODDS[3].a },
    b: { label: 'Marseille Port', bookmaker: 'Expekt', odds: TEST_ODDS[3].b },
    margin: marginPercent(TEST_ODDS[3].a, TEST_ODDS[3].b),
    favorite: false,
    isDemo: true,
  },
]

export function isDemoMode() {
  const hasLiveProvider = Boolean(process.env.ODDS_API_KEY || process.env.SPORTSGAMEODDS_API_KEY)
  return !hasLiveProvider &&
    (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview' || Boolean(process.env.V0_RUNTIME_URL))
}
