import type { Metadata } from 'next'
import { Calculator } from '@/components/beregn/calculator'
import { MatchCard } from '@/components/beregn/match-card'
import { SiteHeader } from '@/components/site-header'
import { getOpportunity } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Beregn indsats – BetTracker' }

export default async function BeregnPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const opportunity = await getOpportunity(id ? Number(id) : undefined)

  return (
    <main>
      <SiteHeader />
      <div className="px-4">
        {opportunity ? (
          <>
            <MatchCard opportunity={opportunity} />
            <Calculator key={opportunity.id} opportunity={opportunity} />
          </>
        ) : (
          <p className="rounded-2xl border border-border p-8 text-center text-muted-foreground">
            Der er ingen SikkerBets lige nu.
          </p>
        )}
      </div>
    </main>
  )
}
