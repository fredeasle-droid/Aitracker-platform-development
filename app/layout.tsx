import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { BottomNav } from '@/components/bottom-nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'BetTracker – SikkerBets, enklere og større overblik',
  description:
    'Find sikre væddemål (arbitrage) på tværs af danske bookmakere, beregn dine indsatser og følg din profit.',
  applicationName: 'BetTracker',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'BetTracker', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: '#050b17',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da" className={`${inter.variable} bg-background`}>
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-2xl pb-[calc(6rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomNav />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
