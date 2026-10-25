import WebSocket from 'ws'
import { zstdDecompressSync } from 'node:zlib'
import { decode as decodeMsgpack } from '@msgpack/msgpack'

export const BETHERO_SOURCE = 'bethero'

const SOCKET_URL =
  'wss://ws-prematch.betherosports.com/surebets?format=msgpack&compress=zstd&pin=1&formulas=2&view=1&sort=event-asc&rows=30&touch=1'
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
