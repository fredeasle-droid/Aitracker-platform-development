import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { getLocalizedGuides } from '@/lib/content-i18n'
import { LOCALES, OG_LOCALE, localePath } from '@/lib/i18n'
import { getServerLocale } from '@/lib/locale-server'
import { absoluteUrl, buildAlternates } from '@/lib/seo/alternates'
import { SEO_STRINGS } from '@/lib/seo/ui-strings'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const text = SEO_STRINGS[locale]
  const url = absoluteUrl(locale, '/guide')
  return {
    title: text.guideIndexTitle,
    description: text.guideIndexDescription,
    alternates: buildAlternates('/guide', locale),
    openGraph: { url, type: 'website', locale: OG_LOCALE[locale], title: text.guideIndexTitle, description: text.guideIndexDescription },
  }
}

export default async function GuideIndexPage() {
  const locale = await getServerLocale()
  const text = SEO_STRINGS[locale]
  const guides = getLocalizedGuides(locale)
  const [featured, ...rest] = guides

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: text.guideIndexName,
    inLanguage: LOCALES[locale].tag,
    url: absoluteUrl(locale, '/guide'),
    hasPart: guides.map((guide) => ({
      '@type': 'Article',
      headline: guide.title,
      url: absoluteUrl(locale, `/guide/${guide.slug}`),
    })),
  })

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 lg:max-w-6xl lg:px-10 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <header className="max-w-2xl">
        <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-primary-glow">
          <BookOpen className="size-4" aria-hidden="true" />
          {text.guides}
        </p>
        <h1 className="mt-2 text-balance text-[32px] font-extrabold leading-[1.08] tracking-tight text-foreground lg:text-[48px]">
          {text.guideIndexH1}
        </h1>
        <p className="mt-3 text-pretty text-[16px] leading-relaxed text-foreground/80 lg:text-[17px]">{text.guideIndexLead}</p>
      </header>

      <Link
        href={localePath(locale, `/guide/${featured.slug}`)}
        className="group mt-8 flex flex-col gap-3 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/20 via-card/80 to-card/60 p-5 transition-colors hover:border-primary lg:p-8"
      >
        <span className="text-[13px] font-semibold text-primary-glow">{featured.category}</span>
        <h2 className="text-balance text-[24px] font-bold leading-tight text-foreground lg:text-[32px]">{featured.title}</h2>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-foreground/80">{featured.description}</p>
        <span className="mt-1 inline-flex items-center gap-2 text-[15px] font-semibold text-primary-glow">
          {text.readGuide}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>

      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={localePath(locale, `/guide/${guide.slug}`)}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card/70 p-5 transition-colors hover:border-primary/60"
            >
              <span className="text-[13px] font-semibold text-primary-glow">{guide.category}</span>
              <h2 className="text-pretty text-[18px] font-bold leading-snug text-foreground">{guide.title}</h2>
              <p className="line-clamp-3 text-pretty text-[14px] leading-relaxed text-foreground/75">{guide.description}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-2 text-[13px] text-muted-foreground">
                <Clock className="size-3.5" aria-hidden="true" />
                {text.minRead(guide.readMinutes)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
