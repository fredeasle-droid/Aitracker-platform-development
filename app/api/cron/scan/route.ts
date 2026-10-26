import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { refreshOpportunities } from '@/lib/scanner-sync'
import { refreshTeamLogos } from '@/lib/team-logos'
import { fetchBetHeroMessages, describeBetHeroMessages } from '@/lib/scrapers/bethero'
import { saveBetHeroMessages } from '@/lib/bethero-ingest'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [result, bethero] = await Promise.all([
      refreshOpportunities(),
      (async () => {
        const cookie = process.env.BETHERO_COOKIE?.trim()
        if (!cookie) return { ok: false, error: 'BETHERO_COOKIE is missing' }
        try {
          const messages = await fetchBetHeroMessages(cookie)
          const saved = await saveBetHeroMessages(messages)
          return { ok: true, ...saved, summary: describeBetHeroMessages(messages) }
        } catch (error) {
          console.error('[bethero] shared cron refresh failed', error)
          return { ok: false, error: error instanceof Error ? error.message : 'Bet Hero refresh failed' }
        }
      })(),
    ])
    const logos = await refreshTeamLogos().catch((error) => {
      console.error('[logos] cron logo refresh failed', error)
      return null
    })
    return NextResponse.json({ ...result, bethero, logos }, { status: result.ok ? 200 : 502 })
  } catch (error) {
    console.error('[scanner] cron refresh failed', error)
    return NextResponse.json({ ok: false, error: 'Could not refresh odds' }, { status: 502 })
  }
}
