import type { Metadata } from 'next'
import Link from '@/components/localized-link'
import { CalcHeroBackdrop, CalcHeroStadium } from '@/components/beregn/calc-hero'
import { DesignScale } from '@/components/beregn/design-scale'
import { StakeCalculator } from '@/components/beregn/stake-calculator'
import { Sidebar } from '@/components/sb/Sidebar'
import { TopBar } from '@/components/sb/TopBar'
import { BookmakerFilterProvider } from '@/components/sb/bookmaker-filter'
import { SurebetsProvider } from '@/components/sb/surebets-context'
import { GlobalFooter } from '@/components/site/global-footer'
import { GlobalHeader } from '@/components/site/global-header'
import { getOpportunity } from '@/lib/data'
import { localePath } from '@/lib/i18n'
import { getServerLocale } from '@/lib/locale-server'
import { calculatorText } from '@/lib/messages/calculator'
import { getSbData } from '@/lib/sb-data'

export const dynamic = 'force-dynamic'

// Members-only tool: localized for visitors, but kept out of the index (logged-out crawlers are redirected anyway).
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const text = calculatorText(locale)
  return {
    title: text.metaTitle,
    description: text.metaDesc,
    alternates: { canonical: localePath(locale, '/beregn') },
    robots: { index: false, follow: true },
  }
}

export default async function BeregnPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const [opportunity, data, locale] = await Promise.all([getOpportunity(id ? Number(id) : undefined), getSbData(), getServerLocale()])
  const text = calculatorText(locale)

  return (
    <SurebetsProvider data={data}>
      <BookmakerFilterProvider>
        <div className="bi flex min-h-screen flex-col bg-(--bi-bg)">
          <GlobalHeader className="lg:hidden" />
          <div className="flex flex-1">
            <Sidebar page="beregn" />
            <main className="relative min-w-0 flex-1 lg:pb-0">
              {opportunity && (
                <DesignScale className="absolute inset-x-0 top-0 hidden lg:block" backdrop={<CalcHeroStadium />}>
                  <CalcHeroBackdrop />
                </DesignScale>
              )}
              <div className="relative z-10 hidden lg:block lg:px-[30px]">
                <TopBar page="beregn" />
              </div>
              <div className="relative flex flex-col gap-4 px-[12px] pt-[12px] lg:px-0 lg:pt-0">
                {opportunity ? (
                  <StakeCalculator key={opportunity.id} opportunity={opportunity} />
                ) : (
                  <div className="sb-panel p-8 text-center">
                    <p className="text-muted-foreground">{text.matchGone}</p>
                    <Link href={localePath(locale, '/surebets')} className="mt-3 inline-block font-semibold text-cyan underline underline-offset-4">
                      {text.seeSurebets}
                    </Link>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
        <div className="hidden lg:block">
          <GlobalFooter />
        </div>
      </BookmakerFilterProvider>
    </SurebetsProvider>
  )
}
