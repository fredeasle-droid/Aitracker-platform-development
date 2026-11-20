'use client'

import Link from 'next/link'
import { useId } from 'react'
import { Bell, LogIn, Menu } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SidebarContent } from '@/components/sb/Sidebar'

function LogoMark({ className }: { className?: string }) {
  const gid = `bi-logo-${useId().replace(/:/g, '')}`
  const fill = `url(#${gid})`
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--bi-primary)" />
          <stop offset="1" stopColor="var(--bi-neon)" />
        </linearGradient>
      </defs>
      <rect x="2" y="26" width="7" height="12" rx="1.5" fill={fill} />
      <rect x="13" y="19" width="7" height="19" rx="1.5" fill={fill} />
      <rect x="24" y="22" width="7" height="16" rx="1.5" fill={fill} />
      <rect x="35" y="12" width="7" height="26" rx="1.5" fill={fill} />
      <path d="M3 20 L16 10 L27 15 L42 3" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M36 2 L44 2 L44 10" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function initialsOf(name: string | null | undefined, email: string | null | undefined) {
  const source = (name || email || '').trim()
  if (!source) return 'BT'
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'BT'
}

export function BeregnMobileHeader() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-40 border-b border-(--bi-primary)/25 bg-(--bi-bg)/80 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-[60px] max-w-[560px] items-center gap-[8px] px-[14px]">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-[10px]" aria-label="BetTrackerAI forside">
          <LogoMark className="h-[30px] w-[27px] shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-[19px] font-bold leading-none tracking-[-0.01em]">
              BetTracker<span className="text-(--bi-glow)">AI</span>
            </span>
            <span className="mt-[4px] block truncate text-[11px] leading-none tracking-[0.06em] text-(--bi-muted)">
              Track · Analyse · Vind
            </span>
          </span>
        </Link>

        {user ? (
          <>
            <button
              type="button"
              aria-label="Notifikationer"
              className="relative flex size-[40px] shrink-0 items-center justify-center rounded-full border border-(--bi-primary)/40 bg-(--bi-bg)/70"
            >
              <Bell className="size-[20px]" strokeWidth={1.8} aria-hidden="true" />
              <span className="absolute -right-[3px] -top-[4px] flex size-[17px] items-center justify-center rounded-full bg-(--bi-destructive) text-[10px] font-bold">
                3
              </span>
            </button>
            <Link
              href="/konto"
              aria-label="Min konto"
              className="bi-grad-primary bi-shadow-glow flex size-[40px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-(--bi-neon)"
            >
              {initialsOf(user.name, user.email)}
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className={`flex h-[40px] shrink-0 items-center gap-[6px] rounded-full border border-(--bi-primary)/40 bg-(--bi-bg)/70 px-[14px] text-[13px] font-semibold text-(--bi-glow) ${isPending ? 'opacity-0' : ''}`}
          >
            <LogIn className="size-[16px]" aria-hidden="true" />
            Log ind
          </Link>
        )}

        <Sheet>
          <SheetTrigger
            aria-label="Åbn menu"
            className="flex size-[40px] shrink-0 items-center justify-center rounded-full border border-(--bi-primary)/40 bg-(--bi-bg)/70"
          >
            <Menu className="size-[20px]" strokeWidth={2} aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[290px] overflow-y-auto border-sidebar-border bg-sidebar px-4 pb-4 pt-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarContent page="beregn" />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
