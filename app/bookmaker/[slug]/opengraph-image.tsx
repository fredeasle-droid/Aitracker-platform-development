import { getBookmakerPage } from '@/lib/landing-pages'
import { OG_SIZE, ogCard } from '@/lib/seo/og-card'

export const alt = 'Surebets pr. bookmaker hos BetTrackerAI'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const page = getBookmakerPage((await params).slug)
  return ogCard('Bookmaker', page?.title ?? 'Surebets i realtid')
}
