import type { Metadata } from 'next'
import Link from 'next/link'
import { CalcHero } from '@/components/beregn/calc-hero'
import { StakeCalculator } from '@/components/beregn/stake-calculator'
import { Sidebar } from '@/components/sb/Sidebar'
import { TopBar } from '@/components/sb/TopBar'
import { BookmakerFilterProvider } from '@/components/sb/bookmaker-filter'
import { SurebetsProvider } from '@/components/sb/surebets-context'
import { GlobalFooter } from '@/components/site/global-footer'
import { getOpportunity } from '@/lib/data'
import { getSbData } from '@/lib/sb-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Beregn indsats – BetTrackerAI',
  description: 'Find den rigtige indsats og få garanteret profit på dit surebet.',
}

export default async function BeregnPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const [opportunity, data] = await Promise.all([getOpportunity(id ? Number(id) : undefined), getSbData()])

  return (
    <SurebetsProvider data={data}>
      <BookmakerFilterProvider>
        <div className="flex min-h-screen">
          <Sidebar page="beregn" />
          <main className="relative min-w-0 flex-1 px-4 pb-8 sm:px-6">
            <div className="hero-ambient pointer-events-none absolute inset-x-0 top-0 h-[420px]" aria-hidden="true" />
            <div className="relative lg:pl-5">
              <TopBar page="beregn" />
            </div>
            <div className="relative flex flex-col gap-4 lg:pl-5">
              {opportunity ? (
                <>
                  <CalcHero league={opportunity.league} kickoff={opportunity.kickoffLabel} />
                  <StakeCalculator key={opportunity.id} opportunity={opportunity} />
                </>
              ) : (
                <div className="sb-panel p-8 text-center">
                  <p className="text-muted-foreground">Kampen findes ikke længere.</p>
                  <Link href="/surebets" className="mt-3 inline-block font-semibold text-cyan underline underline-offset-4">
                    Se dagens surebets
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
        <GlobalFooter />
      </BookmakerFilterProvider>
    </SurebetsProvider>
  )
}
