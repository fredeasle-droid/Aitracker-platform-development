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
    if (!message || typeof message !== 'object') continue
    for (const value of Object.values(message)) {
      if (Array.isArray(value)) rows.push(...value.slice(0, limit - rows.length))
      if (rows.length >= limit) return rows
    }
  }
  return rows
}

export async function saveBetHeroSnapshot(rawMessages: BrowserMessage[]) {
  const messages = rawMessages.map(decodeBrowserMessage)
  const rowCount = messages.reduce<number>((sum, message) => {
    if (!message || typeof message !== 'object') return sum
    const lists = Object.values(message).filter(Array.isArray) as unknown[][]
    return sum + lists.reduce((inner, list) => inner + list.length, 0)
  }, 0)
  const summary = describeBetHeroMessages(messages)
  const payload = JSON.stringify(messages, jsonSafe)
  const values = { payload, summary, rowCount, updatedAt: new Date() }
  await db
    .insert(sourceSnapshots)
    .values({ source: BETHERO_SNAPSHOT_SOURCE, ...values })
    .onConflictDoUpdate({ target: sourceSnapshots.source, set: values })
  return { rowCount, summary }
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

export function buildConsoleSnippet(ingestUrl: string) {
  return `(() => {
  const INGEST = ${JSON.stringify(ingestUrl)};
  const TOKEN = ${JSON.stringify(ingestToken())};
  const SOCKET = ${JSON.stringify(BETHERO_SOCKET_URL)};
  const toB64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let text = '';
    for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(text);
  };
  const run = () => {
    const messages = [];
    const socket = new WebSocket(SOCKET);
    socket.binaryType = 'arraybuffer';
    socket.onmessage = (event) => messages.push(typeof event.data === 'string' ? { text: event.data } : { b64: toB64(event.data) });
    socket.onerror = () => console.log('BetTracker: kunne ikke forbinde til Bet Hero');
    setTimeout(async () => {
      socket.close();
      try {
        const response = await fetch(INGEST, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, messages }) });
        console.log('BetTracker:', messages.length, 'beskeder sendt ->', await response.text());
      } catch (error) {
        console.log('BetTracker: kunne ikke sende til appen', error);
      }
    }, 6000);
  };
  clearInterval(window.__betTrackerTimer);
  run();
  window.__betTrackerTimer = setInterval(run, 60000);
  console.log('BetTracker: sender Bet Hero-data hvert minut. Stop med clearInterval(window.__betTrackerTimer)');
})();`
}
