import { getBookmakerKey } from '@/lib/bookmakers'

export const FILTER_BOOKMAKERS = [
  { id: '1xbet', name: '1XBET' },
  { id: '21luckybet', name: '21LuckyBet' },
  { id: '888sport', name: '888sport' },
  { id: 'bcgame', name: 'BC.Game' },
  { id: 'bet365', name: 'Bet365' },
  { id: 'bet9ja', name: 'Bet9ja' },
  { id: 'betfair', name: 'betfair' },
  { id: 'betinia', name: 'Betinia' },
  { id: 'bwin', name: 'bwin' },
  { id: 'campobet', name: 'Campobet' },
  { id: 'dafabet', name: 'Dafabet' },
  { id: 'ggbet', name: 'GGBet' },
  { id: 'marathonbet', name: 'Marathonbet' },
  { id: 'oddset', name: 'Oddset' },
  { id: 'pinnacle', name: 'Pinnacle' },
  { id: 'skybet', name: 'Sky Bet' },
  { id: 'unibet', name: 'Unibet' },
  { id: 'vbet', name: 'Vbet' },
  { id: 'betsson', name: 'Betsson' },
  { id: 'nordicbet', name: 'NordicBet' },
  { id: 'mrgreen', name: 'Mr Green' },
  { id: 'betway', name: 'Betway' },
  { id: 'expekt', name: 'Expekt' },
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
