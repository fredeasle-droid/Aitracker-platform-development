'use client'

import { useActionState } from 'react'
import { RefreshCw } from 'lucide-react'
import { syncNow } from '@/app/admin/seo/actions'

export function SyncButton({ disabled }: { disabled: boolean }) {
  const [message, action, pending] = useActionState(syncNow, null)

  return (
    <form action={action} className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
      >
        <RefreshCw className={`size-4 ${pending ? 'animate-spin' : ''}`} aria-hidden="true" />
        {pending ? 'Henter data…' : 'Synkronisér nu'}
      </button>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {message}
      </p>
    </form>
  )
}
