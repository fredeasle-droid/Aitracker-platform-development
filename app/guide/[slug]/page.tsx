import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight, Clock } from 'lucide-react'
import { Block, FaqList } from '@/components/seo/guide-blocks'
import { GUIDES, getGuide } from '@/lib/guides'
import { BOOKMAKER_PAGES, SPORT_PAGES } from '@/lib/landing-pages'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const AUTHOR = 'Frederik Myllerup Asler'
const BOOKMAKER_GUIDES = new Set(['bedste-bookmakere-til-surebets', 'undgaa-begraensning', 'matched-betting'])
const chipCls =
  'inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground'

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug)
  if (!guide) return {}
  const path = `/guide/${guide.slug}`
  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: [guide.keyword],
    alternates: { canonical: path },
    openGraph: { type: 'article', url: path, title: guide.metaTitle, description: guide.description, modifiedTime: guide.updated },
  }
}

const dateFormat = new Intl.DateTimeFormat('da-DK', { dateStyle: 'long' })

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug)
  if (!guide) notFound()

  const url = `${SITE_URL}/guide/${guide.slug}`
  const others = GUIDES.filter((item) => item.slug !== guide.slug)
  const related = [
    ...others.filter((item) => item.category === guide.category),
    ...others.filter((item) => item.category !== guide.category),
  ].slice(0, 3)
  const showBookmakers = BOOKMAKER_GUIDES.has(guide.slug)
  const jsonLd = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      inLanguage: 'da-DK',
      dateModified: guide.updated,
      datePublished: guide.updated,
      mainEntityOfPage: url,
      image: `${url}/opengraph-image`,
      author: { '@type': 'Person', name: 'Frederik Myllerup Asler', url: `${SITE_URL}/om-os` },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Forside', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guide` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ])

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-5 lg:px-10 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <nav aria-label="Brødkrumme" className="text-[14px] text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-foreground">Forside</Link>
          </li>
          <ChevronRight className="size-4" aria-hidden="true" />
          <li>
            <Link href="/guide" className="inline-flex min-h-11 items-center hover:text-foreground">Guides</Link>
          </li>
        </ol>
      </nav>

      <article>
        <header className="mt-2">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow">{guide.category}</p>
          <h1 className="mt-2 text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-[42px]">
            {guide.title}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {guide.readMinutes} min. læsning
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={guide.updated}>Opdateret {dateFormat.format(new Date(guide.updated))}</time>
            <span aria-hidden="true">·</span>
            <span>
              Af{' '}
              <Link href="/om-os" rel="author" className="font-semibold text-foreground/90 underline-offset-4 hover:underline">
                {AUTHOR}
              </Link>
            </span>
          </p>
          <p className="mt-5 text-pretty text-[18px] leading-relaxed text-foreground">{guide.intro}</p>
        </header>

        {guide.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}

        <FaqList items={guide.faq} />
      </article>

      <Link
        href={guide.cta.href}
        className="mt-10 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {guide.cta.label}
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>

      <section aria-labelledby="related-heading" className="mt-12">
        <h2 id="related-heading" className="text-[18px] font-bold text-foreground">Læs også</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/guide/${item.slug}`}
                className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-[15px] font-semibold text-foreground transition-colors hover:border-primary/60"
              >
                <span className="text-pretty">{item.title}</span>
                <ChevronRight className="size-4 shrink-0 text-primary-glow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sports-heading" className="mt-10">
        <h2 id="sports-heading" className="text-[18px] font-bold text-foreground">Find surebets på din sport</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          <li>
            <Link href="/dagens-surebets" className={chipCls}>Dagens surebets</Link>
          </li>
          {SPORT_PAGES.map((page) => (
            <li key={page.slug}>
              <Link href={`/sport/${page.slug}`} className={chipCls}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      {showBookmakers && (
        <section aria-labelledby="bookmakers-heading" className="mt-10">
          <h2 id="bookmakers-heading" className="text-[18px] font-bold text-foreground">Surebets hos bookmakerne</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {BOOKMAKER_PAGES.map((page) => (
              <li key={page.slug}>
                <Link href={`/bookmaker/${page.slug}`} className={chipCls}>{page.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
