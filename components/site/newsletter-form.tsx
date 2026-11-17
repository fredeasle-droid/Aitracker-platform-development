'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterState } from './newsletter-actions'

const INITIAL_STATE: NewsletterState = { status: 'idle', message: '' }

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, INITIAL_STATE)

  return (
    <form action={formAction} className="flex flex-col gap-2" noValidate>
      <div className="newsletter-field flex h-[52px] items-center overflow-hidden rounded-full border border-primary/70 bg-background-deep/60">
        <label htmlFor="newsletter-email" className="sr-only">
          Din e-mailadresse
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Din e-mail adresse"
          aria-describedby="newsletter-status"
          className="h-full min-w-0 flex-1 bg-transparent px-5 text-[15px] text-foreground placeholder:text-foreground/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-glow h-full shrink-0 rounded-full px-7 text-[15px] font-bold disabled:opacity-70"
        >
          {pending ? 'Sender…' : 'Tilmeld'}
        </button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        className={state.status === 'error' ? 'min-h-5 text-[13px] text-destructive' : 'min-h-5 text-[13px] text-success'}
      >
        {state.message}
      </p>
    </form>
  )
}
