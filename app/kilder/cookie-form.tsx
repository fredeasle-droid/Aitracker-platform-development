'use client'

import { useActionState } from 'react'
import type { SaveState } from './actions'

type CookieFormProps = {
  id: string
  label: string
  placeholder: string
  action: (previous: SaveState, formData: FormData) => Promise<SaveState>
}

export function CookieForm({ id, label, placeholder, action }: CookieFormProps) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        name="cookie"
        required
        rows={5}
        spellCheck={false}
        autoComplete="off"
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-[#38506b] bg-[#081725] p-3 font-mono text-xs leading-5 text-white outline-none placeholder:text-[#8da2bc] focus:border-[#138cff]"
      />
      {state && (
        <p role="status" className={`text-sm ${state.ok ? 'text-[#5be39a]' : 'text-[#ff8290]'}`}>
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 items-center justify-center rounded-xl bg-[#138cff] text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Tester og gemmer…' : 'Test og gem session'}
      </button>
    </form>
  )
}
