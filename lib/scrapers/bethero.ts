import 'server-only'
import WebSocket from 'ws'
import { zstdDecompressSync } from 'node:zlib'
import { decode as decodeMsgpack } from '@msgpack/msgpack'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sourceSnapshots } from '@/lib/db/schema'
import { displayBookmaker, displaySport, type ScrapedSurebet } from './types'

export const BETHERO_SOURCE = 'bethero'

const SOCKET_URL =
  'wss://ws-prematch.betherosports.com/ws/surebets?format=msgpack&compress=zstd&pin=1&formulas=2&view=1&sort=profit-desc&rows=30&touch=1'
const SOCKET_HEADERS = { Origin: 'https://betherosports.com', 'User-Agent': 'Mozilla/5.0' }
const SETTLE_AFTER_ROWS_MS = 800

function toBuffer(data: WebSocket.RawData) {
  if (Buffer.isBuffer(data)) return data
  if (Array.isArray(data)) return Buffer.concat(data)
  return Buffer.from(data)
}

function decodeBinaryMessage(data: WebSocket.RawData): unknown {
  const buffer = toBuffer(data)
  try {
    return decodeMsgpack(zstdDecompressSync(buffer))
  } catch {
    return decodeMsgpack(buffer)
  }
}

export class BetHeroSessionError extends Error {}

function hasRows(message: unknown) {
  if (Array.isArray(message)) return message.length > 0
  if (!message || typeof message !== 'object') return false
  return Object.values(message).some((value) => Array.isArray(value) && value.length > 0)
}

function describeValue(value: unknown, depth = 0): string {
  if (Array.isArray(value)) return `liste(${value.length})`
  if (value && typeof value === 'object') {
    if (depth >= 1) return 'objekt'
    return `{${Object.entries(value).map(([key, inner]) => `${key}: ${describeValue(inner, depth + 1)}`).join(', ')}}`
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return typeof value
}

export function describeBetHeroMessages(messages: unknown[]) {
  if (messages.length === 0) return 'Bet Hero sendte ingen beskeder inden for 8 sekunder.'
  const shapes = messages.slice(0, 4).map((message) => describeValue(message))
  return `Bet Hero sendte ${messages.length} beskeder: ${shapes.join(' | ')}`.slice(0, 400)
}

export function fetchBetHeroMessages(cookie: string, waitMs = 8000) {
  return new Promise<unknown[]>((resolve, reject) => {
    const messages: unknown[] = []
    const socket = new WebSocket(SOCKET_URL, { headers: { ...SOCKET_HEADERS, Cookie: cookie }, handshakeTimeout: 10_000 })
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let done = false

    const finish = (error?: Error) => {
      if (done) return
      done = true
      clearTimeout(deadline)
      clearTimeout(settleTimer)
      socket.removeAllListeners()
      socket.on('error', () => {})
      socket.terminate()
      if (error) reject(error)
      else resolve(messages)
    }

    const deadline = setTimeout(() => finish(), waitMs)

    socket.on('unexpected-response', (_request, response) => {
      if (response.statusCode === 401 || response.statusCode === 403) finish(new BetHeroSessionError('Bet Hero-sessionen er udløbet'))
      else finish(new Error(`Bet Hero svarede ${response.statusCode}`))
    })
    socket.on('error', (error) => finish(error))
    socket.on('close', () => finish())
    socket.on('message', (data, isBinary) => {
      let message: unknown
      try {
        if (isBinary) {
          message = decodeBinaryMessage(data)
        } else {
          const text = data.toString()
          if (text === 'Unauthorized') return finish(new BetHeroSessionError('Bet Hero-sessionen er udløbet'))
          message = JSON.parse(text)
        }
      } catch {
        messages.push(`ukendt format (${toBuffer(data).length} bytes)`)
        return
      }
      messages.push(message)
      if (hasRows(message)) {
        clearTimeout(settleTimer)
        settleTimer = setTimeout(() => finish(), SETTLE_AFTER_ROWS_MS)
      }
    })
  })
}

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
  if (Array.isArray(get(row, ['legs', 'outcomes', 'selections', 'bets', 'variants'])) || (get(row, ['adjusted_odds_1']) !== undefined && get(row, ['adjusted_odds_2']) !== undefined)) output.push(row)
  for (const [key, child] of Object.entries(row)) {
    if (['debug', 'headers', 'cookies'].includes(key.toLowerCase())) continue
    if (child && typeof child === 'object') candidates(child, output, depth + 1)
  }
  return output
}

function parse(row: Obj): ScrapedSurebet | null {
  const event = obj(get(row, ['event', 'fixture', 'match', 'game', 'event_data'])) ?? row
  const teams = obj(get(event, ['teams']))
  let home = text(get(event, ['homeTeam', 'home_team', 'home', 'team1', 'participant1', 'home_name', 'team_home']) ?? get(teams ?? {}, ['home', 'homeTeam', 'home_team']))
  let away = text(get(event, ['awayTeam', 'away_team', 'away', 'team2', 'participant2', 'away_name', 'team_away']) ?? get(teams ?? {}, ['away', 'awayTeam', 'away_team']))
  const eventName = text(get(event, ['event_name', 'eventName', 'match_name', 'matchName', 'fixture_name', 'event_title', 'match', 'name', 'title']))
  if ((!home || !away) && eventName) {
    const split = eventName.split(/\s+(?:vs?\.?|[-–—])\s+/i).map(s => s.trim())
    if (split.length === 2) [home, away] = split
  }
  const rawTime = get(event, ['startTime', 'start_time', 'start_date', 'startDate', 'kickoff', 'commenceTime', 'commence_time', 'date', 'timestamp', 'time', 'event_start', 'datetime', 'start_at'])
  const kickoff = typeof rawTime === 'number' ? new Date(rawTime < 1e10 ? rawTime * 1000 : rawTime) : new Date(text(rawTime))
  if (!home || !away || !Number.isFinite(kickoff.getTime()) || kickoff.getTime() < Date.now()) return null

  const isBetHeroShape = get(row, ['adjusted_odds_1']) !== undefined && get(row, ['adjusted_odds_2']) !== undefined
  const rawLegs = get(row, ['legs', 'outcomes', 'selections', 'bets', 'variants'])
  const legs = isBetHeroShape ? [1, 2].map((n) => {
    const books = get(row, [`books_${n}`])
    const firstBook = Array.isArray(books) ? obj(books[0]) : null
    const allBooks = get(row, ['book_names'])
    const bookmaker = text(get(firstBook ?? {}, ['name', 'bookmaker', 'book'])) || (Array.isArray(allBooks) ? text(allBooks[n - 1]) : '')
    const odds = number(get(row, [`adjusted_odds_${n}`]))
    const label = text(get(row, [`bet_name_short_${n}`, `bet_name_${n}`])) || `Udfald ${n}`
    return bookmaker && odds > 1 && Number.isFinite(odds) ? { label, bookmaker: displayBookmaker(bookmaker), odds } : null
  }).filter((v): v is NonNullable<typeof v> => v !== null) : (Array.isArray(rawLegs) ? rawLegs.map((v) => {
    const leg = obj(v)
    if (!leg) return null
    const bookmaker = text(get(leg, ['bookmaker', 'bookmakerName', 'bookmaker_name', 'site', 'provider', 'book']))
    const odds = number(get(leg, ['decimalOdds', 'decimal_odds', 'odds', 'odd', 'price', 'rate']))
    const label = text(get(leg, ['selection', 'label', 'outcome', 'name', 'side', 'marketOutcome'])) || 'Udfald'
    return bookmaker && odds > 1 && Number.isFinite(odds) ? { label, bookmaker: displayBookmaker(bookmaker.replace(/\s+DK$/i, '')), odds } : null
  }).filter((v): v is NonNullable<typeof v> => v !== null) : [])
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
    market: text(get(row, ['market', 'marketName', 'market_name', 'betType', 'bet_name_1'])) || '1X2',
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
