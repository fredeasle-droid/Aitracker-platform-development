import 'server-only'
import type Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import type { Plan } from '@/app/konto/plans'

export const TRIAL_DAYS = 7

// Prices live on the server only, so the client can only choose a plan, never an amount.
export const PLAN_AMOUNTS_ORE: Record<Plan, number> = { basis: 14900, premium: 24900 }

// Live prices are set via STRIPE_PRICE_BASIS / STRIPE_PRICE_PREMIUM; the fallbacks are the Stripe Sandbox prices.
export const PLAN_PRICE_IDS: Record<Plan, string> = {
  basis: process.env.STRIPE_LIVE_PRICE_BASIS || process.env.STRIPE_PRICE_BASIS || 'price_1UWARgEz6ncPj5P33OSDWiup',
  premium: process.env.STRIPE_LIVE_PRICE_PREMIUM || process.env.STRIPE_PRICE_PREMIUM || 'price_1UWARgEz6ncPj5P3TV6pdftL',
}

export function isPlan(value: unknown): value is Plan {
  return typeof value === 'string' && Object.hasOwn(PLAN_AMOUNTS_ORE, value)
}

export const ACTIVE_STATUSES = ['trialing', 'active']

export async function getSubscription(userId: string) {
  const [row] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1)
  return row ?? null
}

export async function hasActiveSubscription(userId: string) {
  const row = await getSubscription(userId)
  return Boolean(row && ACTIVE_STATUSES.includes(row.status))
}

export async function saveCustomer(userId: string, stripeCustomerId: string) {
  await db.insert(subscriptions).values({ userId, stripeCustomerId }).onConflictDoNothing()
}

export async function saveSubscription(userId: string, subscription: Stripe.Subscription) {
  const item = subscription.items.data[0]
  const planFromMetadata = subscription.metadata?.plan
  const values = {
    stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
    stripeSubscriptionId: subscription.id,
    plan: isPlan(planFromMetadata) ? planFromMetadata : null,
    status: subscription.status,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  }
  await db.insert(subscriptions).values({ userId, ...values }).onConflictDoUpdate({ target: subscriptions.userId, set: values })
}
