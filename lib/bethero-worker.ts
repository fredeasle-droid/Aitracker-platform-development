import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

export function workerToken() {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('BETTER_AUTH_SECRET mangler')
  return createHmac('sha256', secret).update('bethero-vps-worker-v1').digest('hex')
}

const PAIR_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'
const PAIR_WINDOW_MS = 30 * 60_000

function pairCodeFor(window: number) {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('BETTER_AUTH_SECRET mangler')
  const digest = createHmac('sha256', secret).update(`bethero-vps-pair-v1:${window}`).digest()
  return Array.from(digest.subarray(0, 8), (byte) => PAIR_ALPHABET[byte % PAIR_ALPHABET.length]).join('')
}

export function currentPairCode() {
  return pairCodeFor(Math.floor(Date.now() / PAIR_WINDOW_MS))
}

export function isValidPairCode(code: string) {
  const window = Math.floor(Date.now() / PAIR_WINDOW_MS)
  const given = Buffer.from(code.toLowerCase())
  return [window, window - 1].some((w) => {
    const expected = Buffer.from(pairCodeFor(w))
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}

export function isValidWorkerToken(request: Request) {
  const given = Buffer.from(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ?? '')
  const expected = Buffer.from(workerToken())
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export const WORKER_PACKAGE_JSON = JSON.stringify(
  { name: 'bettracker-bethero-worker', private: true, type: 'module', dependencies: { ws: '^8.18.0', '@msgpack/msgpack': '^3.0.0' } },
  null,
  2,
)

export const WORKER_SCRIPT = String.raw`import WebSocket from 'ws'
import { encode } from '@msgpack/msgpack'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const BASE = process.env.BETTRACKER_URL
const TOKEN = process.env.BETTRACKER_TOKEN
const FILTER_ID = process.env.BETHERO_FILTER_ID || 'zOUILG38'
const SOCKET_URL = 'wss://ws-prematch.betherosports.com/ws/surebets?format=msgpack&compress=zstd&pin=1&formulas=2&view=1&sort=profit-desc&rows=100&touch=1'
const FLUSH_MS = 20_000
const RESUBSCRIBE_MS = 5 * 60_000
const RECONNECT_MS = 4 * 60_000
// Bet Hero sends its full list (~2000 rows in ~100 messages) right after subscribing and only
// changes afterwards, so the buffer must be large enough to never drop that first burst.
const MAX_BUFFER = 3000
const CHUNK_SIZE = 100
const UPDATE_CHECK_MS = 10 * 60_000
const SELF_PATH = fileURLToPath(import.meta.url)

if (!BASE || !TOKEN) {
  console.error('BETTRACKER_URL og BETTRACKER_TOKEN mangler i /etc/bettracker-worker.env')
  process.exit(1)
}

const log = (...args) => console.log(new Date().toISOString(), ...args)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const auth = { Authorization: 'Bearer ' + TOKEN }

async function api(method, body) {
  const response = await fetch(BASE + '/api/worker/bethero', {
    method,
    headers: body ? { ...auth, 'Content-Type': 'application/json' } : auth,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  })
  const text = await response.text()
  if (!response.ok) throw new Error('BetTracker svarede ' + response.status + ': ' + text.slice(0, 200))
  return text
}

const reportStatus = (status) => api('POST', { status }).catch((error) => log('Kunne ikke sende status:', error.message))

function subscribeMessage() {
  return encode({
    filters: [FILTER_ID],
    ping: Date.now(),
    view: { sort: 'profit-desc', rows: 100, search: null, exhaustive: false, group: null, pin_leagues: null, pin_events: null, hide: [], id: 1 },
  })
}

let buffer = []
let flushing = false

async function flush() {
  if (flushing || !buffer.length) return
  flushing = true
  try {
    while (buffer.length) {
      const messages = buffer.slice(0, CHUNK_SIZE)
      try {
        log('Sendt:', await api('POST', { messages }))
        buffer = buffer.slice(messages.length)
      } catch (error) {
        log('Kunne ikke sende data:', error.message)
        break
      }
    }
  } finally {
    flushing = false
  }
}

setInterval(flush, FLUSH_MS)

async function checkForUpdate() {
  try {
    const response = await fetch(BASE + '/api/worker/bethero/script', { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) return
    const latest = await response.text()
    if (!latest.includes('WebSocket') || latest === readFileSync(SELF_PATH, 'utf8')) return
    writeFileSync(SELF_PATH, latest)
    log('Ny version hentet, genstarter')
    await flush()
    process.exit(0)
  } catch (error) {
    log('Kunne ikke tjekke for opdatering:', error.message)
  }
}

setInterval(checkForUpdate, UPDATE_CHECK_MS)

class SessionExpired extends Error {}

function runSocket(cookie) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(SOCKET_URL, {
      headers: { Origin: 'https://betherosports.com', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36', Cookie: cookie },
      handshakeTimeout: 15_000,
    })
    let alive = true
    const timers = []
    const stop = (error) => {
      timers.forEach(clearInterval)
      socket.removeAllListeners()
      socket.on('error', () => {})
      socket.terminate()
      error ? reject(error) : resolve()
    }

    socket.on('unexpected-response', (_request, response) => {
      stop(response.statusCode === 401 || response.statusCode === 403 ? new SessionExpired('Bet Hero-sessionen er udløbet') : new Error('Bet Hero svarede ' + response.statusCode))
    })
    socket.on('open', () => {
      log('Forbundet til Bet Hero')
      reportStatus('Forbundet til Bet Hero')
      socket.send(subscribeMessage())
      timers.push(setInterval(() => socket.send(subscribeMessage()), RESUBSCRIBE_MS))
      // Only a fresh connection makes Bet Hero resend the whole list; afterwards it keeps
      // refreshing just the top rows by profit, so lower-profit (often Danish) rows would go stale.
      timers.push(setTimeout(() => stop(), RECONNECT_MS))
      timers.push(setInterval(() => {
        if (!alive) return stop(new Error('Bet Hero svarer ikke'))
        alive = false
        socket.ping()
      }, 30_000))
    })
    socket.on('pong', () => { alive = true })
    socket.on('error', (error) => stop(error))
    socket.on('close', (code) => stop(new Error('Forbindelsen lukkede (' + code + ')')))
    socket.on('message', (data, isBinary) => {
      alive = true
      if (!isBinary) {
        const text = data.toString()
        if (text === 'Unauthorized') return stop(new SessionExpired('Bet Hero-sessionen er udløbet'))
        buffer.push({ text })
      } else {
        const bytes = Buffer.isBuffer(data) ? data : Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data)
        buffer.push({ b64: bytes.toString('base64') })
      }
      if (buffer.length > MAX_BUFFER) buffer.shift()
    })
  })
}

let backoff = 5_000
for (;;) {
  try {
    const { cookie } = JSON.parse(await api('GET'))
    if (!cookie) throw new SessionExpired('Ingen Bet Hero-cookie gemt på /kilder')
    const started = Date.now()
    await runSocket(cookie)
    if (Date.now() - started > 60_000) backoff = 5_000
  } catch (error) {
    log('Fejl:', error.message)
    if (error instanceof SessionExpired) {
      await reportStatus(error.message + '. Indsæt en ny cookie på /kilder. VPS prøver igen om 2 min.')
      await sleep(120_000)
      continue
    }
    await reportStatus('Genforbinder: ' + error.message)
  }
  await sleep(backoff)
  backoff = Math.min(backoff * 2, 120_000)
}
`

export function installScript(baseUrl: string, embeddedToken = '') {
  return `#!/usr/bin/env bash
set -euo pipefail

TOKEN="\${1:-${embeddedToken}}"
BASE="${baseUrl}"
DIR=/opt/bettracker-worker

if [[ ! "$TOKEN" =~ ^[a-f0-9]{64}$ ]]; then
  echo "Brug: curl -fsSL $BASE/api/worker/bethero/install | sudo bash -s -- DIN_NØGLE"
  exit 1
fi
if [ "$(id -u)" -ne 0 ]; then
  echo "Kør kommandoen med sudo."
  exit 1
fi

if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  echo "Installerer Node.js 22..."
  apt-get update -y
  apt-get install -y curl ca-certificates
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

id -u bettracker >/dev/null 2>&1 || useradd --system --home "$DIR" --shell /usr/sbin/nologin bettracker
mkdir -p "$DIR"
curl -fsSL "$BASE/api/worker/bethero/script" -o "$DIR/worker.mjs"
curl -fsSL "$BASE/api/worker/bethero/script?file=package" -o "$DIR/package.json"
(cd "$DIR" && npm install --omit=dev --no-audit --no-fund --silent)
chown -R bettracker:bettracker "$DIR"

umask 077
printf 'BETTRACKER_URL=%s\\nBETTRACKER_TOKEN=%s\\n' "$BASE" "$TOKEN" > /etc/bettracker-worker.env

cat > /etc/systemd/system/bettracker-worker.service <<'UNIT'
[Unit]
Description=BetTracker Bet Hero worker
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=bettracker
WorkingDirectory=/opt/bettracker-worker
EnvironmentFile=/etc/bettracker-worker.env
ExecStart=/usr/bin/env node /opt/bettracker-worker/worker.mjs
Restart=always
RestartSec=10
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/opt/bettracker-worker
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable bettracker-worker >/dev/null
systemctl restart bettracker-worker
sleep 5
systemctl --no-pager --lines=10 status bettracker-worker || true
echo
echo "Færdig. Workeren kører nu døgnet rundt og starter selv efter genstart."
echo "Se loggen med: journalctl -u bettracker-worker -f"
`
}
