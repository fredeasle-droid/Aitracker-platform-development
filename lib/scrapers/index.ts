import 'server-only'
import { scrapeBetHero } from './bethero-rows'
import { scrapeBetMonitor } from './betmonitor'
import { scrapeOddsator } from './oddsator'
import { scrapeSureBetsToday } from './surebets-today'
import { scrapeSureBetDanmark } from './surebetdanmark'
import { scrapeOddsJam } from './oddsjam'
import { isHockeySport, surebetIdentity, type ScrapedSurebet } from './types'
import { isAllowedBookmaker } from '@/lib/allowed-bookmakers'

export type SourceReport = { source: string; ok: boolean; count: number; error?: string }

// Every scanner source stays registered here. Flip `enabled` to switch one on or off,
// or set SCANNER_SOURCES (comma-separated names) in the environment to override the defaults.
const SOURCES = [
  { source: 'betmonitor', run: scrapeBetMonitor, enabled: true },
  { source: 'surebets-today', run: scrapeSureBetsToday, enabled: true },
  { source: 'oddsator', run: scrapeOddsator, enabled: true },
  { source: 'oddsjam', run: scrapeOddsJam, enabled: true },
  { source: 'bethero', run: scrapeBetHero, enabled: true },
  { source: 'surebetdanmark', run: scrapeSureBetDanmark, enabled: false },
]

function activeSources() {
  const override = process.env.SCANNER_SOURCES?.split(',').map((name) => name.trim().toLowerCase()).filter(Boolean)
  return SOURCES.filter((entry) => (override?.length ? override.includes(entry.source) : entry.enabled))
}

export async function scrapeAll() {
  const active = activeSources()
  const results = await Promise.allSettled(active.map((entry) => entry.run()))
  const reports: SourceReport[] = []
  const all: ScrapedSurebet[] = []

  results.forEach((result, index) => {
    const { source } = active[index]
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
    const key = surebetIdentity(item)
    const current = best.get(key)
    if (!current || item.profit > current.profit) best.set(key, item)
  }

  return { items: [...best.values()], reports }
}
