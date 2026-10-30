import { getBookmakerKey } from '@/lib/bookmakers'

export const FILTER_BOOKMAKERS = [
  { id: 'bet365', name: 'Bet365' },
  { id: 'unibet', name: 'Unibet' },
  { id: 'pinnacle', name: 'Pinnacle' },
  { id: 'marathonbet', name: 'Marathonbet' },
  { id: 'betinia', name: 'Betinia' },
  { id: 'campobet', name: 'Campobet' },
  { id: 'ggbet', name: 'GGBet' },
  { id: 'dafabet', name: 'Dafabet' },
  { id: 'vbet', name: 'Vbet' },
  { id: 'bet9ja', name: 'Bet9ja' },
  { id: 'bcgame', name: 'BC.Game' },
] as const

export function bookmakerId(name: string): string {
  const key = getBookmakerKey(name) ?? name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return key === 'bcbet' ? 'bcgame' : key
}

export function matchesBookmaker(o: { a: { bookmaker: string }; b: { bookmaker: string } }, id: string): boolean {
  return bookmakerId(o.a.bookmaker) === id || bookmakerId(o.b.bookmaker) === id
}
