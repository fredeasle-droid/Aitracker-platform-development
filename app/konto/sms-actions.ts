'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { smsAlertSettings, user } from '@/lib/db/schema'
import { SMS_LIMITS } from '@/lib/sms-alerts'
import { normalizePhone } from '@/lib/sms'

export type SmsSettingsInput = { enabled: boolean; minProfit: number; dailyLimit: number; quietStart: number; quietEnd: number }

const isHour = (n: number) => Number.isInteger(n) && n >= 0 && n <= 23

export async function saveSmsSettings(input: SmsSettingsInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { ok: false, error: 'Du skal være logget ind.' }

  const enabled = input.enabled === true
  const minProfit = Number(input.minProfit)
  const dailyLimit = Number(input.dailyLimit)
  const quietStart = Number(input.quietStart)
  const quietEnd = Number(input.quietEnd)

  if (!Number.isFinite(minProfit) || minProfit < SMS_LIMITS.minProfit || minProfit > SMS_LIMITS.maxProfit) {
    return { ok: false, error: `Profitgrænsen skal være mellem ${SMS_LIMITS.minProfit}% og ${SMS_LIMITS.maxProfit}%.` }
  }
  if (!Number.isInteger(dailyLimit) || dailyLimit < SMS_LIMITS.minDaily || dailyLimit > SMS_LIMITS.maxDaily) {
    return { ok: false, error: `Maks SMS pr. døgn skal være mellem ${SMS_LIMITS.minDaily} og ${SMS_LIMITS.maxDaily}.` }
  }
  if (!isHour(quietStart) || !isHour(quietEnd)) return { ok: false, error: 'Ugyldige stille timer.' }

  if (enabled) {
    const [row] = await db.select({ phone: user.phone }).from(user).where(eq(user.id, session.user.id))
    if (!normalizePhone(row?.phone)) return { ok: false, error: 'Tilføj et gyldigt mobilnummer under "Mine oplysninger" først.' }
  }

  const values = { enabled, minProfit: minProfit.toFixed(2), dailyLimit, quietStart, quietEnd, updatedAt: new Date() }
  await db
    .insert(smsAlertSettings)
    .values({ userId: session.user.id, ...values })
    .onConflictDoUpdate({ target: smsAlertSettings.userId, set: values })
  revalidatePath('/konto')
  return { ok: true }
}
