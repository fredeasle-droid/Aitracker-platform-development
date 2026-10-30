import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { saveSubscription } from '@/lib/billing'

export const runtime = 'nodejs'

const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.trial_will_end',
])

export async function POST(request: Request) {
  const secret = process.env.STRIPE_LIVE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  if (!secret || !signature) return NextResponse.json({ error: 'Webhook er ikke konfigureret' }, { status: 400 })

  const body = await request.text()
  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Ugyldig signatur' }, { status: 400 })
  }

  if (!HANDLED_EVENTS.has(event.type)) return NextResponse.json({ received: true })

  let subscription: Stripe.Subscription | null = null
  let userId: string | undefined

  if (event.type.startsWith('checkout.session.')) {
    const session = event.data.object as Stripe.Checkout.Session
    userId = session.metadata?.userId
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
    if (subscriptionId) subscription = await getStripe().subscriptions.retrieve(subscriptionId)
  } else if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
    if (subscriptionId) subscription = await getStripe().subscriptions.retrieve(subscriptionId)
  } else {
    subscription = event.data.object as Stripe.Subscription
    userId = subscription.metadata?.userId
  }

  userId ??= subscription?.metadata?.userId
  if (!userId || !subscription) return NextResponse.json({ received: true, skipped: 'subscription not available' })

  await saveSubscription(userId, subscription)
  return NextResponse.json({ received: true })
}
