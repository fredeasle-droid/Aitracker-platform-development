import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BetTracker',
    short_name: 'BetTracker',
    description: 'SikkerBets · Enklere · Større overblik',
    start_url: '/',
    display: 'standalone',
    background_color: '#050b17',
    theme_color: '#050b17',
    lang: 'da',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
