import { SportsGameOddsEventFeed } from '@/components/sportsgameodds/event-feed'

export const dynamic = 'force-dynamic'

export default function OddsApiTestPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">SportsGameOdds feed</p>
        <h1 className="mt-2 text-3xl font-bold">Live rå odds</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Denne side bruger den nye guide-integration direkte. Den gamle testfeed og den gamle surebet-normalisering bruges ikke her.
        </p>
        <section className="mt-6" aria-label="SportsGameOdds rå odds-feed">
          <SportsGameOddsEventFeed />
        </section>
      </div>
    </main>
  )
}
