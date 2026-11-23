import 'server-only'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pushSettings, smsAlertSettings } from '@/lib/db/schema'
import { ACTIVE_STATUSES, getSubscription } from '@/lib/billing'
import type { PushSettingsInput } from '@/app/konto/push-actions'
import type { SmsSettingsInput } from '@/app/konto/sms-actions'

export type AlertPanelData =
  | { signedIn: false }
  | { signedIn: true; isSubscriber: boolean; hasPhone: boolean; push: PushSettingsInput; sms: SmsSettingsInput }

export async function getAlertPanelData(): Promise<AlertPanelData> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return { signedIn: false }
    const userId = session.user.id
    const [subscription, pushRow, smsRow] = await Promise.all([
      getSubscription(userId),
      db.select().from(pushSettings).where(eq(pushSettings.userId, userId)).then((r) => r[0]).catch(() => undefined),
      db.select().from(smsAlertSettings).where(eq(smsAlertSettings.userId, userId)).then((r) => r[0]).catch(() => undefined),
    ])
    return {
      signedIn: true,
      isSubscriber: Boolean(subscription && ACTIVE_STATUSES.includes(subscription.status)),
      hasPhone: Boolean(session.user.phone),
      push: {
        alertsEnabled: pushRow?.alertsEnabled ?? true,
        offersEnabled: pushRow?.offersEnabled ?? true,
        newsEnabled: pushRow?.newsEnabled ?? true,
        minProfit: pushRow ? Number(pushRow.minProfit) : 5,
        dailyLimit: pushRow?.dailyLimit ?? 20,
        quietStart: pushRow?.quietStart ?? 23,
        quietEnd: pushRow?.quietEnd ?? 7,
      },
      sms: {
        enabled: smsRow?.enabled ?? false,
        minProfit: smsRow ? Number(smsRow.minProfit) : 5,
        dailyLimit: smsRow?.dailyLimit ?? 10,
        quietStart: smsRow?.quietStart ?? 23,
        quietEnd: smsRow?.quietEnd ?? 7,
      },
    }
  } catch {
    return { signedIn: false }
  }
}
