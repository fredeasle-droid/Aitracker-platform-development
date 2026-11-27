export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bettrackerai.com').replace(/\/$/, '')
export const SITE_NAME = 'BetTrackerAI'

export const PUBLIC_PAGES: { path: string; priority: number; changeFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/surebets', priority: 0.9, changeFrequency: 'hourly' },
  { path: '/dagens-surebets', priority: 0.8, changeFrequency: 'hourly' },
  { path: '/om-os', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/bonus', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/guide', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/kontakt', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/vilkaar', priority: 0.2, changeFrequency: 'monthly' },
  { path: '/privatlivspolitik', priority: 0.2, changeFrequency: 'monthly' },
]

export const PRIVATE_PATHS = [
  '/api/',
  '/admin',
  '/konto',
  '/login',
  '/log-ud',
  '/logud',
  '/lukket',
  '/kilder',
  '/telegram',
  '/stats',
  '/s/',
  '/bethero-bro',
  '/oddsjam-bro',
  '/oddspapi',
]
