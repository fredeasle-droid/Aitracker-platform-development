'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRound } from 'lucide-react'
import { Logo } from '@/components/home/icons'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const NAV: { href: string; label: string }[] = [
  { href: '/', label: 'Forside' },
  { href: '/surebets', label: 'Surebets' },
  { href: '/stats', label: 'Analytics' },
  { href: '/#scanner', label: 'Scanner' },
  { href: '/konto', label: 'Indstillinger' },
]

function isActive(pathname: string, href: string) {
  if (href.includes('#')) return false
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

function AuthActions() {
  const { data: session, isPending } = authClient.useSession()

  if (session?.user) {
    return (
      <Link
        href="/konto"
        aria-label="Min konto"
        className="btn-glow flex h-9 items-center justify-center gap-2 rounded-full text-[13px] font-semibold max-sm:w-9 sm:px-4"
      >
        <UserRound className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Min konto</span>
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center gap-1 sm:gap-2', isPending && 'opacity-0')}>
      <Link
        href="/login"
        className="flex h-9 items-center whitespace-nowrap rounded-full px-3 text-[13px] font-semibold text-foreground/80 transition-colors hover:text-foreground sm:px-4"
      >
        Log ind
      </Link>
      <Link
        href="/konto"
        className="btn-glow flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[13px] font-semibold"
      >
        <span className="hidden lg:inline">Opret gratis konto</span>
        <span className="lg:hidden">Opret konto</span>
      </Link>
    </div>
  )
}

export function GlobalHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header
      className={cn(
        'bt-theme top-0 z-40 pt-[env(safe-area-inset-top)]',
        isHome
          ? 'relative bg-transparent md:sticky md:border-b md:border-border md:bg-background-deep/85 md:backdrop-blur-xl'
          : 'sticky border-b border-border bg-background-deep/85 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-8">
        <Link href="/" aria-label="BetTrackerAI forside" className="shrink-0 justify-self-start text-foreground">
          <Logo />
        </Link>

        <nav aria-label="Hovedmenu" className="hidden h-full items-stretch md:flex">
          {NAV.map(({ href, label }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center px-3 text-[13px] font-medium transition-colors lg:px-4 lg:text-sm',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-glow lg:inset-x-4" />}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-self-end">
          <AuthActions />
        </div>
      </div>
    </header>
  )
}
