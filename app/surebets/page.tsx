import { Sidebar } from '@/components/sb/Sidebar'
import { TopBar } from '@/components/sb/TopBar'
import { Hero } from '@/components/sb/Hero'
import { FilterBar } from '@/components/sb/FilterBar'
import { SurebetTable } from '@/components/sb/SurebetTable'
import { RightPanel } from '@/components/sb/RightPanel'
import { LiveTicker } from '@/components/sb/LiveTicker'
import { BookmakerFilterProvider } from '@/components/sb/bookmaker-filter'
import { SurebetsProvider } from '@/components/sb/surebets-context'
import { GlobalFooter } from '@/components/site/global-footer'
import { GlobalHeader } from '@/components/site/global-header'
import { getSbData } from '@/lib/sb-data'
import { getAlertPanelData } from '@/lib/alert-panel-data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Surebets i realtid – BetTrackerAI',
  description:
    'Find de sikre odds med BetTrackerAI. Vi scanner markedet 24/7 og finder de bedste surebets på tværs af bookmakere.',
}

export default async function SurebetsPage() {
  const [data, alerts] = await Promise.all([getSbData(), getAlertPanelData()])
  return (
    <SurebetsProvider data={data}>
    <BookmakerFilterProvider>
      <GlobalHeader className="max-lg:absolute max-lg:inset-x-0 lg:hidden" />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="relative min-w-0 flex-1 px-4 pb-8 max-lg:pt-16 sm:px-6">
          {/* Full-bleed hero backdrop: fills the whole top, fades into the page */}
          <div className="hero-ambient pointer-events-none absolute inset-x-0 top-0 h-[420px]" aria-hidden="true" />
          {/* On wide screens the picture stops under the right panel so the player stays in view */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[400px] max-sm:h-[580px] max-sm:hero-fade-down xl:right-[230px]" aria-hidden="true">
            <picture>
              <source media="(max-width: 639px)" srcSet="/sb/hero-football-mobile.jpg" width={768} height={1376} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sb/hero-football.jpg"
                alt=""
                width={1920}
                height={640}
                fetchPriority="high"
                className="hero-fade h-full w-full object-cover object-[62%_18%] max-sm:object-[50%_100%] max-sm:brightness-110 xl:object-[82%_22%]"
              />
            </picture>
            <div className="sb-hero-scrim absolute inset-0 max-sm:opacity-85" />
          </div>
          <div className="relative lg:pl-5">
            <TopBar />
          </div>
          <div className="relative grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 space-y-4">
              {/* Left edges step in to follow the sidebar's curved edge */}
              <div className="lg:ml-1.5">
                <Hero />
              </div>
              <div className="lg:ml-1">
                <LiveTicker />
              </div>
              <div className="lg:ml-0.5">
                <FilterBar />
              </div>
              <div className="lg:-ml-1">
                <SurebetTable />
              </div>
            </div>
            <div className="lg:ml-5 xl:ml-0">
              <RightPanel alerts={alerts} />
            </div>
          </div>
        </main>
      </div>
      <GlobalFooter />
    </BookmakerFilterProvider>
    </SurebetsProvider>
  )
}
