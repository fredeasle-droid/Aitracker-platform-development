'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogIn, Menu, UserRound } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
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
        className="btn-glow flex h-10 items-center justify-center gap-2 rounded-full text-[13px] font-semibold max-md:w-10 md:h-9 md:px-4"
      >
        <UserRound className="size-4" aria-hidden="true" />
        <span className="hidden md:inline">Min konto</span>
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className={cn(
        'flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary-glow/40 bg-background-deep/70 px-3.5 text-[13px] font-semibold text-primary-glow transition-colors hover:border-primary-glow hover:text-foreground md:h-9 md:px-4',
        isPending && 'opacity-0',
      )}
    >
      <LogIn className="size-4" aria-hidden="true" />
      Log ind
    </Link>
  )
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Åbn menu"
        className="flex size-10 items-center justify-center rounded-full border border-border bg-background-deep/70 text-foreground transition-colors hover:bg-card md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="bt-theme w-[270px] border-border bg-background-deep px-4 pb-6 pt-6">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="px-1">
          <Logo />
        </div>
        <nav aria-label="Hovedmenu" className="mt-6 flex flex-col gap-1">
          {NAV.map(({ href, label }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
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
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-self-start">
          <MobileMenu pathname={pathname} />
          <Link href="/" aria-label="BetTrackerAI forside" className="hidden text-foreground md:block">
            <Logo />
          </Link>
        </div>

        <Link href="/" aria-label="BetTrackerAI forside" className="text-foreground md:hidden">
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
