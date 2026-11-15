import 'server-only'
import Stripe from 'stripe'

let client: Stripe | undefined

export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_LIVE_SECRET_KEY mangler')
    client = new Stripe(key)
  }
  return client
}
