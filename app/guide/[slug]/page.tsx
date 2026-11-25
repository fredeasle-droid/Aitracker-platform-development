import type { Metadata } from 'next'
import Link from '@/components/localized-link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight, Clock } from 'lucide-react'
import { Block, FaqList } from '@/components/seo/guide-blocks'
import { YoutubeFacade } from '@/components/seo/youtube-facade'
import { videoObjectJsonLd } from '@/lib/video'
import { getLocalizedGuide, getLocalizedGuides, getLocalizedLandingList, guideLocales } from '@/lib/content-i18n'
import { GUIDES } from '@/lib/guides'
import { LOCALES, OG_LOCALE, localePath, type Locale } from '@/lib/i18n'
import { getServerLocale } from '@/lib/locale-server'
import { absoluteUrl, buildAlternates, localeRobots } from '@/lib/seo/alternates'
import { SEO_STRINGS } from '@/lib/seo/ui-strings'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const AUTHOR = 'Frederik Myllerup Asler'
const BOOKMAKER_GUIDES = new Set(['bedste-bookmakere-til-surebets', 'undgaa-begraensning', 'matched-betting'])
const chipCls =
  'inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground'

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

function resolveGuide(slug: string, locale: Locale) {
  return getLocalizedGuide(slug, locale) ?? getLocalizedGuide(slug, 'da')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getServerLocale()
  const guide = resolveGuide((await params).slug, locale)
  if (!guide) return {}
  const path = `/guide/${guide.slug}`
  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: [guide.keyword],
    alternates: buildAlternates(path, locale, guideLocales(guide.slug)),
    robots: localeRobots(locale),
    openGraph: {
      type: 'article',
      url: absoluteUrl(locale, path),
      locale: OG_LOCALE[locale],
      title: guide.metaTitle,
      description: guide.description,
      modifiedTime: guide.updated,
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getServerLocale()
  const guide = resolveGuide((await params).slug, locale)
  if (!guide) notFound()

  const text = SEO_STRINGS[locale]
  const dateFormat = new Intl.DateTimeFormat(LOCALES[locale].tag, { dateStyle: 'long' })
  const url = absoluteUrl(locale, `/guide/${guide.slug}`)
  const others = getLocalizedGuides(locale).filter((item) => item.slug !== guide.slug)
  const related = [
    ...others.filter((item) => item.category === guide.category),
    ...others.filter((item) => item.category !== guide.category),
  ].slice(0, 3)
  const sportPages = getLocalizedLandingList('sport', locale)
  const bookmakerPages = getLocalizedLandingList('bookmaker', locale)
  const showBookmakers = BOOKMAKER_GUIDES.has(guide.slug)
  const showVideo = guide.slug === 'hvad-er-surebets'
  const jsonLd = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      inLanguage: LOCALES[locale].tag,
      dateModified: guide.updated,
      datePublished: guide.updated,
      mainEntityOfPage: url,
      image: `${url}/opengraph-image`,
      author: { '@type': 'Person', name: AUTHOR, url: `${SITE_URL}/om-os` },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    ...(showVideo ? [videoObjectJsonLd()] : []),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: text.home, item: absoluteUrl(locale, '/') },
        { '@type': 'ListItem', position: 2, name: text.guides, item: absoluteUrl(locale, '/guide') },
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

      <nav aria-label={text.breadcrumb} className="text-[14px] text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href={localePath(locale, '/')} className="inline-flex min-h-11 items-center hover:text-foreground">{text.home}</Link>
          </li>
          <ChevronRight className="size-4" aria-hidden="true" />
          <li>
            <Link href={localePath(locale, '/guide')} className="inline-flex min-h-11 items-center hover:text-foreground">{text.guides}</Link>
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
              {text.minRead(guide.readMinutes)}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={guide.updated}>{text.updated} {dateFormat.format(new Date(guide.updated))}</time>
            <span aria-hidden="true">·</span>
            <span>
              {text.by}{' '}
              <Link href={localePath(locale, '/om-os')} rel="author" className="font-semibold text-foreground/90 underline-offset-4 hover:underline">
                {AUTHOR}
              </Link>
            </span>
          </p>
          <p className="mt-5 text-pretty text-[18px] leading-relaxed text-foreground">{guide.intro}</p>
        </header>

        {showVideo && (
          <figure className="mt-8">
            <YoutubeFacade />
            <figcaption className="mt-2 text-[14px] text-muted-foreground">{text.watchVideo}</figcaption>
          </figure>
        )}

        {guide.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}

        <FaqList items={guide.faq} heading={text.faq} />
      </article>

      <Link
        href={localePath(locale, guide.cta.href)}
        className="mt-10 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {guide.cta.label}
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>

      <section aria-labelledby="related-heading" className="mt-12">
        <h2 id="related-heading" className="text-[18px] font-bold text-foreground">{text.readAlso}</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={localePath(locale, `/guide/${item.slug}`)}
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
        <h2 id="sports-heading" className="text-[18px] font-bold text-foreground">{text.findOnSport}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          <li>
            <Link href={localePath(locale, '/dagens-surebets')} className={chipCls}>{text.todays}</Link>
          </li>
          {sportPages.map((page) => (
            <li key={page.slug}>
              <Link href={localePath(locale, `/sport/${page.slug}`)} className={chipCls}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      {showBookmakers && (
        <section aria-labelledby="bookmakers-heading" className="mt-10">
          <h2 id="bookmakers-heading" className="text-[18px] font-bold text-foreground">{text.surebetsAtBookmakers}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {bookmakerPages.map((page) => (
              <li key={page.slug}>
                <Link href={localePath(locale, `/bookmaker/${page.slug}`)} className={chipCls}>{page.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
