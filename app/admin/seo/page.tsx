import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowDown, ArrowUp, ExternalLink, Minus, Trash2 } from 'lucide-react'
import { getOwnerState } from '@/lib/admin'
import { GUIDES } from '@/lib/guides'
import { getSeoDashboard, type SeoKeywordRow, type SeoTotals } from '@/lib/seo/dashboard'
import { getSearchConsoleConfig } from '@/lib/seo/search-console'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/site'
import { SeoTrendChart } from '@/components/seo/seo-trend-chart'
import { SyncButton } from '@/components/seo/sync-button'
import { addKeyword, deleteKeyword } from './actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'SEO – BetTracker', robots: { index: false, follow: false } }

const card = 'flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 lg:p-6'
const input =
  'min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary'

const formatNumber = (value: number) => value.toLocaleString('da-DK')
const formatPosition = (value: number | null) => (value === null ? '–' : value.toFixed(1))
const formatTime = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('da-DK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Copenhagen' }).format(new Date(iso)) : 'Aldrig'

function Delta({ current, previous, lowerIsBetter = false, format }: { current: number | null; previous: number | null; lowerIsBetter?: boolean; format: (n: number) => string }) {
  if (current === null || previous === null || previous === 0) return <span className="text-sm text-muted-foreground">Ingen sammenligning</span>
  const diff = current - previous
  if (Math.abs(diff) < 0.05) return <span className="text-sm text-muted-foreground">Uændret</span>
  const better = lowerIsBetter ? diff < 0 : diff > 0
  const Icon = diff > 0 ? ArrowUp : ArrowDown
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${better ? 'text-success' : 'text-destructive'}`}>
      <Icon className="size-4" aria-hidden="true" />
      {format(Math.abs(diff))}
      <span className="sr-only">{better ? 'bedre' : 'dårligere'} end forrige periode</span>
    </span>
  )
}

function KpiGrid({ current, previous }: { current: SeoTotals; previous: SeoTotals }) {
  const items = [
    { label: 'Klik', value: formatNumber(current.clicks), delta: <Delta current={current.clicks} previous={previous.clicks} format={formatNumber} /> },
    { label: 'Visninger', value: formatNumber(current.impressions), delta: <Delta current={current.impressions} previous={previous.impressions} format={formatNumber} /> },
    {
      label: 'Gns. position',
      value: formatPosition(current.position),
      delta: <Delta current={current.position} previous={previous.position} lowerIsBetter format={(n) => n.toFixed(1)} />,
    },
    {
      label: 'CTR',
      value: `${(current.ctr * 100).toFixed(1)}%`,
      delta: <Delta current={current.ctr * 100} previous={previous.ctr * 100} format={(n) => `${n.toFixed(1)} pt`} />,
    },
  ]
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4">
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-2xl font-bold tabular-nums text-foreground">{item.value}</dd>
          <dd>{item.delta}</dd>
        </div>
      ))}
    </dl>
  )
}

function PositionChange({ row }: { row: SeoKeywordRow }) {
  if (row.position === null || row.previousPosition === null) return <Minus className="size-4 text-muted-foreground" aria-label="Ingen ændring" />
  const diff = row.previousPosition - row.position
  if (Math.abs(diff) < 0.1) return <Minus className="size-4 text-muted-foreground" aria-label="Uændret" />
  const up = diff > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${up ? 'text-success' : 'text-destructive'}`}>
      {up ? <ArrowUp className="size-4" aria-hidden="true" /> : <ArrowDown className="size-4" aria-hidden="true" />}
      {Math.abs(diff).toFixed(1)}
      <span className="sr-only">{up ? 'pladser op' : 'pladser ned'}</span>
    </span>
  )
}

function positionTone(position: number | null) {
  if (position === null) return 'bg-muted text-muted-foreground'
  if (position <= 3) return 'bg-success/15 text-success'
  if (position <= 10) return 'bg-primary/15 text-primary-glow'
  return 'bg-muted text-foreground'
}

function SetupGuide() {
  return (
    <section className={card} aria-labelledby="setup-title">
      <h2 id="setup-title" className="text-lg font-bold text-foreground">
        Forbind Google Search Console
      </h2>
      <p className="text-pretty leading-relaxed text-muted-foreground">
        Dashboardet henter jeres rigtige placeringer, klik og visninger fra Google hver morgen kl. 05. Det kræver en gratis service-konto:
      </p>
      <ol className="flex list-decimal flex-col gap-2 pl-5 leading-relaxed text-foreground/90">
        <li>Opret et projekt i Google Cloud Console og slå &quot;Google Search Console API&quot; til.</li>
        <li>Opret en service-konto under IAM og hent en nøgle som JSON.</li>
        <li>Bekræft domænet bettrackerai.com i Search Console (domæne-ejendom via DNS).</li>
        <li>Tilføj service-kontoens e-mail som bruger på ejendommen under Indstillinger &gt; Brugere.</li>
        <li>
          Læg <code className="rounded bg-muted px-1.5 py-0.5 text-sm">GSC_CLIENT_EMAIL</code> og{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">GSC_PRIVATE_KEY</code> ind under Vars i v0.
        </li>
        <li>Indsend sitemap: {SITE_URL}/sitemap.xml i Search Console.</li>
      </ol>
    </section>
  )
}

export default async function SeoDashboardPage() {
  const state = await getOwnerState()
  if (state === 'signed-out') redirect('/konto')
  if (state === 'forbidden') {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-16">
        <h1 className="text-2xl font-bold text-foreground">Ingen adgang</h1>
        <p className="text-muted-foreground">SEO-dashboardet er kun for ejere af BetTracker.</p>
      </main>
    )
  }

  const connected = getSearchConsoleConfig() !== null
  const data = await getSeoDashboard()
  const hasData = data.series.length > 0

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-20 pt-6 lg:gap-8 lg:px-10 lg:pt-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-glow">Admin</p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">SEO og rankings</h1>
          <p className="text-sm text-muted-foreground">
            {connected ? 'Search Console forbundet' : 'Search Console ikke forbundet'} · Sidst hentet {formatTime(data.lastSync)}
          </p>
          {data.lastStatus?.startsWith('Fejl') && <p className="text-sm text-destructive">{data.lastStatus}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Link
            href="/admin/seo/forum"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary px-4 text-sm font-semibold text-primary-glow"
          >
            Forum-radar
          </Link>
          <SyncButton disabled={!connected} />
        </div>
      </header>

      {!connected && <SetupGuide />}

      <section aria-labelledby="kpi-title" className="flex flex-col gap-3">
        <h2 id="kpi-title" className="text-lg font-bold text-foreground">
          Seneste 28 dage
        </h2>
        <KpiGrid current={data.current} previous={data.previous} />
      </section>

      <section className={card} aria-labelledby="trend-title">
        <h2 id="trend-title" className="text-lg font-bold text-foreground">
          Udvikling
        </h2>
        {hasData ? (
          <SeoTrendChart data={data.series} />
        ) : (
          <p className="text-muted-foreground">Grafen fyldes ud efter første synkronisering.</p>
        )}
      </section>

      <section className={card} aria-labelledby="keywords-title">
        <div className="flex flex-col gap-1">
          <h2 id="keywords-title" className="text-lg font-bold text-foreground">
            Søgeord vi følger ({data.keywords.length})
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">Position er gennemsnit for de seneste 7 dage. Pilen viser ændring mod ugen før.</p>
        </div>

        <form action={addKeyword} className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="keyword">
            Søgeord
          </label>
          <input id="keyword" name="keyword" required minLength={2} maxLength={80} placeholder="Nyt søgeord" className={input} />
          <label className="sr-only" htmlFor="targetPath">
            Målside
          </label>
          <input id="targetPath" name="targetPath" placeholder="/guide/..." className={`${input} sm:max-w-48`} />
          <button type="submit" className="min-h-11 shrink-0 rounded-xl border border-primary px-4 text-sm font-semibold text-primary-glow">
            Tilføj
          </button>
        </form>

        <ul className="flex flex-col divide-y divide-border">
          {data.keywords.map((row) => (
            <li key={row.id} className="flex items-center gap-3 py-3">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-base font-bold tabular-nums ${positionTone(row.position)}`}>
                {formatPosition(row.position)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-semibold text-foreground">{row.keyword}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {row.targetPath} · {formatNumber(row.clicks)} klik · {formatNumber(row.impressions)} visn.
                  {row.bestPosition !== null && ` · bedst ${row.bestPosition.toFixed(1)}`}
                </span>
              </div>
              <PositionChange row={row} />
              <form action={deleteKeyword}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className="flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" aria-hidden="true" />
                  <span className="sr-only">Fjern {row.keyword}</span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className={card} aria-labelledby="discovered-title">
        <div className="flex flex-col gap-1">
          <h2 id="discovered-title" className="text-lg font-bold text-foreground">
            Opdagede søgninger
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">Søgninger hvor I allerede vises, men som I ikke følger endnu.</p>
        </div>
        {data.discovered.length === 0 ? (
          <p className="text-muted-foreground">Ingen data endnu.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {data.discovered.map((row) => (
              <li key={row.query} className="flex items-center gap-3 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-semibold text-foreground">{row.query}</span>
                  <span className="text-sm text-muted-foreground">
                    Pos. {row.position.toFixed(1)} · {formatNumber(row.impressions)} visn. · {formatNumber(row.clicks)} klik
                  </span>
                </div>
                <form action={addKeyword}>
                  <input type="hidden" name="keyword" value={row.query} />
                  <button type="submit" className="min-h-11 rounded-xl border border-border px-3 text-sm font-semibold text-foreground hover:border-primary">
                    Følg
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={card} aria-labelledby="tech-title">
        <h2 id="tech-title" className="text-lg font-bold text-foreground">
          Teknisk SEO
        </h2>
        <ul className="flex flex-col gap-2 text-foreground/90">
          <li>{PUBLIC_PAGES.length + GUIDES.length} sider i sitemap, heraf {GUIDES.length} guides</li>
          <li>Canonical, OpenGraph-billede og struktureret data på offentlige sider</li>
          <li>Private sider (konto, admin, API) er udelukket i robots.txt</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/sitemap.xml', label: 'sitemap.xml' },
            { href: '/robots.txt', label: 'robots.txt' },
            { href: '/guide', label: 'Guides' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-semibold text-foreground hover:border-primary"
            >
              {link.label}
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
