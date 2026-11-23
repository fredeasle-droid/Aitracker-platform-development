import type { MetadataRoute } from 'next'
import { GUIDES } from '@/lib/guides'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PUBLIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
  const guides = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guide/${guide.slug}`,
    lastModified: new Date(guide.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  return [...pages, ...guides]
}
