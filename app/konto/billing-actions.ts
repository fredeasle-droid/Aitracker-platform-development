'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { PLAN_AMOUNTS_ORE, TRIAL_DAYS, getSubscription, isPlan, saveCustomer, saveSubscription } from '@/lib/billing'
import { plans } from './plans'

async function requireSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Du skal være logget ind for at starte et abonnement.')
  return session.user
}

export async function startSubscriptionCheckout(plan: string) {
  if (!isPlan(plan)) throw new Error('Ukendt abonnement.')
  const user = await requireSessionUser()
  const stripe = getStripe()

  const existing = await getSubscription(user.id)
  let customerId = existing?.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name, metadata: { userId: user.id } })
    customerId = customer.id
    await saveCustomer(user.id, customerId)
  }

  const checkout = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    mode: 'subscription',
    customer: customerId,
    locale: 'da',
    redirect_on_completion: 'never',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'dkk',
          unit_amount: PLAN_AMOUNTS_ORE[plan],
          recurring: { interval: 'month' },
          product_data: { name: `BetTracker ${plans[plan].name}` },
        },
      },
    ],
    subscription_data: { trial_period_days: TRIAL_DAYS, metadata: { userId: user.id, plan } },
    metadata: { userId: user.id, plan },
  })

  if (!checkout.client_secret) throw new Error('Stripe returnerede ingen betalingssession.')
  return checkout.client_secret
}

export async function syncSubscription() {
  const user = await requireSessionUser()
  const existing = await getSubscription(user.id)
  if (!existing) return null

  const list = await getStripe().subscriptions.list({ customer: existing.stripeCustomerId, status: 'all', limit: 1 })
  const [subscription] = list.data
  if (!subscription) return null

  await saveSubscription(user.id, subscription)
  return subscription.status
}
