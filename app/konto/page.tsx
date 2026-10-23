import type { Metadata } from 'next'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { getOpportunities } from '@/lib/data'
import { AccountFlow } from './account-flow'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Opret konto – BetTracker' }

export default async function AccountPage() {
  const opportunities = await getOpportunities()
  return <AccountFlow aside={<DesktopAside opportunities={opportunities} />} />
}
