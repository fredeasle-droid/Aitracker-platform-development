import type { Metadata } from 'next'
import { Calculator } from '@/components/beregn/calculator'
import { MatchCard } from '@/components/beregn/match-card'
import { SiteHeader } from '@/components/site-header'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { getOpportunity, getOpportunities } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Beregn indsats – BetTracker' }

export default async function BeregnPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const [opportunity, opportunities] = await Promise.all([
    getOpportunity(id ? Number(id) : undefined),
    getOpportunities(),
  ])

  return (
    <main className="min-h-dvh bg-[#030914]">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1450px] gap-5 px-4 py-5 lg:px-6 xl:gap-8">
          <section className="min-w-0 flex-1 lg:max-w-[925px]">
            {opportunity ? (
              <>
                <div className="mb-5 flex items-center justify-between gap-4 px-1">
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)]">▦</span>
                    <div><h1 className="text-[30px] font-extrabold tracking-tight">Beregner</h1><p className="text-[16px] text-[#bdc9e1]">Find din sikre indsatsfordeling og beregn din profit.</p></div>
                  </div>
                  <a href="/" className="hidden min-h-12 items-center rounded-xl border border-[#1d4c91] px-5 text-[15px] font-semibold text-primary hover:bg-[#0b1d39] lg:flex">← Vælg anden kamp</a>
                </div>
                <MatchCard opportunity={opportunity} />
                <Calculator key={opportunity.id} opportunity={opportunity} />
              </>
            ) : (
              <p className="rounded-2xl border border-border p-8 text-center text-muted-foreground">Der er ingen SikkerBets lige nu.</p>
            )}
          </section>
          <DesktopAside opportunities={opportunities} />
        </div>
    </main>
  )
}
