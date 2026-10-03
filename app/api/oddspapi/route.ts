import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.ODDSPAPI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ODDSPAPI_API_KEY mangler i projektets miljø.' }, { status: 503 })

  const fixtureId = new URL(request.url).searchParams.get('fixtureId')
  if (!fixtureId) return NextResponse.json({ error: 'Angiv et fixture-id.' }, { status: 400 })

  const response = await fetch(`https://api.oddspapi.io/v4/odds?fixtureId=${encodeURIComponent(fixtureId)}&apiKey=${encodeURIComponent(apiKey)}`, { cache: 'no-store' })
  const text = await response.text()
  let data: unknown
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  return NextResponse.json({ ok: response.ok, status: response.status, data }, { status: response.ok ? 200 : response.status })
}
