import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calculator as CalculatorIcon } from 'lucide-react'
import { Calculator } from '@/components/beregn/calculator'
import { MatchCard } from '@/components/beregn/match-card'
import { BeregnAside } from '@/components/beregn/beregn-aside'
import { Sidebar } from '@/components/sb/Sidebar'
import { TopBar } from '@/components/sb/TopBar'
import { BookmakerFilterProvider } from '@/components/sb/bookmaker-filter'
import { SurebetsProvider } from '@/components/sb/surebets-context'
import { GlobalFooter } from '@/components/site/global-footer'
import { getOpportunity, getOpportunities } from '@/lib/data'
import { getSbData } from '@/lib/sb-data'
import { getServerT } from '@/lib/locale-server'

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT()
  return { title: t('calcMetaTitle') }
}

export default async function BeregnPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const { t } = await getServerT()
  const [opportunity, opportunities, sbData] = await Promise.all([
    getOpportunity(id ? Number(id) : undefined),
    getOpportunities(),
    getSbData(),
  ])

  return (
    <SurebetsProvider data={sbData}>
      <BookmakerFilterProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="relative min-w-0 flex-1 px-4 pb-8 sm:px-6">
            <div className="hero-ambient pointer-events-none absolute inset-x-0 top-0 h-[420px]" aria-hidden="true" />
            <div className="relative lg:pl-5">
              <TopBar />
            </div>
            <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
              <section className="flex min-w-0 flex-col gap-3 lg:ml-1.5 lg:gap-4">
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                    <span className="bg-gradient-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-glow lg:size-14">
                      <CalculatorIcon className="size-5 lg:size-7" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h1 className="text-balance text-[22px] font-extrabold leading-tight tracking-tight lg:text-[34px]">{t('calculatorTitle')}</h1>
                      <p className="hidden text-pretty text-[14px] leading-snug text-muted-foreground sm:block lg:text-[16px]">{t('calcSubtitle')}</p>
                    </div>
                  </div>
                  <Link
                    href="/"
                    aria-label={t('chooseOther')}
                    className="glass-pill flex size-11 shrink-0 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-primary-glow transition hover:brightness-125 lg:h-12 lg:w-auto lg:px-5"
                  >
                    <ArrowLeft className="size-5" aria-hidden="true" />
                    <span className="hidden lg:inline">{t('chooseOther')}</span>
                  </Link>
                </div>
                {opportunity ? (
                  <>
                    <MatchCard opportunity={opportunity} />
                    <Calculator key={opportunity.id} opportunity={opportunity} />
                  </>
                ) : (
                  <p className="sb-panel p-8 text-center text-muted-foreground">{t('noSureBets')}</p>
                )}
              </section>
              <BeregnAside opportunities={opportunities} />
            </div>
          </main>
        </div>
        <GlobalFooter />
      </BookmakerFilterProvider>
    </SurebetsProvider>
  )
}
