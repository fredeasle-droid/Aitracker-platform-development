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

export function parseBookmakers(value: string | null | undefined): string[] {
  if (!value) return []
  return Array.from(new Set(value.split(',').map((v) => v.trim()).filter(Boolean)))
}

export function toggleBookmaker(selected: string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
}

// One selected: either side must be that bookmaker. Two or more: both sides must be among the selected.
export function matchesBookmakers(o: { a: { bookmaker: string }; b: { bookmaker: string } }, selected: string[]): boolean {
  if (selected.length === 0) return true
  const a = bookmakerId(o.a.bookmaker)
  const b = bookmakerId(o.b.bookmaker)
  if (selected.length === 1) return a === selected[0] || b === selected[0]
  return selected.includes(a) && selected.includes(b)
}
