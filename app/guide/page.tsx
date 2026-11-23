import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { GUIDES } from '@/lib/guides'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Guides til surebets og arbitrage betting – BetTrackerAI',
  description:
    'Lær surebets fra bunden: hvad det er, hvordan du beregner indsatsen, regler og skat i Danmark, og hvordan du undgår at blive begrænset.',
  alternates: { canonical: '/guide' },
  openGraph: { url: '/guide', type: 'website' },
}

const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Guides til surebets',
  url: `${SITE_URL}/guide`,
  hasPart: GUIDES.map((guide) => ({
    '@type': 'Article',
    headline: guide.title,
    url: `${SITE_URL}/guide/${guide.slug}`,
  })),
})

export default function GuideIndexPage() {
  const [featured, ...rest] = GUIDES
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 lg:max-w-6xl lg:px-10 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

      <header className="max-w-2xl">
        <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-primary-glow">
          <BookOpen className="size-4" aria-hidden="true" />
          Guides
        </p>
        <h1 className="mt-2 text-balance text-[32px] font-extrabold leading-[1.08] tracking-tight text-foreground lg:text-[48px]">
          Alt du skal vide om surebets
        </h1>
        <p className="mt-3 text-pretty text-[16px] leading-relaxed text-foreground/80 lg:text-[17px]">
          Korte, konkrete guides skrevet til danske spillere. Fra den første beregning til at holde dine konti åbne.
        </p>
      </header>

      <Link
        href={`/guide/${featured.slug}`}
        className="group mt-8 flex flex-col gap-3 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/20 via-card/80 to-card/60 p-5 transition-colors hover:border-primary lg:p-8"
      >
        <span className="text-[13px] font-semibold text-primary-glow">Start her · {featured.category}</span>
        <h2 className="text-balance text-[24px] font-bold leading-tight text-foreground lg:text-[32px]">{featured.title}</h2>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-foreground/80">{featured.description}</p>
        <span className="mt-1 inline-flex items-center gap-2 text-[15px] font-semibold text-primary-glow">
          Læs guiden
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>

      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guide/${guide.slug}`}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card/70 p-5 transition-colors hover:border-primary/60"
            >
              <span className="text-[13px] font-semibold text-primary-glow">{guide.category}</span>
              <h2 className="text-pretty text-[18px] font-bold leading-snug text-foreground">{guide.title}</h2>
              <p className="line-clamp-3 text-pretty text-[14px] leading-relaxed text-foreground/75">{guide.description}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-2 text-[13px] text-muted-foreground">
                <Clock className="size-3.5" aria-hidden="true" />
                {guide.readMinutes} min. læsning
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
