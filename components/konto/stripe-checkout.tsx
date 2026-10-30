'use client'

import { useCallback } from 'react'
import useSWRImmutable from 'swr/immutable'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { getStripePublishableKey, startSubscriptionCheckout, syncSubscription } from '@/app/konto/billing-actions'
import type { Plan } from '@/app/konto/plans'

export function StripeCheckout({ plan, onComplete }: { plan: Plan; onComplete: () => void }) {
  const { data: publishableKey } = useSWRImmutable('stripe-publishable-key', getStripePublishableKey)
  const { data: clientSecret, error, isLoading } = useSWRImmutable(['stripe-checkout', plan], ([, selected]) => startSubscriptionCheckout(selected))
  const stripePromise = publishableKey ? loadStripe(publishableKey) : null

  const handleComplete = useCallback(async () => {
    try {
      await syncSubscription()
    } finally {
      onComplete()
    }
  }, [onComplete])

  if (!stripePromise) return <Notice>Betaling er ikke sat op endnu. Stripe-nøglerne mangler.</Notice>
  if (error) return <Notice role="alert">{error instanceof Error ? error.message : 'Betalingen kunne ikke startes. Prøv igen.'}</Notice>
  if (isLoading || !clientSecret) return <Notice>Henter sikker betaling…</Notice>

  return (
    <div className="overflow-hidden rounded-2xl bg-white" id="checkout">
      <EmbeddedCheckoutProvider key={clientSecret} stripe={stripePromise} options={{ clientSecret, onComplete: handleComplete }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

function Notice({ children, role }: { children: React.ReactNode; role?: 'alert' }) {
  return (
    <p role={role} className="rounded-2xl border border-[#1d3a5f] bg-[#071428] px-4 py-8 text-center text-[15px] text-[#e6ecf7]">
      {children}
    </p>
  )
}
