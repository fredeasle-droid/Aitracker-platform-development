import { SiteHeader } from '@/components/site-header';
import { OpportunityList } from '@/components/sikkerbets/opportunity-list';
import { getFeedTestOpportunities } from '@/lib/feedTestApi';

export const dynamic = 'force-dynamic';

export default async function FeedTestPage() {
  const opportunities = await getFeedTestOpportunities(1000);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Testmiljø
            </span>
            <h1 className="text-2xl font-bold mt-2">SportsGameOdds Surebet Scanner</h1>
            <p className="text-sm text-zinc-400">Viser aktive surebets på tværs af alle sportsgrene, markeder og bookmakere.</p>
          </div>
        </div>
        <OpportunityList initial={opportunities} />
      </div>
    </main>
  );
}
