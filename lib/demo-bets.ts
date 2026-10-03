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

export function isDemoOpportunityId(id: number) {
  return id >= 9001 && id <= 9004
}
