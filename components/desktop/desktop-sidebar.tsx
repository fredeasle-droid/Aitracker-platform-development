'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Check, ChartPie, ChevronDown, Crown, Gamepad2, Gift, House, Radio, Star } from 'lucide-react'
import { BarsIcon } from '@/components/icons'
import { Logo as SbLogo } from '@/components/sb/Logo'
import { SidebarCurve } from '@/components/sb/Sidebar'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import useSWR from 'swr'
import { parseBookmakers, toggleBookmaker } from '@/lib/bookmaker-filter'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/locale-provider'

const NAV = [
  { href: '/', key: 'frontPage', icon: House },
  { href: '/surebets', key: 'home', icon: BarsIcon },
  { href: '/surebets#live-scanning', key: 'live', icon: Radio },
  { href: '/stats', key: 'stats', icon: ChartPie },
  { href: '/bonus', key: 'bonus', icon: Gift },
  { href: '/konto', key: 'games', icon: Star },
] as const

const SPORTS = [
  { key: 'football', value: 'Fodbold' },
  { key: 'basketball', value: 'Basketball' },
  { key: 'tennis', value: 'Tennis' },
  { key: 'hockey', value: 'Ishockey' },
  { key: 'esports', value: 'Esport' },
] as const

function SportIcon({ sport, className = 'size-6' }: { sport: string; className?: string }) {
  if (sport === 'Esport') return <Gamepad2 className={className} aria-hidden="true" />
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      {sport === 'Fodbold' && <path d="M12 7.5l3.3 2.4-1.3 3.9h-4l-1.3-3.9zM12 2.5v5M15.3 9.9l5-1.5M14 13.8l2.8 4.4M10 13.8l-2.8 4.4M8.7 9.9l-5-1.5" />}
      {sport === 'Basketball' && <path d="M2.5 12h19M12 2.5v19M5.5 5.2c3 3 3 10.6 0 13.6M18.5 5.2c-3 3-3 10.6 0 13.6" />}
      {sport === 'Tennis' && <path d="M5 5.5c4.5 2.5 4.5 10.5 0 13M19 5.5c-4.5 2.5-4.5 10.5 0 13" />}
      {sport === 'Ishockey' && <path d="M3 14c3-3 15-3 18 0" />}
    </svg>
  )
}

const DESK_LABELS: Record<string, string> = {
  home: 'Surebets',
  live: 'Live-scanning',
  stats: 'Statistik',
  games: 'Mine bets',
}

const row =
  'flex min-h-10 items-center gap-4 rounded-xl px-4 text-[15px] text-[#e6ecf7] transition-colors hover:bg-[#0d1f38]'
const deskRow =
  'flex w-full items-center gap-3.5 rounded-xl px-4 py-2 text-[15.5px] font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent'

export function SidebarBody({
  onNavigate,
  showBookmakers = true,
  bookmakersDefaultOpen = true,
  variant = 'default',
}: {
  onNavigate?: () => void
  showBookmakers?: boolean
  bookmakersDefaultOpen?: boolean
  variant?: 'default' | 'desktop'
}) {
  const desk = variant === 'desktop'
  const pathname = usePathname()
  const params = useSearchParams()
  const activeSport = params.get('sport') ?? (pathname === '/beregn' ? 'Fodbold' : null)
  const activeBookmaker = params.get('bookmaker')
  const selectedBookmakers = parseBookmakers(activeBookmaker)
  const { data: bookmakerList = [] } = useSWR<{ id: string; name: string }[]>('/api/bookmakers', (url: string) =>
    fetch(url).then((r) => r.json()),
  )
  const bookmakerOptions = [
    ...bookmakerList,
    ...selectedBookmakers.filter((id) => !bookmakerList.some((b) => b.id === id)).map((id) => ({ id, name: id })),
  ]
  const [leaguesOpen, setLeaguesOpen] = useState(bookmakersDefaultOpen)
  const { data: session } = authClient.useSession()
  const { t, locale } = useLocale()

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      onClick={(e) => {
        if (onNavigate && (e.target as HTMLElement).closest('a')) onNavigate()
      }}
    >
      <nav aria-label="Hovedmenu">
        <ul className="flex flex-col gap-1">
          {NAV.map(({ href, key, icon: Icon }) => {
            const label = desk && locale === 'da' && DESK_LABELS[key] ? DESK_LABELS[key] : t(key)
            const active = href === '/surebets' ? pathname === '/surebets' && !activeSport && !activeBookmaker : pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    desk ? deskRow : cn(row, 'min-h-12'),
                    active &&
                      (desk
                        ? 'sb-nav-active py-2.5 font-bold text-primary-foreground hover:bg-transparent'
                        : 'sb-nav-active font-bold text-primary-foreground hover:bg-transparent'),
                  )}
                >
                  <Icon className={desk ? 'size-5' : 'size-6'} fill={Icon === BarsIcon || Icon === ChartPie ? 'currentColor' : 'none'} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={desk ? 'my-4 h-px bg-sidebar-border' : 'my-4 border-t border-[#13294a]'} />

      <h2
        className={cn(
          'font-semibold uppercase',
          desk ? 'px-2 pb-3 text-[11px] tracking-[0.12em] text-cyan' : 'px-4 pb-2 text-[13px] tracking-wide text-[#55a8ff]',
        )}
      >
        {t('sport')}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {SPORTS.map(({ key: sportKey, value }) => {
          const s = t(sportKey)
          return (
          <li key={sportKey}>
            <Link
              href={`/surebets?sport=${encodeURIComponent(value)}`}
              aria-current={activeSport === value ? 'true' : undefined}
              className={cn(
                desk ? cn(deskRow, 'gap-3 px-3 text-[14.5px]') : row,
                activeSport === value &&
                  (desk ? 'bg-sidebar-accent font-bold ring-1 ring-primary/30' : 'bg-[#0d1f38] text-[#65c1ff]'),
              )}
            >
              <SportIcon sport={value} className={desk ? 'size-5' : undefined} />
              {s}
            </Link>
          </li>
          )
        })}
      </ul>

      {showBookmakers && (
      <>
      <div className={desk ? 'my-4 h-px bg-sidebar-border' : 'my-4 border-t border-[#13294a]'} />

      <button
        type="button"
        onClick={() => setLeaguesOpen((v) => !v)}
        aria-expanded={leaguesOpen}
        aria-controls="sidebar-leagues"
        className={cn(
          'flex items-center justify-between font-semibold uppercase',
          desk
            ? 'min-h-8 px-2 text-[11px] tracking-[0.12em] text-cyan'
            : 'min-h-9 px-4 text-[13px] tracking-wide text-[#55a8ff]',
        )}
      >
        {t('bookmakers')}
        <ChevronDown className={cn('size-4 text-[#d5ddef] transition-transform', !leaguesOpen && '-rotate-90')} />
      </button>
      {leaguesOpen && (
        <ul id="sidebar-leagues" className="flex flex-col gap-0.5">
          {bookmakerOptions.map((b) => {
            const selected = selectedBookmakers.includes(b.id)
            const nextSelected = toggleBookmaker(selectedBookmakers, b.id)
            const next = new URLSearchParams()
            if (params.get('sport')) next.set('sport', params.get('sport') as string)
            if (nextSelected.length > 0) next.set('bookmaker', nextSelected.join(','))
            const qs = next.toString()
            return (
              <li key={b.id}>
                <Link
                  href={qs ? `/surebets?${qs}` : '/surebets'}
                  role="checkbox"
                  aria-checked={selected}
                  className={
                    desk
                      ? cn(
                          'flex min-h-8 items-center gap-3 px-2 text-[13px] transition-colors hover:text-foreground',
                          selected ? 'text-sidebar-foreground' : 'text-muted-foreground',
                        )
                      : cn(row, 'gap-3', selected && 'bg-[#0d1f38] text-[#65c1ff]')
                  }
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex shrink-0 items-center justify-center border',
                      desk
                        ? cn(
                            'size-4 rounded-full',
                            selected ? 'border-success bg-success text-success-foreground' : 'border-muted-foreground/50',
                          )
                        : cn(
                            'size-5 rounded-md',
                            selected ? 'border-primary bg-primary text-primary-foreground' : 'border-[#2a4468]',
                          ),
                    )}
                  >
                    {selected && <Check className={desk ? 'size-3' : 'size-3.5'} strokeWidth={3} />}
                  </span>
                  {!desk && <BookmakerLogo name={b.name} className="size-6 rounded-md" />}
                  {b.name}
                </Link>
              </li>
            )
          })}
          {selectedBookmakers.length > 0 && (
            <li>
              <Link
                href={params.get('sport') ? `/surebets?sport=${encodeURIComponent(params.get('sport') as string)}` : '/surebets'}
                className="flex min-h-10 items-center px-4 text-[14px] text-[#65c1ff] underline-offset-2 hover:underline"
              >
                {t('clearBookmakers')}
              </Link>
            </li>
          )}
        </ul>
      )}
      </>
      )}

      {session?.user && (
        <div
          className={cn(
            'mt-auto',
            desk ? 'sb-panel panel-glow p-4' : 'rounded-2xl border border-[#183252] bg-[linear-gradient(135deg,#0a1a33,#071226)] p-3',
          )}
        >
          <div className="flex gap-2.5">
            <Crown className="mt-0.5 size-7 shrink-0 fill-[#f5c84b] text-[#f5c84b]" aria-hidden="true" />
            <div>
              <p className="text-[15px] font-bold leading-tight">{t('premium')}</p>
              <p className="mt-1 text-[12px] leading-snug text-[#a9b6d3]">{t('premiumText')}</p>
            </div>
          </div>
          <Link
            href="/konto"
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-[linear-gradient(100deg,#1682ff,#1372ee)] text-[15px] font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)]"
          >
            {t('upgrade')}
          </Link>
        </div>
      )}

      {!session?.user && (
        <div
          className={cn(
            'mt-auto',
            desk ? 'sb-panel panel-glow p-4' : 'rounded-2xl border border-[#183252] bg-[linear-gradient(135deg,#0a1a33,#071226)] p-3',
          )}
        >
          <div className="flex gap-2.5">
            <Crown className="mt-0.5 size-7 shrink-0 fill-[#f5c84b] text-[#f5c84b]" aria-hidden="true" />
            <div>
              <p className="text-[15px] font-bold leading-tight">{t('createAccount')}</p>
              <p className="mt-1 text-[12px] leading-snug text-[#a9b6d3]">{t('accountText')}</p>
            </div>
          </div>
          <Link
            href="/konto"
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#1682ff,#1372ee)] text-[15px] font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)]"
          >
            {t('create')} <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export function DesktopSidebar() {
  return (
    <aside
      aria-label="Sidemenu"
      className="sb-root sticky top-0 z-10 hidden h-dvh w-[230px] shrink-0 !min-h-0 !bg-transparent lg:block"
    >
      <div className="flex h-full flex-col overflow-y-auto bg-sidebar/95 px-4 pb-4 pt-6 backdrop-blur-xl [scrollbar-width:thin]">
        <div className="mb-6 px-1">
          <Link href="/" aria-label="BetTrackerAI forside">
            <SbLogo />
          </Link>
        </div>
        <SidebarBody variant="desktop" />
      </div>
      <SidebarCurve />
    </aside>
  )
}
