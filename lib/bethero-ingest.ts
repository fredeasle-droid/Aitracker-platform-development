import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { zstdDecompressSync } from 'node:zlib'
import { decode as decodeMsgpack } from '@msgpack/msgpack'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sourceSnapshots } from '@/lib/db/schema'
import { describeBetHeroMessages } from '@/lib/scrapers/bethero'

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

export async function saveBetHeroMessages(messages: unknown[]) {
  const [existing] = await db.select({ payload: sourceSnapshots.payload }).from(sourceSnapshots).where(eq(sourceSnapshots.source, BETHERO_SNAPSHOT_SOURCE)).limit(1)
  let previous: unknown[] = []
  try {
    if (existing?.payload) previous = JSON.parse(existing.payload) as unknown[]
  } catch {}

  const merged = [...previous, ...messages]
  const unique = Array.from(new Map(merged.map((message) => [JSON.stringify(message, jsonSafe), message])).values()).slice(-200)
  const rowCount = unique.reduce<number>((sum, message) => {
    if (Array.isArray(message)) return sum + message.length
    if (!message || typeof message !== 'object') return sum
    const lists = Object.values(message).filter(Array.isArray) as unknown[][]
    return sum + lists.reduce((inner, list) => inner + list.length, 0)
  }, 0)
  const summary = describeBetHeroMessages(unique)
  const payload = JSON.stringify(unique, jsonSafe)
  const values = { payload, summary, rowCount, updatedAt: new Date() }
  await db
    .insert(sourceSnapshots)
    .values({ source: BETHERO_SNAPSHOT_SOURCE, ...values })
    .onConflictDoUpdate({ target: sourceSnapshots.source, set: values })
  return { rowCount, summary }
}

export async function getBetHeroSnapshotAgeMs() {
  const [row] = await db.select({ updatedAt: sourceSnapshots.updatedAt }).from(sourceSnapshots).where(eq(sourceSnapshots.source, BETHERO_SNAPSHOT_SOURCE)).limit(1)
  return row ? Date.now() - row.updatedAt.getTime() : Number.POSITIVE_INFINITY
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
