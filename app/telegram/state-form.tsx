'use client'

import { useActionState, type ReactNode } from 'react'
import type { ActionState } from './actions'

type StateFormProps = {
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>
  submitLabel: string
  pendingLabel: string
  variant?: 'primary' | 'secondary'
  children?: ReactNode
}

export function StateForm({ action, submitLabel, pendingLabel, variant = 'primary', children }: StateFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null)
  const buttonStyle = variant === 'primary' ? 'bg-[#138cff] text-white' : 'border border-[#38506b] bg-[#0a1725] text-white'

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {children}
      {state && (
        <p role="status" className={`text-sm ${state.ok ? 'text-[#5be39a]' : 'text-[#ff8290]'}`}>
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`flex min-h-12 items-center justify-center rounded-xl px-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyle}`}
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  )
}
