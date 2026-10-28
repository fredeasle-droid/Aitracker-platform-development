import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { zstdDecompressSync } from 'node:zlib'
import { decode as decodeMsgpack } from '@msgpack/msgpack'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sourceSnapshots } from '@/lib/db/schema'

export const BETHERO_SNAPSHOT_SOURCE = 'bethero'
export const BETHERO_SOCKET_URL =
  'wss://ws-prematch.betherosports.com/surebets?format=msgpack&compress=zstd&pin=1&formulas=2&view=1&sort=event-asc&rows=30&touch=1'

export type BrowserMessage = { b64?: string; text?: string }

export function ingestToken() {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('BETTER_AUTH_SECRET mangler')
  return createHmac('sha256', secret).update('bethero-ingest-v1').digest('hex')
}

export function isValidIngestToken(candidate: unknown) {
  if (typeof candidate !== 'string') return false
  const expected = Buffer.from(ingestToken())
  const given = Buffer.from(candidate)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

function decodeBrowserMessage(message: BrowserMessage): unknown {
  if (typeof message.text === 'string') {
    try {
      return JSON.parse(message.text)
    } catch {
      return message.text.slice(0, 200)
    }
  }
  if (typeof message.b64 !== 'string') return null
  const buffer = Buffer.from(message.b64, 'base64')
  try {
    return decodeMsgpack(zstdDecompressSync(buffer))
  } catch {
    try {
      return decodeMsgpack(buffer)
    } catch {
      return `ukendt format (${buffer.length} bytes)`
    }
  }
}

const jsonSafe = (_key: string, value: unknown) => (typeof value === 'bigint' ? value.toString() : value)

export function firstRows(messages: unknown[], limit = 2) {
  const rows: unknown[] = []
  for (const message of messages) {
    if (Array.isArray(message)) {
      rows.push(...message.slice(0, limit - rows.length))
    } else if (message && typeof message === 'object') {
      for (const value of Object.values(message)) {
        if (Array.isArray(value)) rows.push(...value.slice(0, limit - rows.length))
        if (rows.length >= limit) return rows
      }
    }
    if (rows.length >= limit) return rows
  }
  return rows
}

export async function saveBetHeroSnapshot(rawMessages: BrowserMessage[]) {
  return saveBetHeroMessages(rawMessages.map(decodeBrowserMessage))
}

type StoredRow = {
  _id?: string
  parent_id?: string
  event?: string
  books_1?: unknown
  market_1?: string
  bet_name_1?: string
  profit?: number
  start?: number
  live?: boolean
  seenAt?: number
  fresh_until?: number
}

const ROW_TTL_MS = 3 * 60 * 60_000
// Bet Hero keeps re-sending rows that still exist (each one is fresh for about a minute),
// so a row that has not been refreshed for this long has vanished from Bet Hero.
const STALE_AFTER_FRESH_MS = 10 * 60_000

function freshUntilMs(row: StoredRow) {
  const value = Number(row.fresh_until)
  if (!Number.isFinite(value) || value <= 0) return null
  return value > 1e12 ? value : value * 1000
}

function isStaleRow(row: StoredRow, now: number) {
  const freshUntil = freshUntilMs(row)
  return freshUntil !== null && now - freshUntil > STALE_AFTER_FRESH_MS
}
const MAX_STORED_ROWS = 1500
const FULL_LIST_MIN_ROWS = 25

const rowKey = (row: StoredRow) => row._id ?? `${row.parent_id ?? row.event}|${row.market_1}|${row.bet_name_1}`

// Bet Hero only sends a row when it changes and announces removals in `gone`,
// so the current state has to be rebuilt from every message, not just the latest ones.
function applyMessage(state: Map<string, StoredRow>, message: unknown, now: number, touched?: Set<string>) {
  if (Array.isArray(message)) {
    for (const item of message) {
      if (Array.isArray(item)) applyMessage(state, item, now, touched)
      else if (item && typeof item === 'object') {
        const row = item as StoredRow
        if (typeof row.event === 'string' && row.books_1) {
          const key = rowKey(row)
          state.set(key, { ...row, seenAt: row.seenAt ?? now })
          touched?.add(key)
        }
      }
    }
  } else if (message && typeof message === 'object') {
    const gone = (message as { gone?: unknown }).gone
    if (Array.isArray(gone)) for (const id of gone) if (typeof id === 'string') state.delete(id)
  }
}

export async function saveBetHeroMessages(messages: unknown[]) {
  const [existing] = await db.select({ payload: sourceSnapshots.payload, updatedAt: sourceSnapshots.updatedAt }).from(sourceSnapshots).where(eq(sourceSnapshots.source, BETHERO_SNAPSHOT_SOURCE)).limit(1)
  let previous: unknown[] = []
  try {
    if (existing?.payload) previous = JSON.parse(existing.payload) as unknown[]
  } catch {}

  const now = Date.now()
  const state = new Map<string, StoredRow>()
  for (const message of previous) applyMessage(state, message, existing?.updatedAt.getTime() ?? now)
  const before = state.size
  const touched = new Set<string>()
  for (const message of messages) applyMessage(state, message, now, touched)

  // The feed is sorted by profit, so a full list (many rows in one batch) must contain every
  // stored row at or above its lowest profit. Anything missing from it is gone from Bet Hero,
  // even when no `gone` message arrived.
  if (touched.size >= FULL_LIST_MIN_ROWS) {
    const lowest = Math.min(...[...touched].map((key) => Number(state.get(key)?.profit ?? Infinity)))
    for (const [key, row] of state) if (!touched.has(key) && Number(row.profit ?? 0) >= lowest) state.delete(key)
  }

  for (const [key, row] of state) {
    const kickedOff = !row.start || row.start * 1000 < now
    if (row.live || kickedOff || isStaleRow(row, now) || now - (row.seenAt ?? now) > ROW_TTL_MS) state.delete(key)
  }

  const rows = [...state.values()].sort((a, b) => Number(b.profit ?? 0) - Number(a.profit ?? 0)).slice(0, MAX_STORED_ROWS)
  const lastTotal = [...messages].reverse().find((message) => message && typeof message === 'object' && !Array.isArray(message) && 'total' in message)
  const stored: unknown[] = lastTotal ? [rows, lastTotal] : [rows]
  const top = rows[0] ? `, højeste ${Number(rows[0].profit).toFixed(1)}%` : ''
  const summary = `Bet Hero: ${rows.length} rækker gemt (${messages.length} nye beskeder, før ${before})${top}`
  const payload = JSON.stringify(stored, jsonSafe)
  const values = { payload, summary, rowCount: rows.length, updatedAt: new Date() }
  await db
    .insert(sourceSnapshots)
    .values({ source: BETHERO_SNAPSHOT_SOURCE, ...values })
    .onConflictDoUpdate({ target: sourceSnapshots.source, set: values })
  return { rowCount: rows.length, summary }
}

export async function getBetHeroSnapshotAgeMs() {
  const [row] = await db.select({ updatedAt: sourceSnapshots.updatedAt }).from(sourceSnapshots).where(eq(sourceSnapshots.source, BETHERO_SNAPSHOT_SOURCE)).limit(1)
  return row ? Date.now() - row.updatedAt.getTime() : Number.POSITIVE_INFINITY
}

export async function getBetHeroMessages() {
  const [row] = await db.select({ payload: sourceSnapshots.payload }).from(sourceSnapshots).where(eq(sourceSnapshots.source, BETHERO_SNAPSHOT_SOURCE)).limit(1)
  if (!row) return []
  try {
    const messages = JSON.parse(row.payload) as unknown[]
    const now = Date.now()
    return messages.map((message, index) => (index === 0 && Array.isArray(message) ? (message as StoredRow[]).filter((item) => !isStaleRow(item, now)) : message))
  } catch {
    return []
  }
}

export async function getBetHeroSnapshot() {
  const [row] = await db.select().from(sourceSnapshots).where(eq(sourceSnapshots.source, BETHERO_SNAPSHOT_SOURCE)).limit(1)
  if (!row) return null
  let messages: unknown[] = []
  try {
    messages = JSON.parse(row.payload) as unknown[]
  } catch {}
  return { updatedAt: row.updatedAt, summary: row.summary, rowCount: row.rowCount, sample: JSON.stringify(firstRows(messages), jsonSafe, 1).slice(0, 2500) }
}

export function buildConsoleSnippet(bridgeUrl: string) {
  return `(() => {
  const BRIDGE = ${JSON.stringify(bridgeUrl)};
  const BRIDGE_ORIGIN = new URL(BRIDGE).origin;
  const TOKEN = ${JSON.stringify(ingestToken())};
  const MAX_MESSAGES = 60;
  const toB64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let text = '';
    for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(text);
  };
  let pending = null;
  const send = () => {
    const popup = window.__betTrackerPopup;
    if (!pending || !popup || popup.closed) return;
    popup.postMessage({ type: 'bettracker', token: TOKEN, messages: pending }, BRIDGE_ORIGIN);
    pending = null;
  };
  const openBridge = () => {
    window.__betTrackerPopup = window.open(BRIDGE, 'bettracker-bridge', 'width=460,height=360');
    if (!window.__betTrackerPopup) console.log('BetTracker: Chrome blokerede vinduet. Tillad pop-ups for betherosports.com og kør koden igen.');
  };
  const deliver = (messages) => {
    pending = messages;
    const popup = window.__betTrackerPopup;
    if (popup && !popup.closed) send();
    else openBridge();
  };
  if (window.__betTrackerListener) window.removeEventListener('message', window.__betTrackerListener);
  window.__betTrackerListener = (event) => {
    if (event.origin !== BRIDGE_ORIGIN || !event.data) return;
    if (event.data.type === 'bettracker-ready') send();
    if (event.data.type === 'bettracker-result') console.log('BetTracker:', event.data.text);
  };
  window.addEventListener('message', window.__betTrackerListener);
  if (window.__betTrackerNative) window.WebSocket = window.__betTrackerNative;
  else window.__betTrackerNative = window.WebSocket;
  const Native = window.__betTrackerNative;
  if (window.__betTrackerStop) window.__betTrackerStop();
  clearInterval(window.__betTrackerTimer);
  const nativeSend = window.__betTrackerSend || Native.prototype.send;
  window.__betTrackerSend = nativeSend;
  const seen = new WeakSet();
  let buffer = [];
  let flushTimer = null;
  let lastFlush = 0;
  const flush = () => {
    flushTimer = null;
    lastFlush = Date.now();
    const parts = buffer;
    buffer = [];
    Promise.all(parts).then((messages) => {
      console.log('BetTracker:', messages.length, 'beskeder hentet fra Bet Hero');
      if (messages.length) deliver(messages);
    });
  };
  let current = null;
  const attach = (socket) => {
    if (seen.has(socket)) return;
    seen.add(socket);
    current = socket;
    buffer = [];
    console.log('BetTracker: fandt Bet Hero-forbindelsen, samler data');
    socket.addEventListener('message', (event) => {
      if (socket !== current) return;
      buffer.push(Promise.resolve(event.data instanceof Blob ? event.data.arrayBuffer() : event.data).then((data) => (typeof data === 'string' ? { text: data } : { b64: toB64(data) })));
      if (buffer.length > MAX_MESSAGES) buffer.shift();
      if (!flushTimer) flushTimer = setTimeout(flush, Math.max(4000, 60000 - (Date.now() - lastFlush)));
    });
  };
  Native.prototype.send = function (...args) {
    if (String(this.url).includes('surebets')) attach(this);
    return nativeSend.apply(this, args);
  };
  window.__betTrackerStop = () => {
    Native.prototype.send = nativeSend;
    clearTimeout(flushTimer);
  };
  openBridge();
  const findTab = (label) => Array.from(document.querySelectorAll('button')).find((button) => button.textContent.trim().toLowerCase() === label);
  const refresh = () => {
    const live = findTab('live');
    const prematch = findTab('prematch');
    if (!live || !prematch) {
      console.log('BetTracker: fandt ikke Prematch/Live-knapperne. Skift selv et filter på siden.');
      return;
    }
    live.click();
    setTimeout(() => prematch.click(), 2500);
  };
  setTimeout(refresh, 1500);
  console.log('BetTracker: klar. Koden skifter selv kort til Live og tilbage til Prematch for at fange data. Stop med window.__betTrackerStop()');
})();`
}
