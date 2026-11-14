'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Crown } from 'lucide-react'
import { plans, type Plan } from '@/app/konto/plans'
import { changePlan, setCancelAtPeriodEnd } from '@/app/konto/account-actions'
import { STATUS_LABELS, formatDate, hasAccess, type AccountSubscription } from '@/app/konto/account-types'
import { StripeCheckout } from '@/components/konto/stripe-checkout'
import { Card, Message, dangerButton, primaryButton, secondaryButton } from './ui'

type Feedback = { kind: 'ok' | 'error'; text: string }

export function SubscriptionCard({ subscription }: { subscription: AccountSubscription | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [choosing, setChoosing] = useState<Plan | null>(null)

  function run(action: () => Promise<void>, success: string) {
    setFeedback(null)
    startTransition(async () => {
      try {
        await action()
        setConfirmCancel(false)
        setFeedback({ kind: 'ok', text: success })
        router.refresh()
      } catch (error) {
        setFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'Noget gik galt. Prøv igen.' })
      }
    })
  }

  const active = subscription && hasAccess(subscription.status) ? subscription : null

  if (!active) {
    return (
      <Card title="Abonnement" icon={<Crown />}>
        <p className="text-[15px] font-semibold text-[#f3f6fc]">Du har intet aktivt abonnement</p>
        <p className="mt-1 text-[14px] leading-6 text-[#b5c6d9]">
          {subscription && subscription.status !== 'none'
            ? `Status: ${STATUS_LABELS[subscription.status] ?? subscription.status}. Vælg et abonnement for at få adgang igen.`
            : 'Vælg et abonnement og få 7 dage gratis. Opsig når som helst.'}
        </p>
        <div className="mt-4 space-y-2" role="radiogroup" aria-label="Vælg abonnement">
          {(Object.keys(plans) as Plan[]).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={choosing === id}
              onClick={() => setChoosing(id)}
              className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-3 text-left transition-colors ${choosing === id ? 'border-[#159cff] bg-[#0b2945]' : 'border-[#263f5a] bg-[#071522]'}`}
            >
              <span>
                <span className="block text-[14px] font-black uppercase tracking-wide text-[#f3f6fc]">{plans[id].name}</span>
                <span className="block text-[12px] text-[#a8c0d8]">{plans[id].detail}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[18px] font-black leading-none text-[#f3f6fc]">{plans[id].price}</span>
                <span className="text-[11px] text-[#b5c6d9]">kr./md.</span>
              </span>
            </button>
          ))}
        </div>
        {choosing && (
          <div className="mt-4">
            <StripeCheckout key={choosing} plan={choosing} onComplete={() => { setChoosing(null); router.refresh() }} />
          </div>
        )}
      </Card>
    )
  }

  const current = active.plan ? plans[active.plan] : null
  const otherId: Plan | null = active.plan ? (active.plan === 'premium' ? 'basis' : 'premium') : null

  const statusLine = active.cancelAtPeriodEnd
    ? `Opsagt. Du har adgang til ${formatDate(active.currentPeriodEnd ?? active.trialEnd)}.`
    : active.status === 'trialing'
      ? `Gratis prøve til ${formatDate(active.trialEnd)}. Du trækkes først herefter.`
      : `Fornyes automatisk ${formatDate(active.currentPeriodEnd)}.`

  return (
    <Card title="Abonnement" icon={<Crown />}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[20px] font-black leading-tight text-[#f3f6fc]">{current?.name ?? 'BetTracker'}</p>
          {current && <p className="mt-0.5 text-[13px] text-[#a8c0d8]">{current.price} kr./md.</p>}
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold ${active.cancelAtPeriodEnd ? 'bg-[#2a1018] text-[#ff9aa6]' : 'bg-[#0c2f25] text-[#16ee93]'}`}>
          {active.cancelAtPeriodEnd ? 'Opsagt' : STATUS_LABELS[active.status]}
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-6 text-[#cbd7e8]">{statusLine}</p>
      {current && (
        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-[#9fb3cc]">
          <Check className="mt-0.5 size-4 shrink-0 text-[#35adff]" aria-hidden="true" />
          {current.detail}
        </p>
      )}

      <div className="mt-5 space-y-2">
        {active.cancelAtPeriodEnd ? (
          <button type="button" disabled={pending} onClick={() => run(() => setCancelAtPeriodEnd(false), 'Dit abonnement er genoptaget.')} className={primaryButton}>
            {pending ? 'Genoptager…' : 'Genoptag abonnement'}
          </button>
        ) : (
          <>
            {otherId && (
              <button type="button" disabled={pending} onClick={() => run(() => changePlan(otherId), `Du har skiftet til ${plans[otherId].name}.`)} className={secondaryButton}>
                {pending ? 'Skifter…' : `Skift til ${plans[otherId].name} (${plans[otherId].price} kr./md.)`}
              </button>
            )}
            {confirmCancel ? (
              <div className="rounded-xl border border-[#6b2a35] bg-[#1c0b11] p-3">
                <p className="text-[14px] leading-5 text-[#ffd3d8]">Er du sikker? Du beholder adgang til periodens udløb og kan genoptage når som helst.</p>
                <div className="mt-3 space-y-2">
                  <button type="button" disabled={pending} onClick={() => run(() => setCancelAtPeriodEnd(true), 'Dit abonnement er opsagt.')} className={dangerButton}>
                    {pending ? 'Opsiger…' : 'Ja, opsig abonnement'}
                  </button>
                  <button type="button" disabled={pending} onClick={() => setConfirmCancel(false)} className={secondaryButton}>Behold abonnement</button>
                </div>
              </div>
            ) : (
              <button type="button" disabled={pending} onClick={() => setConfirmCancel(true)} className={dangerButton}>Opsig abonnement</button>
            )}
          </>
        )}
      </div>
      {feedback && <Message kind={feedback.kind}>{feedback.text}</Message>}
    </Card>
  )
}
