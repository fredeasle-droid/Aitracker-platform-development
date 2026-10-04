import { NextResponse } from 'next/server'
import { fetchArbitrageOpportunities } from '@/lib/sportsgameodds-arbitrage'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const leagueID = new URL(request.url).searchParams.get('leagueID') ?? 'EPL'
    return NextResponse.json({ ok: true, data: await fetchArbitrageOpportunities(leagueID) })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Kunne ikke beregne surebets' }, { status: 500 })
  }
}
