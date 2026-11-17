'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, BarChart3, Gift, House, LogIn, Settings, UserRound, Zap, type LucideIcon } from 'lucide-react'
import { Logo } from '@/components/home/icons'
import { LanguageSwitcher } from '@/components/header-controls'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Dashboard', icon: House },
  { href: '/surebets', label: 'Surebets', icon: Zap },
  { href: '/stats', label: 'Analytics', icon: BarChart3 },
  { href: '/bonus', label: 'Bonus', icon: Gift },
  { href: '/konto', label: 'Indstillinger', icon: Settings },
]

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

function AuthButtons() {
  const { data: session, isPending } = authClient.useSession()

  if (session?.user) {
    return (
      <Link href="/konto" className="btn-glow flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold">
        <UserRound className="size-4" aria-hidden="true" /> Min konto
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', isPending && 'opacity-0')}>
      <Link href="/login" className="btn-outline-glow flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold">
        <LogIn className="size-4" aria-hidden="true" /> Log ind
      </Link>
      <Link href="/konto" className="btn-glow flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold">
        <span className="hidden sm:inline">Opret gratis konto</span>
        <span className="sm:hidden">Opret konto</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

export function GlobalHeader() {
  const pathname = usePathname()

  return (
    <header className="bt-theme sticky top-0 z-40 border-b border-border bg-background-deep/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-6">
        <Link href="/" aria-label="BetTrackerAI forside" className="shrink-0 text-foreground">
          <Logo />
        </Link>

        <nav aria-label="Hovedmenu" className="nav-capsule hidden h-9 items-center gap-0.5 rounded-full p-1 md:flex">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
              className={cn(
                'group flex h-7 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium',
                isActive(pathname, href) ? 'nav-active' : 'nav-link',
              )}
            >
              <Icon className="size-3.5 transition-transform duration-300 group-hover:-translate-y-px group-hover:scale-110" strokeWidth={1.9} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
