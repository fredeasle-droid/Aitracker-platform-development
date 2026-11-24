import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Suspense } from 'react'
import { LocaleProvider } from '@/components/locale-provider'
import { DesktopSidebar } from '@/components/desktop/desktop-sidebar'
import { ChromeGate } from '@/components/site/chrome-gate'
import { GlobalFooter } from '@/components/site/global-footer'
import { RootHeader } from '@/components/site/global-header'
import { PageShell } from '@/components/site/page-shell'
import { OG_LOCALE } from '@/lib/i18n'
import { getServerLocale, getServerT } from '@/lib/locale-server'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT()
  const locale = await getServerLocale()
  return {
    metadataBase: new URL(SITE_URL),
    title: t('metaTitle'),
    description: t('metaDesc'),
    applicationName: 'BetTracker',
    openGraph: { type: 'website', siteName: SITE_NAME, locale: OG_LOCALE[locale], title: t('metaTitle'), description: t('metaDesc') },
    twitter: { card: 'summary_large_image', title: t('metaTitle'), description: t('metaDesc') },
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: 'BetTracker', statusBarStyle: 'black-translucent' },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icons/favicon-64.png', sizes: '64x64', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: '#030a26',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()
  return (
    <html lang={locale} className={`${roboto.variable} bg-background`}>
      <head>
        <script
          {...({ nowprocket: '', 'nitro-exclude': '' } as Record<string, string>)}
          type="text/javascript"
          id="sa-dynamic-optimization"
          data-uuid="68cbf5cd-4087-462b-a364-dc243d4078bb"
          src="https://dashboard.searchatlas.com/scripts/dynamic_optimization.js"
        />
      </head>
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <LocaleProvider initialLocale={locale}>
        <ChromeGate>
          <RootHeader />
        </ChromeGate>
        <PageShell
          sidebar={
            <Suspense fallback={null}>
              <DesktopSidebar />
            </Suspense>
          }
        >
          {children}
        </PageShell>
        <ChromeGate>
          <GlobalFooter />
        </ChromeGate>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </LocaleProvider>
      </body>
    </html>
  )
}
