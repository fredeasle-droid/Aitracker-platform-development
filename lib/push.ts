import 'server-only'
import * as webpush from 'web-push'
import { eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pushConfig, pushSubscriptions } from '@/lib/db/schema'

export type PushPayload = { title: string; body: string; url?: string; tag?: string; image?: string; sticky?: boolean }

type VapidKeys = { publicKey: string; privateKey: string }
let cachedKeys: VapidKeys | null = null

/** VAPID keys come from env when set, otherwise they are generated once and kept in the database. */
export async function getVapidKeys(): Promise<VapidKeys> {
  if (cachedKeys) return cachedKeys
  const envPublic = process.env.VAPID_PUBLIC_KEY
  const envPrivate = process.env.VAPID_PRIVATE_KEY
  if (envPublic && envPrivate) return (cachedKeys = { publicKey: envPublic, privateKey: envPrivate })

  const read = async () => {
    const rows = await db.select().from(pushConfig).where(inArray(pushConfig.key, ['vapid_public', 'vapid_private']))
    const map = new Map(rows.map((r) => [r.key, r.value]))
    const publicKey = map.get('vapid_public')
    const privateKey = map.get('vapid_private')
    return publicKey && privateKey ? { publicKey, privateKey } : null
  }

  let keys = await read()
  if (!keys) {
    const generated = webpush.generateVAPIDKeys()
    await db
      .insert(pushConfig)
      .values([
        { key: 'vapid_public', value: generated.publicKey },
        { key: 'vapid_private', value: generated.privateKey },
      ])
      .onConflictDoNothing()
    keys = (await read()) ?? generated
  }
  return (cachedKeys = keys)
}

function vapidSubject() {
  if (process.env.VAPID_SUBJECT) return process.env.VAPID_SUBJECT
  const owner = (process.env.ADMIN_EMAILS ?? '').split(',')[0]?.trim()
  return owner ? `mailto:${owner}` : 'mailto:support@bettracker.app'
}

type StoredSubscription = { endpoint: string; p256dh: string; auth: string }

/** Returns true when the push service accepted the message. Expired endpoints are removed. */
async function sendToSubscription(sub: StoredSubscription, payload: PushPayload, vapid: VapidKeys) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
      {
        TTL: 60 * 60,
        urgency: 'high',
        timeout: 10_000,
        vapidDetails: { subject: vapidSubject(), publicKey: vapid.publicKey, privateKey: vapid.privateKey },
      },
    )
    return true
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    if (status === 404 || status === 410) {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint))
    } else {
      console.error('[push] send failed', status ?? error)
    }
    return false
  }
}

/** Sends to a list of devices in small parallel batches and returns how many accepted it. */
export async function sendPushToSubscriptions(subs: StoredSubscription[], payload: PushPayload) {
  if (subs.length === 0) return 0
  const vapid = await getVapidKeys()
  let delivered = 0
  for (let i = 0; i < subs.length; i += 25) {
    const results = await Promise.all(subs.slice(i, i + 25).map((sub) => sendToSubscription(sub, payload, vapid)))
    delivered += results.filter(Boolean).length
  }
  return delivered
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const subs = await db
    .select({ endpoint: pushSubscriptions.endpoint, p256dh: pushSubscriptions.p256dh, auth: pushSubscriptions.auth })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId))
  return sendPushToSubscriptions(subs, payload)
}
