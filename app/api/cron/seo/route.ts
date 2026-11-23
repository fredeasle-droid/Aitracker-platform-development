import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { redditConfigured, scanForums } from '@/lib/seo/forum-radar'
import { indexNowUrls, submitIndexNow } from '@/lib/seo/indexnow'
import { syncSearchConsole } from '@/lib/seo/sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ ok: false }, { status: 401 })
  const full = new URL(request.url).searchParams.has('full') || new Date().getUTCDay() === 1
  const [result, indexNow, forum] = await Promise.all([
    syncSearchConsole(),
    submitIndexNow(indexNowUrls(full)),
    redditConfigured() ? scanForums().catch((error: unknown) => ({ ok: false, error: String(error) })) : null,
  ])
  return NextResponse.json({ ...result, indexNow, forum }, { status: result.ok ? 200 : 503 })
}
