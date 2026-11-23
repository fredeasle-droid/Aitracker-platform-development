'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { getOwnerState } from '@/lib/admin'
import { db } from '@/lib/db'
import { pushSettings, pushSubscriptions } from '@/lib/db/schema'
import { PUSH_LIMITS, broadcastPush } from '@/lib/push-alerts'
import { sendPushToUser } from '@/lib/push'

export type PushSettingsInput = {
  alertsEnabled: boolean
  offersEnabled: boolean
  minProfit: number
  dailyLimit: number
  quietStart: number
  quietEnd: number
}

type Result = { ok: true; message?: string } | { ok: false; error: string }

const isHour = (n: number) => Number.isInteger(n) && n >= 0 && n <= 23

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function savePushSubscription(input: { endpoint: string; p256dh: string; auth: string; userAgent?: string }): Promise<Result> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: 'Du skal være logget ind.' }

  const { endpoint, p256dh, auth: authKey } = input
  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://') || endpoint.length > 1000) return { ok: false, error: 'Ugyldig enhed.' }
  if (typeof p256dh !== 'string' || typeof authKey !== 'string' || !p256dh || !authKey || p256dh.length > 200 || authKey.length > 100) {
    return { ok: false, error: 'Ugyldige nøgler fra browseren.' }
  }

  const values = { userId, p256dh, auth: authKey, userAgent: (input.userAgent ?? '').slice(0, 300) || null }
  await db
    .insert(pushSubscriptions)
    .values({ endpoint, ...values })
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: values })
  await db.insert(pushSettings).values({ userId }).onConflictDoNothing()
  revalidatePath('/konto')
  return { ok: true }
}

export async function removePushSubscription(endpoint: string): Promise<Result> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: 'Du skal være logget ind.' }
  await db.delete(pushSubscriptions).where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)))
  return { ok: true }
}

export async function savePushSettings(input: PushSettingsInput): Promise<Result> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: 'Du skal være logget ind.' }

  const minProfit = Number(input.minProfit)
  const dailyLimit = Number(input.dailyLimit)
  const quietStart = Number(input.quietStart)
  const quietEnd = Number(input.quietEnd)

  if (!Number.isFinite(minProfit) || minProfit < PUSH_LIMITS.minProfit || minProfit > PUSH_LIMITS.maxProfit) {
    return { ok: false, error: `Profitgrænsen skal være mellem ${PUSH_LIMITS.minProfit}% og ${PUSH_LIMITS.maxProfit}%.` }
  }
  if (!Number.isInteger(dailyLimit) || dailyLimit < PUSH_LIMITS.minDaily || dailyLimit > PUSH_LIMITS.maxDaily) {
    return { ok: false, error: `Maks notifikationer pr. døgn skal være mellem ${PUSH_LIMITS.minDaily} og ${PUSH_LIMITS.maxDaily}.` }
  }
  if (!isHour(quietStart) || !isHour(quietEnd)) return { ok: false, error: 'Ugyldige stille timer.' }

  const values = {
    alertsEnabled: input.alertsEnabled === true,
    offersEnabled: input.offersEnabled === true,
    minProfit: minProfit.toFixed(2),
    dailyLimit,
    quietStart,
    quietEnd,
    updatedAt: new Date(),
  }
  await db
    .insert(pushSettings)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: pushSettings.userId, set: values })
  revalidatePath('/konto')
  return { ok: true }
}

export async function sendTestPush(): Promise<Result> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: 'Du skal være logget ind.' }
  const delivered = await sendPushToUser(userId, {
    title: 'BetTracker',
    body: 'Notifikationer virker. Du får besked her, når dit alarm-krav rammes.',
    url: '/konto',
    tag: 'test',
  }).catch(() => 0)
  return delivered > 0 ? { ok: true, message: 'Testnotifikation sendt.' } : { ok: false, error: 'Kunne ikke sende. Slå notifikationer til på denne enhed igen.' }
}

export async function sendBroadcastPush(input: { title: string; body: string; url: string }): Promise<Result> {
  if ((await getOwnerState()) !== 'owner') return { ok: false, error: 'Kun ejeren kan sende til alle.' }

  const title = String(input.title ?? '').trim().slice(0, 80)
  const body = String(input.body ?? '').trim().slice(0, 240)
  const rawUrl = String(input.url ?? '').trim()
  if (!title || !body) return { ok: false, error: 'Skriv både titel og tekst.' }
  const url = rawUrl.startsWith('/') && !rawUrl.startsWith('//') ? rawUrl : '/'

  const { devices, delivered } = await broadcastPush({ title, body, url, tag: `broadcast-${Date.now()}` })
  return { ok: true, message: `Sendt til ${delivered} af ${devices} enheder.` }
}
