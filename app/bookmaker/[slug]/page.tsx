import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LandingArticle } from '@/components/seo/landing-article'
import { BOOKMAKER_PAGES, getBookmakerPage } from '@/lib/landing-pages'

export const dynamicParams = false

export function generateStaticParams() {
  return BOOKMAKER_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getBookmakerPage((await params).slug)
  if (!page) return {}
  const path = `/bookmaker/${page.slug}`
  return {
    title: page.metaTitle,
    description: page.description,
    keywords: [page.keyword],
    alternates: { canonical: path },
    openGraph: { type: 'website', url: path, title: page.metaTitle, description: page.description },
  }
}

export default async function BookmakerPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = getBookmakerPage((await params).slug)
  if (!page) notFound()
  return <LandingArticle page={page} section={{ label: 'Bookmakere', path: '/bookmaker' }} siblings={BOOKMAKER_PAGES} />
}
