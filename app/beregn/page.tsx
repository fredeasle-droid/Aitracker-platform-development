import type { Metadata } from 'next'
import Link from 'next/link'
import { CalcHeroBackdrop } from '@/components/beregn/calc-hero'
import { DesignScale } from '@/components/beregn/design-scale'
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
        <div className="bi flex min-h-screen bg-(--bi-bg)">
          <Sidebar page="beregn" />
          <main className="relative min-w-0 flex-1 px-3 pb-8 sm:px-6 lg:px-0 lg:pb-0">
            {opportunity && (
              <DesignScale className="absolute inset-x-0 top-0 hidden lg:block">
                <CalcHeroBackdrop />
              </DesignScale>
            )}
            <div className="relative z-10 lg:px-[30px]">
              <TopBar page="beregn" />
            </div>
            <div className="relative flex flex-col gap-4">
              {opportunity ? (
                <StakeCalculator key={opportunity.id} opportunity={opportunity} />
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
