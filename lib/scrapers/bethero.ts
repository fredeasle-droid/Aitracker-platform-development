import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sourceSnapshots } from '@/lib/db/schema'
import { displayBookmaker, displaySport, type ScrapedSurebet } from './types'

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj | null => v && typeof v === 'object' && !Array.isArray(v) ? v as Obj : null
const get = (o: Obj, keys: string[]) => { for (const k of keys) if (o[k] !== undefined && o[k] !== null && o[k] !== '') return o[k]; return undefined }
const text = (v: unknown) => typeof v === 'string' || typeof v === 'number' ? String(v).trim() : ''
const number = (v: unknown) => typeof v === 'number' || typeof v === 'string' ? Number(v) : NaN

function candidates(value: unknown, output: Obj[] = [], depth = 0): Obj[] {
  if (depth > 8 || value == null) return output
  if (Array.isArray(value)) { for (const item of value) candidates(item, output, depth + 1); return output }
  const row = obj(value)
  if (!row) return output
  if (Array.isArray(get(row, ['legs', 'outcomes', 'selections', 'bets', 'variants']))) output.push(row)
  for (const [key, child] of Object.entries(row)) {
    if (['debug', 'headers', 'cookies'].includes(key.toLowerCase())) continue
    if (child && typeof child === 'object') candidates(child, output, depth + 1)
  }
  return output
}

function parse(row: Obj): ScrapedSurebet | null {
  const event = obj(get(row, ['event', 'fixture', 'match', 'game'])) ?? row
  const teams = obj(get(event, ['teams']))
  let home = text(get(event, ['homeTeam', 'home_team', 'home', 'team1', 'participant1']) ?? get(teams ?? {}, ['home', 'homeTeam', 'home_team']))
  let away = text(get(event, ['awayTeam', 'away_team', 'away', 'team2', 'participant2']) ?? get(teams ?? {}, ['away', 'awayTeam', 'away_team']))
  const eventName = text(get(event, ['name', 'title', 'matchName', 'match_name', 'eventName']))
  if ((!home || !away) && eventName) {
    const split = eventName.split(/\s+(?:vs?\.?|[-–—])\s+/i).map(s => s.trim())
    if (split.length === 2) [home, away] = split
  }
  const rawTime = get(event, ['startTime', 'start_time', 'kickoff', 'commenceTime', 'commence_time', 'date', 'timestamp'])
  const kickoff = typeof rawTime === 'number' ? new Date(rawTime < 1e10 ? rawTime * 1000 : rawTime) : new Date(text(rawTime))
  if (!home || !away || !Number.isFinite(kickoff.getTime()) || kickoff.getTime() < Date.now()) return null

  const rawLegs = get(row, ['legs', 'outcomes', 'selections', 'bets', 'variants'])
  if (!Array.isArray(rawLegs)) return null
  const legs = rawLegs.map((v) => {
    const leg = obj(v)
    if (!leg) return null
    const bookmaker = text(get(leg, ['bookmaker', 'bookmakerName', 'bookmaker_name', 'site', 'provider', 'book']))
    const odds = number(get(leg, ['decimalOdds', 'decimal_odds', 'odds', 'odd', 'price', 'rate']))
    const label = text(get(leg, ['selection', 'label', 'outcome', 'name', 'side', 'marketOutcome'])) || 'Udfald'
    return bookmaker && odds > 1 && Number.isFinite(odds) ? { label, bookmaker: displayBookmaker(bookmaker.replace(/\s+DK$/i, '')), odds } : null
  }).filter((v): v is NonNullable<typeof v> => v !== null)
  if (legs.length !== 2) return null
  const inv = 1 / legs[0].odds + 1 / legs[1].odds
  const calculated = (1 / inv - 1) * 100
  const reported = number(get(row, ['profitPercent', 'profit_percent', 'edgePercent', 'edge_percent', 'margin', 'roi']))
  const profit = Number.isFinite(reported) && reported > 0 && reported < 100 ? reported : calculated
  if (!(profit > 0) || profit > 25) return null
  return {
    source: 'bethero',
    homeTeam: home,
    awayTeam: away,
    league: text(get(event, ['league', 'competition', 'tournament'])) || 'Ukendt liga',
    sport: displaySport(text(get(event, ['sport', 'sportName', 'sport_name'])) || 'Fodbold'),
    market: text(get(row, ['market', 'marketName', 'market_name', 'betType'])) || '1X2',
    kickoff, profit, legs,
  }
}

export async function scrapeBetHeroSnapshot(): Promise<ScrapedSurebet[]> {
  const [snapshot] = await db.select({ payload: sourceSnapshots.payload }).from(sourceSnapshots).where(eq(sourceSnapshots.source, 'bethero')).limit(1)
  if (!snapshot?.payload) return []
  let payload: unknown
  try { payload = JSON.parse(snapshot.payload) } catch { return [] }
  const unique = new Map<string, ScrapedSurebet>()
  for (const row of candidates(payload)) {
    const item = parse(row)
    if (!item) continue
    const key = `${item.homeTeam}|${item.awayTeam}|${item.market}`.toLowerCase()
    const previous = unique.get(key)
    if (!previous || item.profit > previous.profit) unique.set(key, item)
  }
  return [...unique.values()]
}
