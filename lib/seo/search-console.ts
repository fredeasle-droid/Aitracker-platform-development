import 'server-only'
import { createSign } from 'node:crypto'

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'

export type SearchConsoleConfig = { email: string; privateKey: string; siteUrl: string }
export type SearchAnalyticsRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }

export function getSearchConsoleConfig(): SearchConsoleConfig | null {
  const email = process.env.GSC_CLIENT_EMAIL?.trim()
  // Vercel env vars often store the PEM with literal "\n" sequences.
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, '\n').trim()
  if (!email || !privateKey) return null
  return { email, privateKey, siteUrl: process.env.GSC_SITE_URL?.trim() || 'sc-domain:bettrackerai.com' }
}

async function getAccessToken({ email, privateKey }: SearchConsoleConfig) {
  const now = Math.floor(Date.now() / 1000)
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(privateKey).toString('base64url')

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
    cache: 'no-store',
  })
  const data = (await response.json().catch(() => ({}))) as { access_token?: string; error_description?: string; error?: string }
  if (!response.ok || !data.access_token) throw new Error(`Google-login fejlede: ${data.error_description ?? data.error ?? response.status}`)
  return data.access_token
}

export async function querySearchAnalytics(
  config: SearchConsoleConfig,
  request: { startDate: string; endDate: string; dimensions: ('date' | 'query' | 'page')[]; rowLimit?: number; startRow?: number },
  token?: string,
) {
  const accessToken = token ?? (await getAccessToken(config))
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
      body: JSON.stringify({ dataState: 'all', rowLimit: 25000, ...request }),
      cache: 'no-store',
    },
  )
  const data = (await response.json().catch(() => ({}))) as { rows?: SearchAnalyticsRow[]; error?: { message?: string } }
  if (!response.ok) throw new Error(`Search Console svarede ${response.status}: ${data.error?.message ?? 'ukendt fejl'}`)
  return { rows: data.rows ?? [], token: accessToken }
}
