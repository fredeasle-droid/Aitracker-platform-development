import { NextResponse } from 'next/server'
import { fetchSportsGameOddsEvents } from '@/lib/sportsgameodds-dashboard'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  try {
    const result = await fetchSportsGameOddsEvents({
      leagueID: searchParams.get('leagueID') ?? undefined,
      cursor: searchParams.get('cursor') ?? undefined,
      limit: Number(searchParams.get('limit') ?? 100),
    })
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('[sportsgameodds-dashboard] request failed', error)
    return NextResponse.json({ ok: false, error: 'Kunne ikke hente SportsGameOdds-data' }, { status: 502 })
  }
}
