import { SITE_NAME, SITE_URL } from '@/lib/site'

export const EXPLAINER_VIDEO = {
  id: 'Msb_4-CAp_c',
  title: 'Surebets forklaret',
  description:
    'Hvad er surebets, og hvordan kan du bruge dem? Se hvordan arbitrage betting virker, hvordan du finder sikre odds hos flere bookmakere, og hvordan du regner din indsats ud.',
  uploadDate: '2026-11-23',
  duration: 'PT2M29S',
  watchUrl: 'https://www.youtube.com/watch?v=Msb_4-CAp_c',
  embedUrl: 'https://www.youtube-nocookie.com/embed/Msb_4-CAp_c',
  thumbnailUrl: 'https://i.ytimg.com/vi/Msb_4-CAp_c/hqdefault.jpg',
} as const

export function videoObjectJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: EXPLAINER_VIDEO.title,
    description: EXPLAINER_VIDEO.description,
    thumbnailUrl: [EXPLAINER_VIDEO.thumbnailUrl],
    uploadDate: EXPLAINER_VIDEO.uploadDate,
    duration: EXPLAINER_VIDEO.duration,
    contentUrl: EXPLAINER_VIDEO.watchUrl,
    embedUrl: EXPLAINER_VIDEO.embedUrl,
    inLanguage: 'da-DK',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}
