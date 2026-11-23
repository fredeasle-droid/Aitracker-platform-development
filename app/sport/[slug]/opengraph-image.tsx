import { getSportPage } from '@/lib/landing-pages'
import { OG_SIZE, ogCard } from '@/lib/seo/og-card'

export const alt = 'Surebets pr. sportsgren hos BetTrackerAI'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const page = getSportPage((await params).slug)
  return ogCard('Sportsgren', page?.title ?? 'Surebets i realtid')
}
