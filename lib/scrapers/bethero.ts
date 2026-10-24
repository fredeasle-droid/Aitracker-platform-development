import WebSocket from 'ws'

export const BETHERO_SOURCE = 'bethero'

const SOCKET_URL = 'wss://ws-prematch.betherosports.com/ws/surebets?pin=1&view=1&rows=100&sort=profit-desc'
const SOCKET_HEADERS = { Origin: 'https://betherosports.com', 'User-Agent': 'Mozilla/5.0' }
const SETTLE_AFTER_ROWS_MS = 800

export class BetHeroSessionError extends Error {}

function hasRows(message: unknown) {
  if (!message || typeof message !== 'object') return false
  return Object.values(message).some((value) => Array.isArray(value) && value.length > 0)
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
    socket.on('open', () => socket.send(JSON.stringify({ filters: [], ping: Date.now() })))
    socket.on('error', (error) => finish(error))
    socket.on('close', () => finish())
    socket.on('message', (data, isBinary) => {
      if (isBinary) return
      const text = data.toString()
      if (text === 'Unauthorized') return finish(new BetHeroSessionError('Bet Hero-sessionen er udløbet'))
      try {
        const message: unknown = JSON.parse(text)
        messages.push(message)
        if (hasRows(message)) {
          clearTimeout(settleTimer)
          settleTimer = setTimeout(() => finish(), SETTLE_AFTER_ROWS_MS)
        }
      } catch {
        // Ikke-JSON-beskeder som "Unavailable" ignoreres.
      }
    })
  })
}
