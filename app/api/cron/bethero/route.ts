import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { fetchBetHeroMessages, describeBetHeroMessages } from '@/lib/scrapers/bethero'
import { saveBetHeroMessages } from '@/lib/bethero-ingest'
import { recordBetHeroStatus, resolveBetHeroCookie } from '@/lib/bethero-cookie'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const cookie = await resolveBetHeroCookie()
  if (!cookie) return NextResponse.json({ ok: false, error: 'Ingen Bet Hero-cookie gemt under Kilder' }, { status: 503 })
  try {
    const messages = await fetchBetHeroMessages(cookie)
    const saved = await saveBetHeroMessages(messages)
    const summary = describeBetHeroMessages(messages)
    await recordBetHeroStatus(`OK: ${summary}`)
    return NextResponse.json({ ok: true, ...saved, summary })
  } catch (error) {
    console.error('[bethero] cron refresh failed', error)
    const message = error instanceof Error ? error.message : 'Bet Hero refresh failed'
    await recordBetHeroStatus(`Fejl: ${message}`)
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}
