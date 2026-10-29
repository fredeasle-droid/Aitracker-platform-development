import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { saveSubscription } from '@/lib/billing'

export const runtime = 'nodejs'

const HANDLED_EVENTS = new Set(['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'customer.subscription.trial_will_end'])

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
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

  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata?.userId
  if (!userId) return NextResponse.json({ received: true, skipped: 'no userId' })

  await saveSubscription(userId, subscription)
  return NextResponse.json({ received: true })
}
