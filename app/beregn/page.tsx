import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calculator as CalculatorIcon } from 'lucide-react'
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
    <main className="lg:min-h-dvh lg:bg-[#030914]">
      <SiteHeader />
      <div className="flex w-full gap-4 px-4 lg:items-start lg:pb-6 lg:pt-4">
          <section className="min-w-0 flex-1">
            {opportunity ? (
              <>
                <h1 className="sr-only lg:hidden">Beregner</h1>
                <div className="mb-4 hidden items-center justify-between gap-4 px-1 lg:mb-5 lg:flex">
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] lg:size-14">
                      <CalculatorIcon className="size-7" aria-hidden="true" />
                    </span>
                    <div>
                      <h1 className="text-[28px] font-extrabold leading-tight tracking-tight lg:text-[34px]">Beregner</h1>
                      <p className="text-[15px] text-[#bdc9e1] lg:text-[17px]">Find din sikre indsatsfordeling og beregn din profit.</p>
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="hidden min-h-14 items-center gap-3 rounded-xl border border-[#1d4c91] bg-[#071428] px-6 text-[16px] font-semibold text-primary transition-colors hover:bg-[#0b1d39] lg:flex"
                  >
                    <ArrowLeft className="size-5" aria-hidden="true" />
                    Vælg anden kamp
                  </Link>
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
