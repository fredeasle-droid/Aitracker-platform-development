import { NextResponse } from 'next/server'

const API_BASE = 'https://api.sportsgameodds.com/v2/events'

export async function GET(request: Request) {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'SPORTSGAMEODDS_API_KEY is not configured' },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const params = new URLSearchParams()

  // Optional filters. If none are supplied, SportsGameOdds returns events
  // across its available sports/leagues.
  for (const key of [
    'sportID',
    'leagueID',
    'eventID',
    'eventIDs',
    'type',
    'bookmakerID',
    'oddID',
    'limit',
    'cursor',
  ]) {
    const value = searchParams.get(key)
    if (value) params.set(key, value)
  }

  params.set('oddsAvailable', searchParams.get('oddsAvailable') ?? 'true')
  params.set('oddsPresent', searchParams.get('oddsPresent') ?? 'true')

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      accept: 'application/json',
    },
    cache: 'no-store',
  })

  const body = await response.json().catch(() => ({
    success: false,
    error: 'Invalid JSON response from SportsGameOdds',
  }))

  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
        error: body?.error ?? `SportsGameOdds request failed (${response.status})`,
      },
      { status: response.status },
    )
  }

  return NextResponse.json(body)
}
