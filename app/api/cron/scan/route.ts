import { NextResponse } from 'next/server'
import { isAuthorizedScan } from '@/lib/cron-auth'
import { refreshOpportunities } from '@/lib/scanner-sync'
import { refreshTeamLogos } from '@/lib/team-logos'
import { dispatchSmsAlerts } from '@/lib/sms-alerts'
import { dispatchPushAlerts } from '@/lib/push-alerts'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  if (!isAuthorizedScan(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const result = await refreshOpportunities()
    const logos = await refreshTeamLogos().catch((error) => {
      console.error('[logos] cron logo refresh failed', error)
      return null
    })
    const sms = await dispatchSmsAlerts().catch((error) => {
      console.error('[sms] alert dispatch failed', error)
      return null
    })
    const push = await dispatchPushAlerts().catch((error) => {
      console.error('[push] alert dispatch failed', error)
      return null
    })
    return NextResponse.json({ ...result, logos, sms, push }, { status: result.ok ? 200 : 502 })
  } catch (error) {
    console.error('[scanner] cron refresh failed', error)
    return NextResponse.json({ ok: false, error: 'Could not refresh odds' }, { status: 502 })
  }
}
