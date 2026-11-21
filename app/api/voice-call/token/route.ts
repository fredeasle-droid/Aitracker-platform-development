import { VOICE_AGENT } from '@/lib/voice-agent-config'

export const dynamic = 'force-dynamic'

const WINDOW_MS = 10 * 60 * 1000
const MAX_CALLS_PER_WINDOW = 6
const recentCalls = new Map<string, number[]>()

/** Best-effort per-IP limit so one visitor cannot use up the monthly call minutes. */
function isRateLimited(ip: string) {
  const now = Date.now()
  const hits = (recentCalls.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= MAX_CALLS_PER_WINDOW) {
    recentCalls.set(ip, hits)
    return true
  }
  hits.push(now)
  recentCalls.set(ip, hits)
  if (recentCalls.size > 5000) recentCalls.clear()
  return false
}

/** One-time ticket for a visitor's call with the ElevenLabs agent. The API key never leaves the server. */
export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY
  if (!key) {
    return Response.json({ error: 'Calls are not set up (ElevenLabs is not connected)' }, { status: 503 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many calls, try again later' }, { status: 429 })
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(VOICE_AGENT.agentId)}`,
    { headers: { 'xi-api-key': key }, cache: 'no-store' },
  )
  if (!res.ok) {
    console.error(`ElevenLabs token failed [${res.status}]: ${await res.text()}`)
    return Response.json({ error: `Call could not start [${res.status}]` }, { status: 502 })
  }

  const { token } = (await res.json()) as { token?: string }
  if (!token) return Response.json({ error: 'Call could not start (no token)' }, { status: 502 })
  return Response.json({ token })
}
