import { SportsGameOddsEventFeed } from '@/components/sportsgameodds/event-feed'

export const dynamic = 'force-dynamic'

export default function OddsApiTestPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">SportsGameOdds scanner</p>
        <h1 className="mt-2 text-3xl font-bold">Live surebets</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Denne side bruger den nye arbitrage-beregning fra SportsGameOdds-guiden og viser kun matematisk gyldige muligheder.
        </p>
        <section className="mt-6" aria-label="SportsGameOdds surebet-feed">
          <SportsGameOddsEventFeed />
        </section>
      </div>
    </main>
  )
}
