import { NextResponse, type NextRequest } from 'next/server'
import { resolveMatchLink } from '@/lib/bookmaker-links'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const bookmaker = params.get('bookmaker')?.slice(0, 60)
  const home = params.get('home')?.slice(0, 80)
  const away = params.get('away')?.slice(0, 80)
  const kickoff = Number(params.get('kickoff')) || 0

  if (!bookmaker || !home || !away) {
    return NextResponse.json({ error: 'Mangler parametre' }, { status: 400 })
  }

  const link = await resolveMatchLink(bookmaker, home, away, kickoff)
  return NextResponse.json(link, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } })
}
