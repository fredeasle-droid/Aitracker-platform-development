import type { BetRow } from '@/lib/data'

const globalStore = globalThis as typeof globalThis & {
  __bettrackerDemoBets?: Map<string, BetRow[]>
}

const store = globalStore.__bettrackerDemoBets ?? new Map<string, BetRow[]>()
globalStore.__bettrackerDemoBets = store

export function addDemoBet(userId: string, bet: BetRow) {
  const existing = store.get(userId) ?? []
  store.set(userId, [bet, ...existing])
}

export function getDemoBets(userId: string) {
  return store.get(userId) ?? []
}

export function updateDemoBet(
  userId: string,
  id: number,
  update: Partial<Pick<BetRow, 'status' | 'profit' | 'expectedProfit' | 'placedTs' | 'dateLabel' | 'kickoffLabel'>>,
) {
  const existing = store.get(userId) ?? []
  const index = existing.findIndex((bet) => bet.id === id)
  if (index < 0) return false
  const next = [...existing]
  next[index] = { ...next[index], ...update }
  store.set(userId, next)
  return true
}

export function isDemoOpportunityId(id: number) {
  return id >= 9001 && id <= 9004
}
