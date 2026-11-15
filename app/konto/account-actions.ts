'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { isPreviewTestEnvironment } from '@/lib/test-access'
import { eq } from 'drizzle-orm'
import { getStripe } from '@/lib/stripe'
import { getUserId } from '@/lib/user'
import { ACTIVE_STATUSES, PLAN_PRICE_IDS, getSubscription, isPlan, saveSubscription } from '@/lib/billing'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'

const ONBOARDING_BOOKMAKERS = new Set(['bet365', 'betano', 'unibet', 'williamhill', 'nordicbet', '888sport', 'betfair', 'bwin', 'leovegas', 'danskespil', 'betsson'])

export async function completeOnboarding(bookmakers: string[]) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Mangler login')
  const userId = session.user.id
  const selected = [...new Set(bookmakers)]
  if (selected.length === 0 || selected.some((bookmaker) => !ONBOARDING_BOOKMAKERS.has(bookmaker))) {
    throw new Error('Vælg mindst én bookmaker fra listen.')
  }

  const row = await getSubscription(userId)
  if (!row?.stripeSubscriptionId || !ACTIVE_STATUSES.includes(row.status)) {
    if (isPreviewTestEnvironment()) {
      revalidatePath('/')
      revalidatePath('/konto')
      return
    }
    throw new Error('Et aktivt abonnement er nødvendigt for at gennemføre onboarding.')
  }

  await db.update(subscriptions).set({ onboardingBookmakers: selected, onboardingCompletedAt: new Date(), updatedAt: new Date() }).where(eq(subscriptions.userId, userId))
  revalidatePath('/')
  revalidatePath('/konto')
}

async function requireActiveSubscription() {
  const userId = await getUserId()
  const row = await getSubscription(userId)
  if (!row?.stripeSubscriptionId || !ACTIVE_STATUSES.includes(row.status)) throw new Error('Du har intet aktivt abonnement.')
  return { userId, subscriptionId: row.stripeSubscriptionId, currentPlan: row.plan }
}

export async function setCancelAtPeriodEnd(cancel: boolean) {
  const { userId, subscriptionId } = await requireActiveSubscription()
  const updated = await getStripe().subscriptions.update(subscriptionId, { cancel_at_period_end: Boolean(cancel) })
  await saveSubscription(userId, updated)
  revalidatePath('/konto')
}

export async function changePlan(plan: string) {
  if (!isPlan(plan)) throw new Error('Ukendt abonnement.')
  const { userId, subscriptionId, currentPlan } = await requireActiveSubscription()
  if (currentPlan === plan) throw new Error('Du har allerede dette abonnement.')

  const stripe = getStripe()
  const current = await stripe.subscriptions.retrieve(subscriptionId)
  const item = current.items.data[0]
  if (!item) throw new Error('Abonnementet kunne ikke findes hos Stripe.')

  const updated = await stripe.subscriptions.update(subscriptionId, {
    items: [{ id: item.id, price: PLAN_PRICE_IDS[plan] }],
    metadata: { ...current.metadata, plan },
    proration_behavior: 'create_prorations',
    cancel_at_period_end: false,
  })
  await saveSubscription(userId, updated)
  revalidatePath('/konto')
}
