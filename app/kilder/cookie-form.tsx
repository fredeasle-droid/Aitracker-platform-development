'use client'

import { useActionState } from 'react'
import { saveSureBetDanmarkCookie, type SaveState } from './actions'

export function CookieForm() {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveSureBetDanmarkCookie, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="cookie" className="text-sm font-semibold">
        Cookie-værdi fra feed-kaldet
      </label>
      <textarea
        id="cookie"
        name="cookie"
        required
        rows={6}
        spellCheck={false}
        autoComplete="off"
        placeholder="sb-…-auth-token.0=…; sb-…-auth-token.1=…"
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
