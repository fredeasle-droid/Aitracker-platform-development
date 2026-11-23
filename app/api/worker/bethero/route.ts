import { NextResponse } from 'next/server'
import { recordBetHeroStatus, resolveBetHeroCookie } from '@/lib/bethero-cookie'
import { saveBetHeroSnapshot, type BrowserMessage } from '@/lib/bethero-ingest'
import { isValidWorkerToken } from '@/lib/bethero-worker'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_BODY_BYTES = 8_000_000

export async function GET(request: Request) {
  if (!isValidWorkerToken(request)) return new Response('Forkert nøgle', { status: 401 })
  const cookie = await resolveBetHeroCookie()
  return NextResponse.json({ cookie }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  if (!isValidWorkerToken(request)) return new Response('Forkert nøgle', { status: 401 })
  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return new Response('For stor', { status: 413 })

  let body: { messages?: unknown; status?: unknown }
  try {
    body = JSON.parse(text)
  } catch {
    return new Response('Ugyldig JSON', { status: 400 })
  }

  if (typeof body.status === 'string') {
    await recordBetHeroStatus(`VPS: ${body.status}`.slice(0, 300))
    return new Response('ok')
  }
  if (!Array.isArray(body.messages)) return new Response('Mangler beskeder', { status: 400 })

  try {
    const { rowCount, summary } = await saveBetHeroSnapshot(body.messages.slice(-200) as BrowserMessage[])
    await recordBetHeroStatus(`OK (VPS): ${summary}`)
    return new Response(`gemt, ${rowCount} rækker`)
  } catch (error) {
    console.error('[bethero-worker] failed', error)
    return new Response('Kunne ikke gemme', { status: 500 })
  }
}
