import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { LocaleProvider } from '@/components/locale-provider'
import { DesktopSidebar } from '@/components/desktop/desktop-sidebar'
import { GlobalFooter } from '@/components/site/global-footer'
import { GlobalHeader } from '@/components/site/global-header'
import { PageShell } from '@/components/site/page-shell'
import { SupportChat } from '@/components/support/support-chat'
import { getServerLocale, getServerT } from '@/lib/locale-server'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
  themeColor: '#050b17',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()
  return (
    <html lang={locale} className={`${inter.variable} bg-background`}>
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <LocaleProvider initialLocale={locale}>
        <GlobalHeader />
        <PageShell
          sidebar={
            <Suspense fallback={null}>
              <DesktopSidebar />
            </Suspense>
          }
        >
          {children}
        </PageShell>
        <GlobalFooter />
        <SupportChat />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </LocaleProvider>
      </body>
    </html>
  )
}
