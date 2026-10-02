import type { Opportunity } from '@/lib/data'
import { marginPercent } from '@/lib/odds'

const kickoff = (daysFromNow: number, hour: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  date.setHours(hour, 0, 0, 0)
  return date
}

export const demoOpportunities: Opportunity[] = [
  {
    id: 9001,
    sport: 'Football',
    country: 'England',
    countryCode: 'GB',
    league: 'Premier League',
    homeTeam: 'Northbridge FC',
    awayTeam: 'Riverside United',
    market: '2-way result',
    kickoffLabel: 'Demo fixture',
    kickoffTs: kickoff(1, 18).getTime(),
    createdTs: Date.now(),
    a: { label: 'Northbridge FC', bookmaker: 'DemoBook A', odds: 2.18 },
    b: { label: 'Riverside United', bookmaker: 'DemoBook B', odds: 2.16 },
    margin: marginPercent(2.18, 2.16),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9002,
    sport: 'Basketball',
    country: 'United States',
    countryCode: 'US',
    league: 'NBA',
    homeTeam: 'Chicago Comets',
    awayTeam: 'Seattle Orcas',
    market: '2-way result',
    kickoffLabel: 'Demo fixture',
    kickoffTs: kickoff(2, 2).getTime(),
    createdTs: Date.now() - 1000,
    a: { label: 'Chicago Comets', bookmaker: 'DemoBook C', odds: 2.42 },
    b: { label: 'Seattle Orcas', bookmaker: 'DemoBook D', odds: 2.08 },
    margin: marginPercent(2.42, 2.08),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9003,
    sport: 'Ice Hockey',
    country: 'Sweden',
    countryCode: 'SE',
    league: 'SHL',
    homeTeam: 'Stockholm Wolves',
    awayTeam: 'Gothenburg HC',
    market: '2-way result',
    kickoffLabel: 'Demo fixture',
    kickoffTs: kickoff(3, 19).getTime(),
    createdTs: Date.now() - 2000,
    a: { label: 'Stockholm Wolves', bookmaker: 'DemoBook A', odds: 2.31 },
    b: { label: 'Gothenburg HC', bookmaker: 'DemoBook E', odds: 2.24 },
    margin: marginPercent(2.31, 2.24),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9004,
    sport: 'Tennis',
    country: 'France',
    countryCode: 'FR',
    league: 'ATP Lyon',
    homeTeam: 'Alex Martin',
    awayTeam: 'Jonas Keller',
    market: '2-way result',
    kickoffLabel: 'Demo fixture',
    kickoffTs: kickoff(4, 14).getTime(),
    createdTs: Date.now() - 3000,
    a: { label: 'Alex Martin', bookmaker: 'DemoBook F', odds: 2.75 },
    b: { label: 'Jonas Keller', bookmaker: 'DemoBook B', odds: 2.12 },
    margin: marginPercent(2.75, 2.12),
    favorite: false,
    isDemo: true,
  },
]

export function isDemoMode() {
  return !process.env.ODDS_API_KEY &&
    (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview' || Boolean(process.env.V0_RUNTIME_URL))
}
