import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'SPORTSGAMEODDS_API_KEY mangler i projektets miljø.' }, { status: 503 })

  const params = new URL(request.url).searchParams
  const query = new URLSearchParams({
    oddsAvailable: 'true',
    limit: params.get('limit') || '10',
    includeAltLines: 'false',
  })
  const sportID = params.get('sportID')
  const leagueID = params.get('leagueID') || 'EPL'
  if (sportID) query.set('sportID', sportID)
  query.set('leagueID', leagueID)

  const response = await fetch(`https://api.sportsgameodds.com/v2/events?${query.toString()}`, {
    headers: { 'x-api-key': apiKey, accept: 'application/json' },
    cache: 'no-store',
  })
  const text = await response.text()
  let data: unknown
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  return NextResponse.json({ ok: response.ok, status: response.status, data }, { status: response.ok ? 200 : response.status })
}
