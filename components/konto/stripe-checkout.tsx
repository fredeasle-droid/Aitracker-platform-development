'use client'

import { useEffect, useRef, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { loadStripe } from '@stripe/stripe-js'
import { getStripePublishableKey, startSubscriptionCheckout, syncSubscription } from '@/app/konto/billing-actions'
import type { Plan } from '@/app/konto/plans'

export function StripeCheckout({ plan, onComplete }: { plan: Plan; onComplete: () => void }) {
  const { data: publishableKey } = useSWRImmutable('stripe-publishable-key', getStripePublishableKey)
  const { data: clientSecret, error, isLoading } = useSWRImmutable(['stripe-checkout', plan], ([, selected]) => startSubscriptionCheckout(selected))
  const containerRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  const [mountError, setMountError] = useState('')

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const container = containerRef.current
    if (!publishableKey || !clientSecret || !container) return

    let cancelled = false
    let destroy: (() => void) | undefined

    async function mountCheckout() {
      const stripe = await loadStripe(publishableKey as string)
      if (!stripe || cancelled) return
      const checkout = await stripe.createEmbeddedCheckoutPage({
        clientSecret,
        onComplete: async () => {
          try {
            await syncSubscription()
          } finally {
            onCompleteRef.current()
          }
        },
      })
      if (cancelled) {
        checkout.destroy()
        return
      }
      checkout.mount(container as HTMLElement)
      destroy = () => checkout.destroy()
    }

    mountCheckout().catch((cause: unknown) => {
      if (!cancelled) setMountError(cause instanceof Error ? cause.message : 'Betalingsformularen kunne ikke vises. Prøv igen.')
    })

    return () => {
      cancelled = true
      destroy?.()
    }
  }, [publishableKey, clientSecret])

  if (publishableKey === '') return <Notice>Betaling er ikke sat op endnu. Stripe-nøglerne mangler.</Notice>
  if (error) return <Notice role="alert">{error instanceof Error ? error.message : 'Betalingen kunne ikke startes. Prøv igen.'}</Notice>
  if (mountError) return <Notice role="alert">{mountError}</Notice>

  return (
    <>
      {(isLoading || !clientSecret || !publishableKey) && <Notice>Henter sikker betaling…</Notice>}
      <div ref={containerRef} id="checkout" className="min-h-0 overflow-hidden rounded-2xl bg-white" />
    </>
  )
}

function Notice({ children, role }: { children: React.ReactNode; role?: 'alert' }) {
  return (
    <p role={role} className="rounded-2xl border border-[#1d3a5f] bg-[#071428] px-4 py-8 text-center text-[15px] text-[#e6ecf7]">
      {children}
    </p>
  )
}
