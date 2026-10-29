'use client'

import { useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { ChevronDown, ListFilter, ArrowDownWideNarrow } from 'lucide-react'
import { refreshOpportunityList, toggleFavorite } from '@/app/actions'
import { MenuOption, Popover } from '@/components/menu'
import { SmallBarsIcon } from '@/components/icons'
import { OpportunityCard } from '@/components/sikkerbets/opportunity-card'
import { DesktopHero } from '@/components/desktop/desktop-hero'
import type { Opportunity } from '@/lib/data'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { useLocale } from '@/components/locale-provider'

const AUTO_REFRESH_MS = 30_000
const MAIN_SPORTS = ['Fodbold', 'Basketball', 'Tennis'] as const
const MORE_SPORTS = ['Ishockey', 'Håndbold'] as const
const SPORT_KEYS: Record<string, keyof typeof import('@/lib/i18n').translations.da> = { Fodbold: 'football', Basketball: 'basketball', Tennis: 'tennis', Ishockey: 'hockey', Håndbold: 'handball', Favoritter: 'favorites' }
const MARGINS = [0, 1, 2, 3, 4, 5]
const SORTS = [
  { id: 'newest', key: 'newest' },
  { id: 'margin', key: 'highest' },
  { id: 'kickoff', key: 'kickoff' },
] as const
type SortId = (typeof SORTS)[number]['id']

function SportGlyph({ sport }: { sport: string }) {
  if (sport === 'Fodbold')
    return (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#fff" />
        <path d="M12 7.5l3.3 2.4-1.3 3.9h-4l-1.3-3.9z" fill="#0a1426" />
        <path d="M12 2v5.5M15.3 9.9l5.2-1.6M14 13.8l3 4.6M10 13.8l-3 4.6M8.7 9.9L3.5 8.3" stroke="#0a1426" strokeWidth="1.5" />
      </svg>
    )
  if (sport === 'Basketball')
    return (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="10" fill="#fff" />
        <path d="M2 12h20M12 2v20M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14" stroke="#0a1426" strokeWidth="1.6" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <path d="M4 6c5 2 5 10 0 12M20 6c-5 2-5 10 0 12" stroke="#0a1426" strokeWidth="1.6" />
    </svg>
  )
}

const chip =
  'flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3.5 text-[15px] font-medium transition-colors whitespace-nowrap'
const chipIdle = 'border-border bg-[#081123] text-foreground hover:bg-accent'
const chipActive = 'border-primary bg-primary text-primary-foreground'
const filterBtn =
  'flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-[#081123] px-3 text-[14px] text-foreground hover:bg-accent'

export function OpportunityList({ initial }: { initial: Opportunity[] }) {
  const [items, setItems] = useState(initial)
  const [sport, setSport] = useState<string>('Alle')
  const [league, setLeague] = useState<string>('Alle')
  const [minMargin, setMinMargin] = useState(0)
  const [sort, setSort] = useState<SortId>('margin')
  const [, startTransition] = useTransition()

  useSWR('opportunity-auto-refresh', () => refreshOpportunityList(), {
    refreshInterval: AUTO_REFRESH_MS,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess: (next) => setItems(next),
  })
  const { data: session } = authClient.useSession()
  const loggedIn = Boolean(session?.user)
  const { t } = useLocale()

  const [market, setMarket] = useState<string>('Alle')
  const params = useSearchParams()
  const urlKey = params.toString()
  const country = params.get('country')?.toLowerCase() ?? null
  const query = params.get('q')?.trim().toLowerCase() ?? ''

  const [prevInitial, setPrevInitial] = useState(initial)
  if (initial !== prevInitial) {
    setPrevInitial(initial)
    setItems(initial)
  }

  const [prevUrlKey, setPrevUrlKey] = useState(urlKey)
  if (urlKey !== prevUrlKey) {
    setPrevUrlKey(urlKey)
    setSport(params.get('sport') ?? 'Alle')
    setLeague('Alle')
  }

  const bySport = useMemo(
    () =>
      items.filter(
        (o) =>
          (sport === 'Alle' ? true : sport === 'Favoritter' ? o.favorite : o.sport === sport) &&
          (!country || o.countryCode.toLowerCase() === country) &&
          (!query || `${o.homeTeam} ${o.awayTeam} ${o.league} ${o.country}`.toLowerCase().includes(query)),
      ),
    [items, sport, country, query],
  )
  const leagues = useMemo(() => Array.from(new Set(bySport.map((o) => o.league))).sort(), [bySport])
  const markets = useMemo(() => Array.from(new Set(bySport.map((o) => o.market))).sort(), [bySport])

  const visible = useMemo(() => {
    const list = bySport.filter(
      (o) =>
        (league === 'Alle' || o.league === league) &&
        (market === 'Alle' || o.market === market) &&
        o.margin >= minMargin,
    )
    const sorted = [...list]
    if (sort === 'margin') sorted.sort((a, b) => b.margin - a.margin)
    else if (sort === 'kickoff') sorted.sort((a, b) => a.kickoffTs - b.kickoffTs)
    else sorted.sort((a, b) => b.createdTs - a.createdTs || b.margin - a.margin)
    return sorted
  }, [bySport, league, market, minMargin, sort])

  function selectSport(next: string) {
    setSport(next)
    setLeague('Alle')
    setMarket('Alle')
  }

  function handleFavorite(id: number) {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, favorite: !o.favorite } : o)))
    startTransition(async () => {
      try {
        await toggleFavorite(id)
      } catch {
        setItems((prev) => prev.map((o) => (o.id === id ? { ...o, favorite: !o.favorite } : o)))
      }
    })
  }

  const moreActive = sport === 'Favoritter' || (MORE_SPORTS as readonly string[]).includes(sport)

  return (
    <section aria-label="SikkerBets" className="w-full min-w-0 overflow-x-hidden px-4 lg:flex-1 lg:px-0">
      <DesktopHero />
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0" role="toolbar" aria-label="Sportsgren">
        <button type="button" onClick={() => selectSport('Alle')} aria-pressed={sport === 'Alle'} className={cn(chip, 'px-6', sport === 'Alle' ? chipActive : chipIdle)}>
          {t('all')}
        </button>
        {MAIN_SPORTS.map((s) => (
          <button key={s} type="button" onClick={() => selectSport(s)} aria-pressed={sport === s} className={cn(chip, sport === s ? chipActive : chipIdle)}>
            <SportGlyph sport={s} />
            {t(SPORT_KEYS[s] ?? 'more')}
          </button>
        ))}
        {[...MORE_SPORTS, 'Favoritter'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => selectSport(s)}
            aria-pressed={sport === s}
            className={cn(chip, 'hidden lg:flex', sport === s ? chipActive : chipIdle)}
          >
            {t(SPORT_KEYS[s] ?? 'more')}
          </button>
        ))}
        <div className="lg:hidden">
        <Popover
          align="right"
          label={t('more')}
          triggerClassName={cn(chip, 'px-4', moreActive ? chipActive : chipIdle)}
          trigger={
            <>
              {moreActive ? t(SPORT_KEYS[sport] ?? 'more') : t('more')}
              <ChevronDown className="size-5" />
            </>
          }
        >
          {(close) =>
            [...MORE_SPORTS, 'Favoritter'].map((s) => (
              <MenuOption key={s} selected={sport === s} onSelect={() => (selectSport(s), close())}>
                {s}
              </MenuOption>
            ))
          }
        </Popover>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_1.35fr_1.3fr] gap-2 lg:grid-cols-4 lg:gap-3">
        <Popover
          label="Vælg liga"
          triggerClassName={filterBtn}
          trigger={
            <>
              <ListFilter className="size-5 shrink-0" />
              <span className="truncate">{league === 'Alle' ? t('leaguesFilter') : league}</span>
              <ChevronDown className="size-4 shrink-0" />
            </>
          }
        >
          {(close) => (
            <div className="max-h-72 overflow-y-auto">
              <MenuOption selected={league === 'Alle'} onSelect={() => (setLeague('Alle'), close())}>
                {t('allLeagues')}
              </MenuOption>
              {leagues.map((l) => (
                <MenuOption key={l} selected={league === l} onSelect={() => (setLeague(l), close())}>
                  {l}
                </MenuOption>
              ))}
            </div>
          )}
        </Popover>
        <Popover
          label="Minimum margin"
          triggerClassName={filterBtn}
          trigger={
            <>
              <SmallBarsIcon className="size-5 shrink-0" />
              <span className="truncate">
                {t('minMargin')}: <span className="text-primary">{minMargin}%</span>
              </span>
              <ChevronDown className="size-4 shrink-0" />
            </>
          }
        >
          {(close) =>
            MARGINS.map((m) => (
              <MenuOption key={m} selected={minMargin === m} onSelect={() => (setMinMargin(m), close())}>
                {m === 0 ? t('allMargins') : `${t('atLeast')} ${m}%`}
              </MenuOption>
            ))
          }
        </Popover>
        <div className="hidden lg:block">
          <Popover
            label={t('market')}
            triggerClassName={filterBtn}
            trigger={
              <>
                <ArrowDownWideNarrow className="size-5 shrink-0" />
                <span className="truncate">{market === 'Alle' ? t('markets') : market}</span>
                <ChevronDown className="size-4 shrink-0" />
              </>
            }
          >
            {(close) => (
              <div className="max-h-72 overflow-y-auto">
                <MenuOption selected={market === 'Alle'} onSelect={() => (setMarket('Alle'), close())}>
                  {t('markets')}
                </MenuOption>
                {markets.map((m) => (
                  <MenuOption key={m} selected={market === m} onSelect={() => (setMarket(m), close())}>
                    {m}
                  </MenuOption>
                ))}
              </div>
            )}
          </Popover>
        </div>
        <Popover
          align="right"
          label={t('sorting')}
          triggerClassName={filterBtn}
          trigger={
            <>
              <ArrowDownWideNarrow className="size-5 shrink-0" />
              <span className="truncate">{t(SORTS.find((s) => s.id === sort)?.key ?? 'newest')}</span>
              <ChevronDown className="size-4 shrink-0" />
            </>
          }
        >
          {(close) =>
            SORTS.map((s) => (
              <MenuOption key={s.id} selected={sort === s.id} onSelect={() => (setSort(s.id), close())}>
                {t(s.key)}
              </MenuOption>
            ))
          }
        </Popover>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} SikkerBets fundet
      </p>

      <div
        className={cn(
          'mt-3 flex flex-col gap-3',
          visible.length > 0 &&
            'lg:gap-0 lg:divide-y lg:divide-[#13294a] lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[#183252] lg:bg-[linear-gradient(135deg,#071426_0%,#06101e_60%,#071a2a_100%)]',
        )}
      >
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-semibold">{t('noMatches')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('tryAgain')}</p>
            <button
              type="button"
              onClick={() => {
                selectSport('Alle')
                setMinMargin(0)
              }}
              className="mt-4 min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              {t('reset')}
            </button>
          </div>
        ) : (
          visible.map((o) => <OpportunityCard key={o.id} opportunity={o} onToggleFavorite={handleFavorite} loggedIn={loggedIn} />)
        )}
      </div>
    </section>
  )
}
