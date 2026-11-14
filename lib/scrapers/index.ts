import 'server-only'
import { scrapeBetMonitor } from './betmonitor'
import { scrapeOddsator } from './oddsator'
import { scrapeSureBetsToday } from './surebets-today'
import { scrapeOddsJam } from './oddsjam'
import { isHockeySport, type ScrapedSurebet } from './types'
import { isAllowedBookmaker } from '@/lib/allowed-bookmakers'

export type SourceReport = { source: string; ok: boolean; count: number; error?: string }

const SOURCES = [
  { source: 'betmonitor', run: scrapeBetMonitor },
  { source: 'surebets-today', run: scrapeSureBetsToday },
  { source: 'oddsator', run: scrapeOddsator },
  { source: 'oddsjam', run: scrapeOddsJam },
]

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
    if (isHockeySport(item.sport) && item.source !== 'oddsjam') continue
    if (item.legs.length !== 2 || item.profit <= 0 || item.kickoff.getTime() < now) continue
    if (!['surebetdanmark', 'bethero', 'oddsjam'].includes(item.source) && !item.legs.every((leg) => isAllowedBookmaker(leg.bookmaker))) continue
    const key = `${item.homeTeam}|${item.awayTeam}|${item.market}`.toLowerCase()
    const current = best.get(key)
    if (!current || item.profit > current.profit) best.set(key, item)
  }

  return { items: [...best.values()], reports }
}
