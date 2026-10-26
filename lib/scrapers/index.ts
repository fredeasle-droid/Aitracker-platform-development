import 'server-only'
import { scrapeBetMonitor } from './betmonitor'
import { scrapeBetHeroSnapshot } from './bethero'
import { scrapeOddsator } from './oddsator'
import { scrapeSureBetDanmark } from './surebetdanmark'
import { scrapeSureBetsToday } from './surebets-today'
import type { ScrapedSurebet } from './types'
import { isAllowedBookmaker } from '@/lib/allowed-bookmakers'

export type SourceReport = { source: string; ok: boolean; count: number; error?: string }

const SOURCES = [
  { source: 'betmonitor', run: scrapeBetMonitor },
  { source: 'bethero', run: scrapeBetHeroSnapshot },
  { source: 'surebets-today', run: scrapeSureBetsToday },
  { source: 'oddsator', run: scrapeOddsator },
  { source: 'surebetdanmark', run: scrapeSureBetDanmark },
]

const MAX_PROFIT_PERCENT = 25

export async function scrapeAll() {
  const results = await Promise.allSettled(SOURCES.map((entry) => entry.run()))
  const reports: SourceReport[] = []
  const all: ScrapedSurebet[] = []

  results.forEach((result, index) => {
    const { source } = SOURCES[index]
    if (result.status === 'fulfilled') {
      reports.push({ source, ok: true, count: result.value.length })
      all.push(...result.value)
    } else {
      reports.push({ source, ok: false, count: 0, error: result.reason instanceof Error ? result.reason.message : 'Ukendt fejl' })
    }
  })

  const now = Date.now()
  const best = new Map<string, ScrapedSurebet>()
  for (const item of all) {
    if (item.legs.length !== 2 || item.profit <= 0 || item.profit > MAX_PROFIT_PERCENT || item.kickoff.getTime() < now) continue
    if (item.source !== 'surebetdanmark' && item.source !== 'bethero' && !item.legs.every((leg) => isAllowedBookmaker(leg.bookmaker))) continue
    const key = `${item.homeTeam}|${item.awayTeam}|${item.market}`.toLowerCase()
    const current = best.get(key)
    if (!current || item.profit > current.profit) best.set(key, item)
  }

  return { items: [...best.values()], reports }
}
