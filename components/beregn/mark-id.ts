import type { BookmakerId } from '@/components/sb/data'

/** Mirrors bookmakerKey in lib/sb-data (server-only) so a bookmaker name maps to the same BookmakerMark id. */
export const markId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '') as BookmakerId
