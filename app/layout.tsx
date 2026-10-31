import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { LocaleProvider } from '@/components/locale-provider'
import { DesktopHeader } from '@/components/desktop/desktop-header'
import { DesktopSidebar } from '@/components/desktop/desktop-sidebar'
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
        <DesktopHeader />
        <div className="lg:flex">
          <Suspense fallback={null}>
            <DesktopSidebar />
          </Suspense>
          <div className="mx-auto min-h-dvh w-full max-w-2xl pb-[calc(6rem+env(safe-area-inset-bottom))] lg:mx-0 lg:min-h-0 lg:min-w-0 lg:max-w-none lg:flex-1 lg:pb-6">
            {children}
          </div>
        </div>
        <BottomNav />
        <SupportChat />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </LocaleProvider>
      </body>
    </html>
  )
}
