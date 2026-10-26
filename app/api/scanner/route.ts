import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { getLiveSurebets } from '@/lib/sportsgameodds'
import { scannerStatus } from '@/lib/odds-provider'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(scannerStatus())
}

export async function POST() {
  if (!process.env.SPORTSGAMEODDS_API_KEY) {
    return NextResponse.json({ ok: false, ...scannerStatus(), opportunities: [], error: 'SPORTSGAMEODDS_API_KEY is not configured' }, { status: 503 })
  }

  try {
    const live = await getLiveSurebets()
    const records = live.map((opportunity) => ({
      sport: opportunity.sport,
      country: opportunity.country,
      countryCode: opportunity.countryCode,
      league: opportunity.league,
      homeTeam: opportunity.homeTeam,
      awayTeam: opportunity.awayTeam,
      market: opportunity.market,
      kickoff: new Date(opportunity.kickoffTs),
      aLabel: opportunity.a.label,
      aBookmaker: opportunity.a.bookmaker,
      aOdds: opportunity.a.odds.toFixed(2),
      bLabel: opportunity.b.label,
      bBookmaker: opportunity.b.bookmaker,
      bOdds: opportunity.b.odds.toFixed(2),
    }))
    await db.transaction(async (tx) => {
      await tx.delete(opportunities)
      if (records.length > 0) await tx.insert(opportunities).values(records)
    })
    return NextResponse.json({ ok: true, ...scannerStatus(), count: records.length })
  } catch (error) {
    console.error('[scanner] odds refresh failed', error)
    return NextResponse.json({ ok: false, ...scannerStatus(), error: 'Could not refresh odds' }, { status: 502 })
  }
}
