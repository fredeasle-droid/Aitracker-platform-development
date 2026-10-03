import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.ODDSPAPI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ODDSPAPI_API_KEY mangler i projektets miljø.' }, { status: 503 })

  const params = new URL(request.url).searchParams
  const fixtureId = params.get('fixtureId')
  if (!fixtureId) {
    const sportId = params.get('sportId') || '10'
    const from = params.get('from') || new Date().toISOString().slice(0, 10)
    const to = params.get('to') || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
    const fixtures = await fetch(`https://api.oddspapi.io/v4/fixtures?sportId=${encodeURIComponent(sportId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&apiKey=${encodeURIComponent(apiKey)}`, { cache: 'no-store' })
    const text = await fixtures.text()
    let data: unknown
    try { data = JSON.parse(text) } catch { data = { raw: text } }
    return NextResponse.json({ ok: fixtures.ok, status: fixtures.status, data }, { status: fixtures.ok ? 200 : fixtures.status })
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
