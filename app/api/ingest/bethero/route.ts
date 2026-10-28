import { isValidIngestToken, saveBetHeroSnapshot, type BrowserMessage } from '@/lib/bethero-ingest'
import { recordBetHeroStatus } from '@/lib/bethero-cookie'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_BODY_BYTES = 8_000_000
const CORS = {
  'Access-Control-Allow-Origin': 'https://betherosports.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  Vary: 'Origin',
}

const reply = (body: string, status: number) => new Response(body, { status, headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } })

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(request: Request) {
  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return reply('For stor', 413)

  let body: { token?: unknown; messages?: unknown }
  try {
    body = JSON.parse(text)
  } catch {
    return reply('Ugyldig JSON', 400)
  }
  if (!isValidIngestToken(body.token)) return reply('Forkert nøgle', 401)
  if (!Array.isArray(body.messages)) return reply('Mangler beskeder', 400)

  try {
    const { rowCount, summary } = await saveBetHeroSnapshot(body.messages.slice(0, 200) as BrowserMessage[])
    await recordBetHeroStatus(`OK (fra browser): ${summary}`)
    return reply(`gemt, ${rowCount} rækker. ${summary}`, 200)
  } catch (error) {
    console.error('[bethero-ingest] failed', error)
    return reply('Kunne ikke gemme', 500)
  }
}
