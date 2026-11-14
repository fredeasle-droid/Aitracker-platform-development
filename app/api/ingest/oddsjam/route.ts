import { getAdminState } from '@/lib/admin'
import { saveOddsJamBrowserRows } from '@/lib/scrapers/oddsjam'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_BODY_CHARS = 1_000_000

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Origin not allowed' }, { status: 403 })
  }
  if ((await getAdminState()) !== 'admin') {
    return Response.json({ error: 'Sign in to BetTracker before connecting OddsJam' }, { status: 401 })
  }

  const bodyText = await request.text()
  if (bodyText.length > MAX_BODY_CHARS) return Response.json({ error: 'Payload too large' }, { status: 413 })

  let body: { rows?: unknown }
  try {
    body = JSON.parse(bodyText)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!Array.isArray(body.rows)) return Response.json({ error: 'Missing rows' }, { status: 400 })

  try {
    const result = await saveOddsJamBrowserRows(body.rows.slice(0, 100))
    return Response.json(result)
  } catch (error) {
    console.error('[oddsjam-ingest] failed', error)
    return Response.json({ error: 'Could not save OddsJam rows' }, { status: 500 })
  }
}
