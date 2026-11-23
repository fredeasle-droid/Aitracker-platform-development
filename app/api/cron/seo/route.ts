import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { syncSearchConsole } from '@/lib/seo/sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ ok: false }, { status: 401 })
  const result = await syncSearchConsole()
  return NextResponse.json(result, { status: result.ok ? 200 : 503 })
}
