import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { auth } from '@/lib/auth'
import { getOpportunities } from '@/lib/data'
import { getSubscription } from '@/lib/billing'
import { getStripe } from '@/lib/stripe'
import { AccountFlow } from './account-flow'
import { MinSide } from './min-side'
import type { AccountInvoice } from './account-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Min side – BetTracker' }

async function loadInvoices(customerId: string): Promise<AccountInvoice[]> {
  try {
    const list = await getStripe().invoices.list({ customer: customerId, limit: 12 })
    return list.data
      .filter((invoice) => invoice.status && invoice.status !== 'draft')
      .map((invoice) => ({
        id: invoice.id ?? `${invoice.created}`,
        date: new Date(invoice.created * 1000).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: new Intl.NumberFormat('da-DK', { style: 'currency', currency: invoice.currency.toUpperCase() }).format(invoice.total / 100),
        status: invoice.status ?? 'open',
        url: invoice.hosted_invoice_url ?? null,
      }))
  } catch {
    return []
  }
}

export default async function AccountPage() {
  const [session, opportunities] = await Promise.all([auth.api.getSession({ headers: await headers() }), getOpportunities()])
  const aside = <DesktopAside opportunities={opportunities} />

  if (!session?.user) return <AccountFlow aside={aside} />

  const { user } = session
  const row = await getSubscription(user.id)
  const invoices = row ? await loadInvoices(row.stripeCustomerId) : []

  return (
    <MinSide
      aside={aside}
      invoices={invoices}
      user={{ name: user.name, email: user.email, phone: user.phone ?? '', createdAt: new Date(user.createdAt).toISOString() }}
      subscription={
        row
          ? {
              plan: row.plan === 'basis' || row.plan === 'premium' ? row.plan : null,
              status: row.status,
              trialEnd: row.trialEnd?.toISOString() ?? null,
              currentPeriodEnd: row.currentPeriodEnd?.toISOString() ?? null,
              cancelAtPeriodEnd: row.cancelAtPeriodEnd,
            }
          : null
      }
    />
  )
}
