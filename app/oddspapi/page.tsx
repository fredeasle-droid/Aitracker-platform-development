import { OpportunityList } from '@/components/sikkerbets/opportunity-list'
import { SiteHeader } from '@/components/site-header'
import { getLiveSurebets } from '@/lib/sportsgameodds'

export const dynamic = 'force-dynamic'

export default async function SikkerBetsPreviewPage() {
  const opportunities = await getLiveSurebets()

  return (
    <main>
      <SiteHeader />
      <h1 className="sr-only">SikkerBets live API-test</h1>
      {opportunities.length ? (
        <OpportunityList initial={opportunities} />
      ) : (
        <section className="mx-auto max-w-xl px-4 py-16 text-center">
          <h2 className="text-xl font-bold">Ingen live-surebets fundet</h2>
          <p className="mt-2 text-muted-foreground">API-feedet returnerede ingen aktuelle surebets lige nu.</p>
        </section>
      )}
    </main>
  )
}
