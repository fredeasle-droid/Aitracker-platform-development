import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { refreshOpportunities } from '@/lib/scanner-sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  return NextResponse.json({
    configured: true,
    provider: 'scraper',
    sources: ['betmonitor', 'surebets-today', 'oddsator'],
  })
}

export async function POST(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const result = await refreshOpportunities()
    return NextResponse.json(result, { status: result.ok ? 200 : 502 })
  } catch (error) {
    console.error('[scanner] odds refresh failed', error)
    return NextResponse.json({ ok: false, error: 'Could not refresh odds' }, { status: 502 })
  }
}
