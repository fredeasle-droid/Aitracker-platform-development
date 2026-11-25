import Link from '@/components/localized-link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Block, FaqList, faqJsonLd } from '@/components/seo/guide-blocks'
import { getLocalizedGuide, getLocalizedLandingList } from '@/lib/content-i18n'
import { LOCALES, localePath, type Locale } from '@/lib/i18n'
import { UPDATED, type LandingPage } from '@/lib/landing-pages'
import { absoluteUrl } from '@/lib/seo/alternates'
import { SEO_STRINGS } from '@/lib/seo/ui-strings'
import { SITE_NAME, SITE_URL } from '@/lib/site'

type Kind = 'sport' | 'bookmaker'

type Props = {
  page: LandingPage
  kind: Kind
  locale: Locale
}

export function LandingArticle({ page, kind, locale }: Props) {
  const text = SEO_STRINGS[locale]
  const sectionPath = `/${kind}`
  const sectionLabel = kind === 'sport' ? text.sportsLabel : text.bookmakersLabel
  const url = absoluteUrl(locale, `${sectionPath}/${page.slug}`)
  const guides = page.guides.map((slug) => getLocalizedGuide(slug, locale)).filter((guide) => guide !== undefined)
  const others = getLocalizedLandingList(kind, locale).filter((item) => item.slug !== page.slug)
  const crossKind: Kind = kind === 'bookmaker' ? 'sport' : 'bookmaker'
  const cross = {
    label: kind === 'bookmaker' ? text.crossSports : text.crossBookmakers,
    path: `/${crossKind}`,
    pages: getLocalizedLandingList(crossKind, locale),
  }

  const jsonLd = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      inLanguage: LOCALES[locale].tag,
      url,
      dateModified: UPDATED,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: text.home, item: absoluteUrl(locale, '/') },
        { '@type': 'ListItem', position: 2, name: text.surebets, item: absoluteUrl(locale, '/surebets') },
        { '@type': 'ListItem', position: 3, name: page.title, item: url },
      ],
    },
    faqJsonLd(page.faq),
  ])

  const chipCls =
    'inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground'

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-5 lg:px-10 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <nav aria-label={text.breadcrumb} className="text-[14px] text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href={localePath(locale, '/')} className="inline-flex min-h-11 items-center hover:text-foreground">{text.home}</Link>
          </li>
          <ChevronRight className="size-4" aria-hidden="true" />
          <li>
            <Link href={localePath(locale, '/surebets')} className="inline-flex min-h-11 items-center hover:text-foreground">{text.surebets}</Link>
          </li>
        </ol>
      </nav>

      <article>
        <header className="mt-2">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow">{sectionLabel}</p>
          <h1 className="mt-2 text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-[42px]">
            {page.title}
          </h1>
          <p className="mt-5 text-pretty text-[18px] leading-relaxed text-foreground">{page.intro}</p>
        </header>

        <Link
          href={localePath(locale, '/surebets')}
          className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {text.seeCurrent}
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>

        {page.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}

        <FaqList items={page.faq} heading={text.faq} />
      </article>

      {guides.length > 0 && (
        <section aria-labelledby="guides-heading" className="mt-12">
          <h2 id="guides-heading" className="text-[18px] font-bold text-foreground">{text.relatedGuides}</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={localePath(locale, `/guide/${guide.slug}`)}
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
        <h2 id="others-heading" className="text-[18px] font-bold text-foreground">{text.moreOf(sectionLabel)}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={localePath(locale, `${sectionPath}/${item.slug}`)} className={chipCls}>
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
              href={localePath(locale, '/dagens-surebets')}
              className="inline-flex min-h-11 items-center rounded-full border border-primary/50 bg-primary/10 px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary"
            >
              {text.todays}
            </Link>
          </li>
          {cross.pages.map((item) => (
            <li key={item.slug}>
              <Link href={localePath(locale, `${cross.path}/${item.slug}`)} className={chipCls}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
