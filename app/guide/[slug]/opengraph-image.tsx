import { getGuide } from '@/lib/guides'
import { OG_SIZE, ogCard } from '@/lib/seo/og-card'

export const alt = 'Guide fra BetTrackerAI'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug)
  return ogCard(guide ? `Guide · ${guide.category}` : 'Guide', guide?.title ?? 'Guides til surebets')
}
