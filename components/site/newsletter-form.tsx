'use client'

import { useActionState } from 'react'
import { useLocale } from '@/components/locale-provider'
import { subscribeToNewsletter, type NewsletterState } from './newsletter-actions'

const INITIAL_STATE: NewsletterState = { status: 'idle', message: '' }

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { tx } = useLocale()
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, INITIAL_STATE)

  return (
    <form action={formAction} className="flex flex-col gap-2" noValidate>
      <div className={`newsletter-field flex ${compact ? 'h-11' : 'h-[52px]'} items-center overflow-hidden rounded-full border border-primary/70 bg-background-deep/60`}>
        <label htmlFor="newsletter-email" className="sr-only">
          {tx('Din e-mailadresse')}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={tx('Din e-mail adresse')}
          aria-describedby="newsletter-status"
          className={`h-full min-w-0 flex-1 bg-transparent ${compact ? 'px-4 text-[14px]' : 'px-5 text-[15px]'} text-foreground placeholder:text-foreground/60 focus:outline-none`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`btn-glow h-full shrink-0 rounded-full ${compact ? 'px-6 text-[14px]' : 'px-7 text-[15px]'} font-bold disabled:opacity-70`}
        >
          {pending ? tx('Sender…') : tx('Tilmeld')}
        </button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        className={state.status === 'error' ? 'min-h-5 text-[13px] text-destructive' : 'min-h-5 text-[13px] text-success'}
      >
        {tx(state.message)}
      </p>
    </form>
  )
}
