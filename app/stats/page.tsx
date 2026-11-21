import type { Metadata } from 'next'
import { RegnskabApp } from '@/components/regnskab/regnskab-app'
import { loadRegnskab } from './regnskab-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Surebet-regnskab – BetTracker',
  description: 'Følg dine surebet investeringer, profit, ROI og bankroll per bookmaker ét sted.',
}

export default async function StatsPage() {
  const initial = await loadRegnskab()
  return (
    <main className="flex w-full lg:min-h-dvh">
      <RegnskabApp initial={initial} />
    </main>
  )
}
