'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Copy, Plus, RefreshCw, Search } from 'lucide-react'
import { addThread, scanNow } from '@/app/admin/seo/forum/actions'

const input =
  'min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary'

export function AddThreadForm() {
  const [message, action, pending] = useActionState(addThread, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="thread-url" className="text-sm font-semibold text-foreground">
          Link til tråden
        </label>
        <input id="thread-url" name="url" type="url" required placeholder="https://www.reddit.com/r/..." className={input} />
      </div>
      <details className="group flex flex-col gap-3">
        <summary className="cursor-pointer text-sm font-semibold text-primary-glow">Tilføj titel og tekst manuelt (hvis siden kræver login)</summary>
        <div className="flex flex-col gap-3 pt-3">
          <label className="sr-only" htmlFor="thread-title">
            Titel
          </label>
          <input id="thread-title" name="title" maxLength={300} placeholder="Trådens titel" className={input} />
          <label className="sr-only" htmlFor="thread-body">
            Indlæg
          </label>
          <textarea id="thread-body" name="body" rows={4} maxLength={4000} placeholder="Indsæt indlæggets tekst" className={`${input} py-2 leading-relaxed`} />
        </div>
      </details>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        <Plus className="size-4" aria-hidden="true" />
        {pending ? 'Læser tråd og skriver svar…' : 'Tilføj og skriv svar'}
      </button>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {message}
      </p>
    </form>
  )
}

export function ScanButton({ disabled }: { disabled: boolean }) {
  const [message, action, pending] = useActionState(scanNow, null)

  return (
    <form action={action} className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-semibold text-primary-glow disabled:opacity-50"
      >
        <Search className="size-4" aria-hidden="true" />
        {pending ? 'Søger på Reddit…' : 'Søg på Reddit nu'}
      </button>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {message}
      </p>
    </form>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copied ? 'Kopieret' : 'Kopiér svar'}
    </button>
  )
}

export function RegenerateButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:border-primary disabled:opacity-50"
    >
      <RefreshCw className={`size-4 ${pending ? 'animate-spin' : ''}`} aria-hidden="true" />
      {pending ? 'Skriver…' : 'Nyt forslag'}
    </button>
  )
}
