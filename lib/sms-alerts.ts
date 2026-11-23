import 'server-only'
import { and, count, eq, gt, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities, smsAlertLog, smsAlertSettings, subscriptions, user } from '@/lib/db/schema'
import { ACTIVE_STATUSES } from '@/lib/billing'
import { marginPercent } from '@/lib/odds'
import { isSmsConfigured, normalizePhone, sendSms } from '@/lib/sms'

export const SMS_LIMITS = { minProfit: 1, maxProfit: 50, minDaily: 1, maxDaily: 30 }

const DAY_MS = 24 * 60 * 60 * 1000

export function copenhagenHour(date = new Date()) {
  return Number(new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', hour: '2-digit', hour12: false }).format(date)) % 24
}

export function isQuietHour(hour: number, start: number, end: number) {
  if (start === end) return false
  return start < end ? hour >= start && hour < end : hour >= start || hour < end
}

export const alertKey = (row: typeof opportunities.$inferSelect) =>
  [row.homeTeam, row.awayTeam, row.market, row.player ?? '', row.kickoff.toISOString()].join('|').toLowerCase()

function calculatorUrl(id: number) {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return host ? `https://${host}/s/${id}` : ''
}

function formatMessage(row: typeof opportunities.$inferSelect, profit: number) {
  const pct = profit.toFixed(1).replace('.', ',')
  const link = calculatorUrl(row.id)
  return [
    `BetTracker: ${pct}% surebet`,
    `${row.homeTeam} - ${row.awayTeam}`,
    `${row.aLabel} @${Number(row.aOdds).toFixed(2)} (${row.aBookmaker})`,
    `${row.bLabel} @${Number(row.bOdds).toFixed(2)} (${row.bBookmaker})`,
    link && `Lav surebet her: ${link}`,
    'Slå fra under Min side.',
  ].filter(Boolean).join('\n')
}

/** Sends at most one SMS per subscriber per run: the best unsent surebet above their threshold. */
export async function dispatchSmsAlerts() {
  if (!isSmsConfigured()) return { ok: true, skipped: 'not-configured' as const, sent: 0 }

  const recipients = await db
    .select({ settings: smsAlertSettings, phone: user.phone })
    .from(smsAlertSettings)
    .innerJoin(user, eq(user.id, smsAlertSettings.userId))
    .innerJoin(subscriptions, eq(subscriptions.userId, smsAlertSettings.userId))
    .where(and(eq(smsAlertSettings.enabled, true), inArray(subscriptions.status, ACTIVE_STATUSES)))
  if (recipients.length === 0) return { ok: true, sent: 0 }

  const now = new Date()
  const candidates = (await db.select().from(opportunities).where(gt(opportunities.kickoff, now)))
    .map((row) => ({ row, key: alertKey(row), profit: marginPercent(Number(row.aOdds), Number(row.bOdds)) }))
    .filter((c) => Number.isFinite(c.profit) && c.profit > 0)
    .sort((a, b) => b.profit - a.profit)
  if (candidates.length === 0) return { ok: true, sent: 0 }

  const hour = copenhagenHour(now)
  const since = new Date(now.getTime() - DAY_MS)
  let sent = 0
  let failed = 0

  for (const { settings, phone } of recipients) {
    const msisdn = normalizePhone(phone)
    if (!msisdn || isQuietHour(hour, settings.quietStart, settings.quietEnd)) continue

    const [{ value: sentLastDay }] = await db
      .select({ value: count() })
      .from(smsAlertLog)
      .where(and(eq(smsAlertLog.userId, settings.userId), gt(smsAlertLog.sentAt, since)))
    if (sentLastDay >= settings.dailyLimit) continue

    const minProfit = Number(settings.minProfit)
    const eligible = candidates.filter((c) => c.profit >= minProfit)
    if (eligible.length === 0) continue

    const already = new Set(
      (await db
        .select({ key: smsAlertLog.alertKey })
        .from(smsAlertLog)
        .where(and(eq(smsAlertLog.userId, settings.userId), inArray(smsAlertLog.alertKey, eligible.map((c) => c.key)))))
        .map((r) => r.key),
    )
    const pick = eligible.find((c) => !already.has(c.key))
    if (!pick) continue

    const claimed = await db
      .insert(smsAlertLog)
      .values({ userId: settings.userId, alertKey: pick.key, profit: pick.profit.toFixed(2) })
      .onConflictDoNothing()
      .returning({ key: smsAlertLog.alertKey })
    if (claimed.length === 0) continue

    try {
      await sendSms(msisdn, formatMessage(pick.row, pick.profit))
      sent++
    } catch (error) {
      failed++
      console.error('[sms] send failed', error)
      await db.delete(smsAlertLog).where(and(eq(smsAlertLog.userId, settings.userId), eq(smsAlertLog.alertKey, pick.key)))
    }
  }

  return { ok: true, sent, failed }
}
