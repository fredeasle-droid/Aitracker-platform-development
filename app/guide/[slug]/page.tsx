import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronDown, ChevronRight, Clock, Lightbulb } from 'lucide-react'
import { GUIDES, getGuide, type GuideBlock } from '@/lib/guides'
import { SITE_NAME, SITE_URL } from '@/lib/site'

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

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-10 text-balance text-[22px] font-bold leading-tight text-foreground lg:text-[26px]">{block.text}</h2>
    case 'p':
      return <p className="mt-4 text-pretty text-[16px] leading-relaxed text-foreground/85 lg:text-[17px]">{block.text}</p>
    case 'ul':
      return (
        <ul className="mt-4 flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-pretty text-[16px] leading-relaxed text-foreground/85">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-glow" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'example':
      return (
        <figure className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/70">
          <figcaption className="border-b border-border px-4 py-3 text-[14px] font-semibold text-foreground">{block.title}</figcaption>
          <dl className="divide-y divide-border">
            {block.rows.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3 text-[15px]">
                <dt className="text-foreground/75">{label}</dt>
                <dd className="shrink-0 text-right font-semibold tabular-nums text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          {block.note && <p className="bg-primary/10 px-4 py-3 text-[14px] leading-relaxed text-foreground/85">{block.note}</p>}
        </figure>
      )
    case 'tip':
      return (
        <aside className="mt-6 flex gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary-glow" aria-hidden="true" />
          <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">{block.text}</p>
        </aside>
      )
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug)
  if (!guide) notFound()

  const url = `${SITE_URL}/guide/${guide.slug}`
  const related = GUIDES.filter((item) => item.slug !== guide.slug).slice(0, 3)
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
      image: `${SITE_URL}/opengraph-image`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
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
          </p>
          <p className="mt-5 text-pretty text-[18px] leading-relaxed text-foreground">{guide.intro}</p>
        </header>

        {guide.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}

        <section aria-labelledby="faq-heading" className="mt-12">
          <h2 id="faq-heading" className="text-[22px] font-bold text-foreground">Ofte stillede spørgsmål</h2>
          <div className="mt-4 flex flex-col gap-3">
            {guide.faq.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl border border-border bg-card/70 open:border-primary/50">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[16px] font-semibold leading-snug text-foreground [&::-webkit-details-marker]:hidden">
                  <span className="text-pretty">{q}</span>
                  <ChevronDown className="size-5 shrink-0 text-primary-glow transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-4 pb-5 text-pretty text-[15px] leading-relaxed text-foreground/80">{a}</p>
              </details>
            ))}
          </div>
        </section>
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
    </main>
  )
}
