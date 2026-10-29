import type { Plan } from './plans'

export type AccountUser = { name: string; email: string; phone: string; createdAt: string }

export type AccountSubscription = {
  plan: Plan | null
  status: string
  trialEnd: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export type AccountInvoice = { id: string; date: string; amount: string; status: string; url: string | null }

export const hasAccess = (status: string | undefined) => status === 'trialing' || status === 'active'

export const STATUS_LABELS: Record<string, string> = {
  trialing: 'Gratis prøve',
  active: 'Aktiv',
  past_due: 'Betaling fejlet',
  unpaid: 'Ikke betalt',
  canceled: 'Opsagt',
  incomplete: 'Ikke gennemført',
  incomplete_expired: 'Udløbet',
}

export function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
}
