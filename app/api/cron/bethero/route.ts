import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { fetchBetHeroMessages, describeBetHeroMessages } from '@/lib/scrapers/bethero'
import { saveBetHeroMessages } from '@/lib/bethero-ingest'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const cookie = process.env.BETHERO_COOKIE?.trim()
  if (!cookie) return NextResponse.json({ ok: false, error: 'BETHERO_COOKIE is missing' }, { status: 503 })
  try {
    const messages = await fetchBetHeroMessages(cookie)
    const saved = await saveBetHeroMessages(messages)
    return NextResponse.json({ ok: true, ...saved, summary: describeBetHeroMessages(messages) })
  } catch (error) {
    console.error('[bethero] cron refresh failed', error)
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Bet Hero refresh failed' }, { status: 502 })
  }
}
