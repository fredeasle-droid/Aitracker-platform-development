import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { pool } from '@/lib/db'

const PURPOSE = 'oddsjam-ingest:v1'

function sign(userId: string) {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('BETTER_AUTH_SECRET is not set')
  return createHmac('sha256', secret).update(`${PURPOSE}:${userId}`).digest('base64url')
}

function ownerEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

export function isOwnerEmail(email: string | null | undefined) {
  return Boolean(email && ownerEmails().includes(email.toLowerCase()))
}

export function createOddsJamIngestToken(userId: string) {
  return `${Buffer.from(userId).toString('base64url')}.${sign(userId)}`
}

export async function verifyOddsJamIngestToken(token: string) {
  const [encodedId, signature] = token.split('.')
  if (!encodedId || !signature) return false
  const userId = Buffer.from(encodedId, 'base64url').toString('utf8')
  const expected = Buffer.from(sign(userId))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false
  // Re-check ownership so removing an email from ADMIN_EMAILS revokes its scripts.
  const { rows } = await pool.query<{ email: string }>('select email from "user" where id = $1', [userId])
  return isOwnerEmail(rows[0]?.email)
}
