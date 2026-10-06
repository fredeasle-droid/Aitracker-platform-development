import { SiteHeader } from '@/components/site-header'
import { FeedTestOpportunityList } from '@/components/feed-test/opportunity-list'
import { getFeedTestOpportunities } from '@/lib/feedTestApi'

export const dynamic = 'force-dynamic'

export default async function FeedTestPage() {
  const opportunities = await getFeedTestOpportunities()

  return (
    <main>
      <SiteHeader />
      <section className="px-4 pb-4 pt-5">
        <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Oddspedia Feed
        </span>
        <h1 className="mt-2 text-2xl font-extrabold">Oddspedia Sure Bets</h1>
        <p className="mt-1 text-sm text-muted-foreground">Live feed fra Oddspedia's offentlige Sure Bets-side. Ingen egen surebet-beregning.</p>
      </section>
      <FeedTestOpportunityList initial={opportunities} />
    </main>
  )
}
