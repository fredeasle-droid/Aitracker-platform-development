import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.ODDSPAPI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ODDSPAPI_API_KEY mangler i projektets miljø.' }, { status: 503 })

  const params = new URL(request.url).searchParams
  const fixtureId = params.get('fixtureId')
  if (!fixtureId) {
    const sportId = params.get('sportId') || '10'
    const bookmaker = params.get('bookmaker') || 'pinnacle'
    const tournamentsParams = new URLSearchParams({ sportId, apiKey })
    const tournamentsResponse = await fetch(`https://api.oddspapi.io/v4/tournaments?${tournamentsParams.toString()}`, { cache: 'no-store' })
    const tournamentsText = await tournamentsResponse.text()
    let tournaments: any
    try { tournaments = JSON.parse(tournamentsText) } catch { tournaments = { raw: tournamentsText } }
    const tournamentIds = (Array.isArray(tournaments) ? tournaments : tournaments?.data ?? tournaments?.tournaments ?? [])
      .map((t: any) => t.tournamentId ?? t.id)
      .filter(Boolean)
      .slice(0, 10)
      .join(',')
    if (!tournamentIds) return NextResponse.json({ ok: tournamentsResponse.ok, status: tournamentsResponse.status, data: tournaments }, { status: tournamentsResponse.ok ? 200 : tournamentsResponse.status })
    const oddsParams = new URLSearchParams({ bookmaker, tournamentIds, oddsFormat: 'decimal', language: 'en', apiKey })
    const oddsResponse = await fetch(`https://api.oddspapi.io/v4/odds-by-tournaments?${oddsParams.toString()}`, { cache: 'no-store' })
    const text = await oddsResponse.text()
    let data: unknown
    try { data = JSON.parse(text) } catch { data = { raw: text } }
    return NextResponse.json({ ok: oddsResponse.ok, status: oddsResponse.status, data, tournamentIds, bookmaker }, { status: oddsResponse.ok ? 200 : oddsResponse.status })
  }

  const oddsParams = new URLSearchParams({
    fixtureId,
    oddsFormat: 'decimal',
    language: 'en',
    verbosity: '2',
    apiKey,
  })
  const response = await fetch(`https://api.oddspapi.io/v4/odds?${oddsParams.toString()}`, { cache: 'no-store' })
  const text = await response.text()
  let data: unknown
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  return NextResponse.json({ ok: response.ok, status: response.status, data }, { status: response.ok ? 200 : response.status })
}
