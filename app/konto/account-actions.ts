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
import { LEGACY_ONBOARDING_BOOKMAKER_IDS, ONBOARDING_BOOKMAKERS } from '@/lib/onboarding-bookmakers'

const ONBOARDING_BOOKMAKER_IDS = new Set<string>(ONBOARDING_BOOKMAKERS.map(({ id }) => id))
const ONBOARDING_ANSWERS = new Set(['already_registered', 'registered_after_click'])

export async function completeOnboarding(responses: Record<string, string>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Mangler login')
  const userId = session.user.id
  const ids = Object.keys(responses ?? {})
  if (ids.some((id) => !ONBOARDING_BOOKMAKER_IDS.has(id) && !LEGACY_ONBOARDING_BOOKMAKER_IDS.has(id))) {
    throw new Error('Ukendt bookmaker i dine svar.')
  }

  const currentResponses: Record<string, string> = {}
  for (const { id } of ONBOARDING_BOOKMAKERS) {
    const answer = responses?.[id]
    if (!answer || !ONBOARDING_ANSWERS.has(answer)) {
      throw new Error('Besvar alle bookmakerne, før du fortsætter.')
    }
    currentResponses[id] = answer
  }
  const selected = ONBOARDING_BOOKMAKERS.map(({ id }) => id)
  const row = await getSubscription(userId)
  if (!row?.stripeSubscriptionId || !ACTIVE_STATUSES.includes(row.status)) {
    if (isPreviewTestEnvironment()) {
      revalidatePath('/')
      revalidatePath('/konto')
      return
    }
    throw new Error('Et aktivt abonnement er nødvendigt for at gennemføre onboarding.')
  }

  await db.update(subscriptions).set({ onboardingResponses: currentResponses, onboardingBookmakers: selected, onboardingCompletedAt: new Date(), updatedAt: new Date() }).where(eq(subscriptions.userId, userId))
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
