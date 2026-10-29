'use server'

import { revalidatePath } from 'next/cache'
import { getStripe } from '@/lib/stripe'
import { getUserId } from '@/lib/user'
import { ACTIVE_STATUSES, PLAN_AMOUNTS_ORE, getSubscription, isPlan, saveSubscription } from '@/lib/billing'
import { plans } from './plans'

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

  const product = await stripe.products.create({ name: `BetTracker ${plans[plan].name}` })
  const updated = await stripe.subscriptions.update(subscriptionId, {
    items: [{ id: item.id, price_data: { currency: 'dkk', product: product.id, unit_amount: PLAN_AMOUNTS_ORE[plan], recurring: { interval: 'month' } } }],
    metadata: { ...current.metadata, plan },
    proration_behavior: 'create_prorations',
    cancel_at_period_end: false,
  })
  await saveSubscription(userId, updated)
  revalidatePath('/konto')
}
