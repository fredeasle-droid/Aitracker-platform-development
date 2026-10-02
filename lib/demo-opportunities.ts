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
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(1, 18).getTime(),
    createdTs: Date.now(),
    a: { label: 'Northbridge FC', bookmaker: 'TestBook A', odds: 2.18 },
    b: { label: 'Riverside United', bookmaker: 'TestBook B', odds: 2.16 },
    margin: marginPercent(2.18, 2.16),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9002,
    sport: 'Football',
    country: 'Spain',
    countryCode: 'ES',
    league: 'La Liga',
    homeTeam: 'Valencia Norte',
    awayTeam: 'Sevilla Azul',
    market: '2-way result',
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(2, 20).getTime(),
    createdTs: Date.now() - 1000,
    a: { label: 'Valencia Norte', bookmaker: 'TestBook C', odds: 2.34 },
    b: { label: 'Sevilla Azul', bookmaker: 'TestBook D', odds: 2.21 },
    margin: marginPercent(2.34, 2.21),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9003,
    sport: 'Football',
    country: 'Sweden',
    countryCode: 'SE',
    league: 'Allsvenskan',
    homeTeam: 'Stockholm Wolves',
    awayTeam: 'Gothenburg HC',
    market: '2-way result',
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(3, 19).getTime(),
    createdTs: Date.now() - 2000,
    a: { label: 'Stockholm Wolves', bookmaker: 'TestBook A', odds: 2.52 },
    b: { label: 'Gothenburg HC', bookmaker: 'TestBook E', odds: 2.08 },
    margin: marginPercent(2.52, 2.08),
    favorite: false,
    isDemo: true,
  },
  {
    id: 9004,
    sport: 'Football',
    country: 'France',
    countryCode: 'FR',
    league: 'Ligue 1',
    homeTeam: 'Lyonnais 1890',
    awayTeam: 'Marseille Port',
    market: '2-way result',
    kickoffLabel: 'TEST fixture',
    kickoffTs: kickoff(4, 14).getTime(),
    createdTs: Date.now() - 3000,
    a: { label: 'Lyonnais 1890', bookmaker: 'TestBook F', odds: 2.76 },
    b: { label: 'Marseille Port', bookmaker: 'TestBook B', odds: 2.12 },
    margin: marginPercent(2.76, 2.12),
    favorite: false,
    isDemo: true,
  },
]

export function isDemoMode() {
  return !process.env.ODDS_API_KEY &&
    (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview' || Boolean(process.env.V0_RUNTIME_URL))
}
