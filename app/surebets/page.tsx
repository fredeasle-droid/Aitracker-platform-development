import { Sidebar } from '@/components/sb/Sidebar'
import { TopBar } from '@/components/sb/TopBar'
import { Hero } from '@/components/sb/Hero'
import { FilterBar } from '@/components/sb/FilterBar'
import { SurebetTable } from '@/components/sb/SurebetTable'
import { RightPanel } from '@/components/sb/RightPanel'
import { LiveTicker } from '@/components/sb/LiveTicker'
import { BookmakerFilterProvider } from '@/components/sb/bookmaker-filter'

export const metadata = {
  title: 'Surebets i realtid – BetTrackerAI',
  description:
    'Find de sikre odds med BetTrackerAI. Vi scanner markedet 24/7 og finder de bedste surebets på tværs af bookmakere.',
}

export default function SurebetsPage() {
  return (
    <BookmakerFilterProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="relative min-w-0 flex-1 px-4 pb-8 sm:px-6">
          {/* Full-bleed hero backdrop: fills the whole top, fades into the page */}
          <div className="hero-ambient pointer-events-none absolute inset-x-0 top-0 h-[420px]" aria-hidden="true" />
          {/* On wide screens the picture stops under the right panel so the player stays in view */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[400px] xl:right-[230px]" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sb/hero-football.jpg"
              alt=""
              width={1920}
              height={640}
              fetchPriority="high"
              className="hero-fade h-full w-full object-cover object-[62%_18%] xl:object-[82%_22%]"
            />
            <div className="sb-hero-scrim absolute inset-0" />
            <div className="absolute inset-0 bg-background/45 sm:hidden" />
          </div>
          <div className="relative lg:pl-5">
            <TopBar />
          </div>
          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
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
              <RightPanel />
            </div>
          </div>
          <footer className="relative mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 text-[12.5px] text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2.5">
              <span className="age-badge flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold">18+</span>
              Spil ansvarligt. Har du brug for hjælp, så kontakt StopSpillet på 70 22 28 25.
            </div>
            <div>© {new Date().getFullYear()} BetTrackerAI</div>
          </footer>
        </main>
      </div>
    </BookmakerFilterProvider>
  )
}
