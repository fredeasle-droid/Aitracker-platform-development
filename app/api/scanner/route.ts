import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { scanLiveOpportunities, scannerStatus } from '@/lib/odds-provider'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(scannerStatus())
}

export async function POST() {
  if (!process.env.ODDS_API_KEY) {
    return NextResponse.json({ ok: false, ...scannerStatus(), opportunities: [], error: 'ODDS_API_KEY is not configured' }, { status: 503 })
  }

  try {
    const live = await scanLiveOpportunities()
    await db.transaction(async (tx) => {
      await tx.delete(opportunities)
      if (live.length > 0) await tx.insert(opportunities).values(live)
    })
    return NextResponse.json({ ok: true, ...scannerStatus(), count: live.length })
  } catch (error) {
    console.error('[scanner] odds refresh failed', error)
    return NextResponse.json({ ok: false, ...scannerStatus(), error: 'Could not refresh odds' }, { status: 502 })
  }
}
