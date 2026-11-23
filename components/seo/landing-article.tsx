import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Block, FaqList, faqJsonLd } from '@/components/seo/guide-blocks'
import { GUIDES } from '@/lib/guides'
import { BOOKMAKER_PAGES, SPORT_PAGES, UPDATED, type LandingPage } from '@/lib/landing-pages'
import { SITE_NAME, SITE_URL } from '@/lib/site'

type Props = {
  page: LandingPage
  section: { label: string; path: string }
  siblings: LandingPage[]
}

export function LandingArticle({ page, section, siblings }: Props) {
  const url = `${SITE_URL}${section.path}/${page.slug}`
  const guides = page.guides.map((slug) => GUIDES.find((guide) => guide.slug === slug)).filter((guide) => guide !== undefined)
  const others = siblings.filter((item) => item.slug !== page.slug)
  const cross =
    section.path === '/bookmaker'
      ? { label: 'Surebets pr. sportsgren', path: '/sport', pages: SPORT_PAGES }
      : { label: 'Surebets pr. bookmaker', path: '/bookmaker', pages: BOOKMAKER_PAGES }

  const jsonLd = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      inLanguage: 'da-DK',
      url,
      dateModified: UPDATED,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Forside', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Surebets', item: `${SITE_URL}/surebets` },
        { '@type': 'ListItem', position: 3, name: page.title, item: url },
      ],
    },
    faqJsonLd(page.faq),
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
            <Link href="/surebets" className="inline-flex min-h-11 items-center hover:text-foreground">Surebets</Link>
          </li>
        </ol>
      </nav>

      <article>
        <header className="mt-2">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow">{section.label}</p>
          <h1 className="mt-2 text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-[42px]">
            {page.title}
          </h1>
          <p className="mt-5 text-pretty text-[18px] leading-relaxed text-foreground">{page.intro}</p>
        </header>

        <Link
          href="/surebets"
          className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Se aktuelle surebets
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>

        {page.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}

        <FaqList items={page.faq} />
      </article>

      {guides.length > 0 && (
        <section aria-labelledby="guides-heading" className="mt-12">
          <h2 id="guides-heading" className="text-[18px] font-bold text-foreground">Relaterede guides</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guide/${guide.slug}`}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-[15px] font-semibold text-foreground transition-colors hover:border-primary/60"
                >
                  <span className="text-pretty">{guide.title}</span>
                  <ChevronRight className="size-4 shrink-0 text-primary-glow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="others-heading" className="mt-10">
        <h2 id="others-heading" className="text-[18px] font-bold text-foreground">Flere {section.label.toLowerCase()}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`${section.path}/${item.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cross-heading" className="mt-10">
        <h2 id="cross-heading" className="text-[18px] font-bold text-foreground">{cross.label}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          <li>
            <Link
              href="/dagens-surebets"
              className="inline-flex min-h-11 items-center rounded-full border border-primary/50 bg-primary/10 px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary"
            >
              Dagens surebets
            </Link>
          </li>
          {cross.pages.map((item) => (
            <li key={item.slug}>
              <Link
                href={`${cross.path}/${item.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
