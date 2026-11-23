import 'server-only'
import { and, count, eq, gt, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { opportunities, pushAlertLog, pushSettings, pushSubscriptions, subscriptions } from '@/lib/db/schema'
import { ACTIVE_STATUSES } from '@/lib/billing'
import { marginPercent } from '@/lib/odds'
import { sendPushToSubscriptions, sendPushToUser, type PushPayload } from '@/lib/push'
import { alertKey, copenhagenHour, isQuietHour } from '@/lib/sms-alerts'

export const PUSH_LIMITS = { minProfit: 1, maxProfit: 50, minDaily: 1, maxDaily: 100 }

const DAY_MS = 24 * 60 * 60 * 1000

const TIME_ZONE = 'Europe/Copenhagen'

function kickoffLabel(kickoff: Date, now: Date) {
  const dayKey = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date)
  const time = new Intl.DateTimeFormat('da-DK', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' })
    .format(kickoff)
    .replace('.', ':')
  const diffDays = Math.round((Date.parse(dayKey(kickoff)) - Date.parse(dayKey(now))) / DAY_MS)
  if (diffDays === 0) return `I dag kl. ${time}`
  if (diffDays === 1) return `I morgen kl. ${time}`
  const day = new Intl.DateTimeFormat('da-DK', { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'short' }).format(kickoff)
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} kl. ${time}`
}

function buildPayload(row: typeof opportunities.$inferSelect, profit: number): PushPayload {
  const pct = profit.toFixed(1).replace('.', ',')
  const when = kickoffLabel(row.kickoff, new Date())
  const card = new URLSearchParams({
    p: pct,
    h: row.homeTeam,
    a: row.awayTeam,
    l: row.league,
    k: when,
    al: row.aLabel,
    ab: row.aBookmaker,
    ao: String(Number(row.aOdds)),
    bl: row.bLabel,
    bb: row.bBookmaker,
    bo: String(Number(row.bOdds)),
  })
  return {
    title: `Ny surebet: +${pct}% profit`,
    body: `${row.homeTeam} - ${row.awayTeam}\n${when}\n${row.aBookmaker} @${Number(row.aOdds).toFixed(2)} og ${row.bBookmaker} @${Number(row.bOdds).toFixed(2)}`,
    url: '/surebets',
    tag: alertKey(row).slice(0, 120),
    image: `/api/push/card?${card.toString()}`,
    sticky: true,
  }
}

/** Sends at most one push per member per run: the best unsent surebet above their threshold. */
export async function dispatchPushAlerts() {
  const recipients = await db
    .select({ settings: pushSettings })
    .from(pushSettings)
    .innerJoin(subscriptions, eq(subscriptions.userId, pushSettings.userId))
    .where(and(eq(pushSettings.alertsEnabled, true), inArray(subscriptions.status, ACTIVE_STATUSES)))
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

  for (const { settings } of recipients) {
    if (isQuietHour(hour, settings.quietStart, settings.quietEnd)) continue

    const [{ value: sentLastDay }] = await db
      .select({ value: count() })
      .from(pushAlertLog)
      .where(and(eq(pushAlertLog.userId, settings.userId), gt(pushAlertLog.sentAt, since)))
    if (sentLastDay >= settings.dailyLimit) continue

    const minProfit = Number(settings.minProfit)
    const eligible = candidates.filter((c) => c.profit >= minProfit)
    if (eligible.length === 0) continue

    const already = new Set(
      (await db
        .select({ key: pushAlertLog.alertKey })
        .from(pushAlertLog)
        .where(and(eq(pushAlertLog.userId, settings.userId), inArray(pushAlertLog.alertKey, eligible.map((c) => c.key)))))
        .map((r) => r.key),
    )
    const pick = eligible.find((c) => !already.has(c.key))
    if (!pick) continue

    const claimed = await db
      .insert(pushAlertLog)
      .values({ userId: settings.userId, alertKey: pick.key, profit: pick.profit.toFixed(2) })
      .onConflictDoNothing()
      .returning({ key: pushAlertLog.alertKey })
    if (claimed.length === 0) continue

    const delivered = await sendPushToUser(settings.userId, buildPayload(pick.row, pick.profit)).catch((error) => {
      console.error('[push] alert failed', error)
      return 0
    })
    if (delivered > 0) sent++
    else await db.delete(pushAlertLog).where(and(eq(pushAlertLog.userId, settings.userId), eq(pushAlertLog.alertKey, pick.key)))
  }

  return { ok: true, sent }
}

/** Offers and news go to every device whose owner left the matching switch on. */
export async function broadcastPush(payload: PushPayload, category: 'offers' | 'news') {
  const subs = await db
    .select({ endpoint: pushSubscriptions.endpoint, p256dh: pushSubscriptions.p256dh, auth: pushSubscriptions.auth })
    .from(pushSubscriptions)
    .innerJoin(pushSettings, eq(pushSettings.userId, pushSubscriptions.userId))
    .where(eq(category === 'offers' ? pushSettings.offersEnabled : pushSettings.newsEnabled, true))
  const delivered = await sendPushToSubscriptions(subs, payload)
  return { devices: subs.length, delivered }
}
