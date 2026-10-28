import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { syncBetHero } from '@/lib/bethero-sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// The GitHub Actions schedule calls this without a secret (GitHub secrets are unavailable),
// so unauthenticated calls are throttled and never expose scraped data.
export async function GET(request: Request) {
  const authorized = isAuthorizedScan(request)
  const result = await syncBetHero({ authorized })
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
  if (result.skipped) return NextResponse.json({ ok: true, skipped: true })
  return NextResponse.json(authorized ? { ok: true, ...result.saved, summary: result.summary } : { ok: true })
}
