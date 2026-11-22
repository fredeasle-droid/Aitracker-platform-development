import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Suspense } from 'react'
import { LocaleProvider } from '@/components/locale-provider'
import { DesktopSidebar } from '@/components/desktop/desktop-sidebar'
import { ChromeGate } from '@/components/site/chrome-gate'
import { GlobalFooter } from '@/components/site/global-footer'
import { GlobalHeader } from '@/components/site/global-header'
import { PageShell } from '@/components/site/page-shell'
import { getServerLocale, getServerT } from '@/lib/locale-server'
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
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    applicationName: 'BetTracker',
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: 'BetTracker', statusBarStyle: 'black-translucent' },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
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
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <LocaleProvider initialLocale={locale}>
        <ChromeGate>
          <GlobalHeader />
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
