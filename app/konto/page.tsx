import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { auth } from '@/lib/auth'
import { getOpportunities } from '@/lib/data'
import { ACTIVE_STATUSES, getSubscription } from '@/lib/billing'
import { OnboardingStep } from '@/components/konto/onboarding-step'
import { getStripe } from '@/lib/stripe'
import { AccountFlow } from './account-flow'
import { MinSide } from './min-side'
import type { AccountInvoice } from './account-types'
import { isPreviewTestEnvironment } from '@/lib/test-access'

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

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ login?: string; testAccess?: string }> }) {
  const [session, opportunities, { login, testAccess }] = await Promise.all([auth.api.getSession({ headers: await headers() }), getOpportunities(), searchParams])
  const aside = <DesktopAside opportunities={opportunities} />

  if (!session?.user) return <AccountFlow aside={aside} startInLogin={login === '1'} allowTestAccess={isPreviewTestEnvironment()} />

  const { user } = session
  if (testAccess === '1' && isPreviewTestEnvironment()) return <OnboardingStep />

  const row = await getSubscription(user.id)
  if (row && ACTIVE_STATUSES.includes(row.status) && !row.onboardingCompletedAt) {
    return <OnboardingStep initialResponses={row.onboardingResponses ?? {}} />
  }
  const invoices = row ? await loadInvoices(row.stripeCustomerId) : []

  return (
    <MinSide
      invoices={invoices}
      user={{ name: user.name, email: user.email, phone: user.phone ?? '', createdAt: new Date(user.createdAt).toISOString() }}
      testAccess={isPreviewTestEnvironment()}
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
