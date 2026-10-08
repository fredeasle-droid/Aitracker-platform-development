import { SiteHeader } from '@/components/site-header'
import { FeedTestOpportunityList } from '@/components/feed-test/opportunity-list'
import { getFeedTestOpportunities } from '@/lib/feedTestApi'

export const dynamic = 'force-dynamic'

export default async function FeedTestPage() {
  const opportunities = await getFeedTestOpportunities(1000)

  return (
    <main>
      <SiteHeader />
      <section className="px-4 pb-4 pt-5">
        <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Testmiljø
        </span>
        <h1 className="mt-2 text-2xl font-extrabold">Test Feed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Separat test af SportsGameOdds-feedet og surebet-beregningen.
        </p>
      </section>
      <FeedTestOpportunityList initial={opportunities} />
    </main>
  )
}
