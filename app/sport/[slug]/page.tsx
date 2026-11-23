import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LandingArticle } from '@/components/seo/landing-article'
import { SPORT_PAGES, getSportPage } from '@/lib/landing-pages'

export const dynamicParams = false

export function generateStaticParams() {
  return SPORT_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getSportPage((await params).slug)
  if (!page) return {}
  const path = `/sport/${page.slug}`
  return {
    title: page.metaTitle,
    description: page.description,
    keywords: [page.keyword],
    alternates: { canonical: path },
    openGraph: { type: 'website', url: path, title: page.metaTitle, description: page.description },
  }
}

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = getSportPage((await params).slug)
  if (!page) notFound()
  return <LandingArticle page={page} section={{ label: 'Sportsgrene', path: '/sport' }} siblings={SPORT_PAGES} />
}
