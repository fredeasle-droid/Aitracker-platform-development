import 'server-only'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { scraperSessions } from '@/lib/db/schema'

function encryptionKey() {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('BETTER_AUTH_SECRET mangler')
  return createHash('sha256').update(secret).digest()
}

function encrypt(plain: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return [iv, cipher.getAuthTag(), body].map((part) => part.toString('base64')).join('.')
}

function decrypt(payload: string) {
  const [iv, tag, body] = payload.split('.').map((part) => Buffer.from(part, 'base64'))
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8')
}

export async function getStoredCookie(source: string) {
  const [row] = await db.select().from(scraperSessions).where(eq(scraperSessions.source, source)).limit(1)
  if (!row) return null
  try {
    return decrypt(row.cookieEnc)
  } catch {
    return null
  }
}

export async function saveStoredCookie(source: string, cookie: string, status: string) {
  const now = new Date()
  const values = { cookieEnc: encrypt(cookie), updatedAt: now, lastStatus: status, lastCheckedAt: now }
  await db.insert(scraperSessions).values({ source, ...values }).onConflictDoUpdate({ target: scraperSessions.source, set: values })
}

export async function recordSessionStatus(source: string, status: string) {
  await db.update(scraperSessions).set({ lastStatus: status, lastCheckedAt: new Date() }).where(eq(scraperSessions.source, source))
}

export async function getSessionInfo(source: string) {
  const [row] = await db
    .select({ updatedAt: scraperSessions.updatedAt, lastStatus: scraperSessions.lastStatus, lastCheckedAt: scraperSessions.lastCheckedAt })
    .from(scraperSessions)
    .where(eq(scraperSessions.source, source))
    .limit(1)
  return row ?? null
}

export function cleanCookieInput(raw: string) {
  return raw
    .replace(/\s*\r?\n\s*/g, '')
    .replace(/^-H\s+/i, '')
    .replace(/^['"]|['"]$/g, '')
    .replace(/^cookie:\s*/i, '')
    .trim()
}

export function parseCookieHeader(header: string) {
  const cookies = new Map<string, string>()
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index <= 0) continue
    cookies.set(part.slice(0, index).trim(), part.slice(index + 1).trim())
  }
  return cookies
}

export function serializeCookies(cookies: Map<string, string>) {
  return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ')
}

// Applies Set-Cookie headers from a response so rotated session tokens are kept.
export function applySetCookies(cookies: Map<string, string>, setCookies: string[]) {
  let changed = false
  for (const line of setCookies) {
    const [pair, ...attributes] = line.split(';').map((part) => part.trim())
    const index = pair.indexOf('=')
    if (index <= 0) continue
    const name = pair.slice(0, index)
    const value = pair.slice(index + 1)
    const expired = attributes.some((attribute) => {
      const lower = attribute.toLowerCase()
      if (lower === 'max-age=0' || lower.startsWith('max-age=-')) return true
      if (lower.startsWith('expires=')) return new Date(attribute.slice(8)).getTime() < Date.now()
      return false
    })
    if (expired || value === '') {
      changed = cookies.delete(name) || changed
    } else if (cookies.get(name) !== value) {
      cookies.set(name, value)
      changed = true
    }
  }
  return changed
}
