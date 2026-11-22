import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
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
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { smsAlertSettings } from '@/lib/db/schema'

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

/** Only same-site paths are allowed, so `next` can't be used as an open redirect. */
function safeReturnPath(next: string | undefined) {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : undefined
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ login?: string; testAccess?: string; next?: string }> }) {
  const [session, opportunities, { login, testAccess, next }] = await Promise.all([auth.api.getSession({ headers: await headers() }), getOpportunities(), searchParams])
  const aside = <DesktopAside opportunities={opportunities} />
  const returnTo = safeReturnPath(next)

  if (!session?.user) return <AccountFlow aside={aside} startInLogin={login === '1'} allowTestAccess={isPreviewTestEnvironment()} returnTo={returnTo} />
  if (returnTo) redirect(returnTo)

  const { user } = session
  if (testAccess === '1' && isPreviewTestEnvironment()) return <OnboardingStep />

  const row = await getSubscription(user.id)
  if (row && ACTIVE_STATUSES.includes(row.status) && !row.onboardingCompletedAt) {
    return <OnboardingStep initialResponses={row.onboardingResponses ?? {}} />
  }
  const [invoices, smsRow] = await Promise.all([
    row ? loadInvoices(row.stripeCustomerId) : Promise.resolve([]),
    db.select().from(smsAlertSettings).where(eq(smsAlertSettings.userId, user.id)).then((r) => r[0]).catch(() => undefined),
  ])

  return (
    <MinSide
      invoices={invoices}
      smsSettings={{
        enabled: smsRow?.enabled ?? false,
        minProfit: smsRow ? Number(smsRow.minProfit) : 5,
        dailyLimit: smsRow?.dailyLimit ?? 10,
        quietStart: smsRow?.quietStart ?? 23,
        quietEnd: smsRow?.quietEnd ?? 7,
      }}
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
