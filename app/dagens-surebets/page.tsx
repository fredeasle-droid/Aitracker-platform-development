import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { formatPct, surebetProfitPct } from '@/components/sb/data'
import { FaqList, faqJsonLd } from '@/components/seo/guide-blocks'
import { SPORT_PAGES } from '@/lib/landing-pages'
import { getSbData, type SbData } from '@/lib/sb-data'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Dagens surebets – de bedste sikre odds lige nu',
  description:
    'Se dagens bedste surebets hos danske bookmakere, opdateret løbende. Sport, kamp, marked og garanteret profit for de stærkeste muligheder lige nu.',
  alternates: { canonical: '/dagens-surebets' },
  openGraph: { url: '/dagens-surebets', type: 'website' },
}

const SHOWN = 5

const FAQ = [
  {
    q: 'Hvor ofte opdateres dagens surebets?',
    a: 'Siden opdateres hvert tiende minut. Inde i BetTrackerAI ser du surebets i realtid, så snart scanneren finder dem.',
  },
  {
    q: 'Hvorfor kan jeg ikke se oddsene?',
    a: 'Odds og indsatsfordeling er forbeholdt medlemmer, fordi surebets forsvinder hurtigt, når mange spiller dem. Opret dig for at se de præcise odds og alle aktuelle muligheder.',
  },
  {
    q: 'Er profitten garanteret?',
    a: 'Ja, så længe du får alle spil placeret til de viste odds. Oddsene kan ændre sig hurtigt, så tjek altid oddsene hos bookmakeren, før du spiller.',
  },
]

async function loadData(): Promise<SbData | null> {
  try {
    return await getSbData()
  } catch {
    return null
  }
}

const dayFormat = new Intl.DateTimeFormat('da-DK', { dateStyle: 'long', timeZone: 'Europe/Copenhagen' })
const timeFormat = new Intl.DateTimeFormat('da-DK', { timeStyle: 'short', timeZone: 'Europe/Copenhagen' })

export default async function DailySurebetsPage() {
  const data = await loadData()
  const now = new Date()
  const names = new Map(data?.bookmakers.map((b) => [b.id, b.name]) ?? [])
  const top = data?.surebets.slice(0, SHOWN) ?? []
  const hidden = Math.max(0, (data?.surebets.length ?? 0) - top.length)
  const sportSlug = new Map(SPORT_PAGES.map((page) => [page.name, page.slug]))

  const jsonLd = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Dagens surebets',
      url: `${SITE_URL}/dagens-surebets`,
      inLanguage: 'da-DK',
      dateModified: now.toISOString(),
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    faqJsonLd(FAQ),
  ])

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 lg:px-10 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <header>
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow">
          {dayFormat.format(now)}
        </p>
        <h1 className="mt-2 text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-[42px]">
          Dagens surebets
        </h1>
        <p className="mt-4 text-pretty text-[18px] leading-relaxed text-foreground">
          De stærkeste surebets hos danske bookmakere lige nu, sorteret efter garanteret profit. Opdateret kl.{' '}
          <time dateTime={now.toISOString()}>{timeFormat.format(now)}</time>.
        </p>
      </header>

      {top.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card/60 p-5 text-[16px] leading-relaxed text-foreground/85">
          Der er ingen aktive surebets i øjeblikket. Scanneren kører døgnet rundt, så kig forbi igen om lidt.
        </p>
      ) : (
        <ol className="mt-8 flex flex-col gap-3">
          {top.map((bet) => {
            const books = bet.legs.map((leg) => names.get(leg.bookmaker) ?? leg.bookmaker).join(' og ')
            return (
              <li key={bet.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-muted-foreground">
                    {bet.sport} · {bet.league}
                  </p>
                  <h2 className="mt-1 text-pretty text-[17px] font-bold text-foreground">
                    {bet.home.name} – {bet.away.name}
                  </h2>
                  <p className="mt-1 text-[14px] leading-relaxed text-foreground/80">
                    {bet.market} hos {books}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <span className="text-[22px] font-extrabold text-success">{formatPct(surebetProfitPct(bet.legs.map((l) => l.odds)))}</span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <Lock className="size-3.5" aria-hidden="true" />
                    Odds for medlemmer
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <Link
        href="/surebets"
        className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {hidden > 0 ? `Se odds og ${hidden} surebets mere` : 'Se odds og indsatser'}
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>

      {data && data.sports.length > 0 && (
        <section aria-labelledby="sports-heading" className="mt-12">
          <h2 id="sports-heading" className="text-[20px] font-bold text-foreground">Surebets fordelt på sport</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.sports.map((sport) => {
              const slug = sportSlug.get(sport.label)
              const label = `${sport.label} (${sport.count})`
              const cls =
                'inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85'
              return (
                <li key={sport.label}>
                  {slug ? (
                    <Link href={`/sport/${slug}`} className={`${cls} transition-colors hover:border-primary/60 hover:text-foreground`}>
                      {label}
                    </Link>
                  ) : (
                    <span className={cls}>{label}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-[20px] font-bold text-foreground">Sådan spiller du et surebet</h2>
        <p className="mt-3 text-pretty text-[16px] leading-relaxed text-foreground/85">
          Et surebet betyder, at du spiller på alle udfald hos forskellige bookmakere og får gevinst uanset resultatet. Fordel indsatsen med{' '}
          <Link href="/beregn" className="font-semibold text-primary-glow underline-offset-4 hover:underline">surebet-beregneren</Link>, og læs{' '}
          <Link href="/guide/hvad-er-surebets" className="font-semibold text-primary-glow underline-offset-4 hover:underline">guiden til surebets</Link>, hvis du er ny.
        </p>
      </section>

      <FaqList items={FAQ} />
    </main>
  )
}
