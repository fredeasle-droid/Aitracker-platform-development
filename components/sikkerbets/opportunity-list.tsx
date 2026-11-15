'use client'

import { useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { ChevronDown, ListFilter, ArrowDownWideNarrow, Search, X } from 'lucide-react'
import { refreshOpportunityList, toggleFavorite } from '@/app/actions'
import { MenuOption, Popover } from '@/components/menu'
import { SmallBarsIcon } from '@/components/icons'
import { OpportunityCard } from '@/components/sikkerbets/opportunity-card'
import { DesktopHero } from '@/components/desktop/desktop-hero'
import type { Opportunity } from '@/lib/data'
import { useBookmakerList } from '@/lib/use-bookmakers'
import { FILTER_BOOKMAKERS, bookmakerId, matchesBookmakers, parseBookmakers, toggleBookmaker } from '@/lib/bookmaker-filter'
import { cn } from '@/lib/utils'
import { useHasAccess } from '@/components/locked-odds'
import { useLocale } from '@/components/locale-provider'
import { BOOKMAKER_COUNTRIES } from '@/lib/countries'

const AUTO_REFRESH_MS = 30_000
const MAIN_SPORTS = ['Fodbold', 'Basketball', 'Tennis'] as const
const MORE_SPORTS = ['Ishockey', 'Håndbold'] as const
const SPORT_KEYS: Record<string, keyof typeof import('@/lib/i18n').translations.da> = { Fodbold: 'football', Basketball: 'basketball', Tennis: 'tennis', Ishockey: 'hockey', Håndbold: 'handball', Favoritter: 'favorites' }
const MARGINS = [0, 1, 2, 3, 4, 5]
const SORTS = [
  { id: 'newest', key: 'newest' },
  { id: 'margin', key: 'highest' },
  { id: 'kickoff', key: 'kickoff' },
  { id: 'bookmaker', key: 'sortBookmaker' },
] as const
type SortId = (typeof SORTS)[number]['id']

function SportGlyph({ sport }: { sport: string }) {
  if (sport === 'Fodbold')
    return (
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 lg:size-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#fff" />
        <path d="M12 7.5l3.3 2.4-1.3 3.9h-4l-1.3-3.9z" fill="#0a1426" />
        <path d="M12 2v5.5M15.3 9.9l5.2-1.6M14 13.8l3 4.6M10 13.8l-3 4.6M8.7 9.9L3.5 8.3" stroke="#0a1426" strokeWidth="1.5" />
      </svg>
    )
  if (sport === 'Basketball')
    return (
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 lg:size-5" aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="10" fill="#fff" />
        <path d="M2 12h20M12 2v20M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14" stroke="#0a1426" strokeWidth="1.6" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 lg:size-5" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <path d="M4 6c5 2 5 10 0 12M20 6c-5 2-5 10 0 12" stroke="#0a1426" strokeWidth="1.6" />
    </svg>
  )
}

const chip =
  'flex h-[30px] shrink-0 items-center rounded-[10px] border text-[9.3px] font-medium transition-colors whitespace-nowrap lg:h-auto lg:min-h-11 lg:w-auto lg:justify-center lg:gap-2 lg:rounded-xl lg:px-3.5 lg:text-[15px]'
const chipMobile = 'gap-[7px] pl-[9px] pr-3 lg:gap-2 lg:pl-3.5 lg:pr-3.5'
const chipIdle = 'border-[#1a2f4d] bg-[#081123] text-foreground hover:bg-accent'
const chipActive = 'border-primary bg-primary text-primary-foreground'
const filterBtn =
  'flex h-[30px] w-full min-w-0 items-center justify-between gap-2 rounded-[10px] border border-[#1a2f4d] bg-[#081123] px-2.5 text-[9.5px] text-foreground hover:bg-accent lg:h-auto lg:min-h-11 lg:rounded-xl lg:border-border lg:px-3 lg:text-[14px]'

export function OpportunityList({ initial }: { initial: Opportunity[] }) {
  const [items, setItems] = useState(initial)
  const [sport, setSport] = useState<string>('Alle')
  const params = useSearchParams()
  const [bookmakers, setBookmakers] = useState<string[]>(() => parseBookmakers(params.get('bookmaker')))
  const [bookmakerSearch, setBookmakerSearch] = useState('')
  const [bookmakerGeo, setBookmakerGeo] = useState<'Local' | 'Offshore' | 'Global' | 'Exchanges' | 'Live Betting'>('Local')
  const [bookmakerCountry, setBookmakerCountry] = useState('dk')
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
  const loggedIn = useHasAccess()
  const { t, tx } = useLocale()

  const [market, setMarket] = useState<string>('Alle')
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
    setBookmakers(parseBookmakers(params.get('bookmaker')))
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
  const allBookmakers = useBookmakerList(bookmakerCountry)
  const bookmakerOptions = useMemo(() => {
    const byId = new Map<string, string>(allBookmakers.map((b) => [b.id, b.name]))
    if (bookmakerCountry !== 'dk') {
      for (const o of bySport) {
        for (const name of [o.a.bookmaker, o.b.bookmaker]) {
          const id = bookmakerId(name)
          if (!byId.has(id)) byId.set(id, FILTER_BOOKMAKERS.find((b) => b.id === id)?.name ?? name)
        }
      }
    }
    return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [bySport, allBookmakers, bookmakerCountry])
  const nameOf = (id: string) => bookmakerOptions.find((b) => b.id === id)?.name ?? FILTER_BOOKMAKERS.find((b) => b.id === id)?.name ?? id
  const bookmakerLabel = bookmakers.length === 1 ? nameOf(bookmakers[0]) : `${bookmakers.length} ${t('bookmakers').toLowerCase()}`
  const filteredBookmakerOptions = bookmakerOptions.filter((bookmaker) => bookmaker.name.toLowerCase().includes(bookmakerSearch.trim().toLowerCase()))
  const bookmakerGroups = filteredBookmakerOptions.reduce<Record<string, typeof filteredBookmakerOptions>>((groups, bookmaker) => {
    const normalized = bookmaker.name.toLowerCase()
    const countrySuffix = bookmaker.name.match(/\(([a-z]{2})\)$/i)?.[1]?.toLowerCase()
    const selectedCountryCode = bookmakerCountry.split('-')[0].toLowerCase()
    const group = normalized.includes('exchange') || normalized.includes('betfair exchange') ? 'Exchanges' : normalized.includes('live') ? 'Live Betting' : ['stake', '1xbet', 'betonline', 'bovada', 'mybookie', 'betus', 'cloudbet', 'bc.game', 'dafabet', 'bet9ja'].some((name) => normalized.includes(name)) ? 'Offshore' : countrySuffix === selectedCountryCode ? 'Local' : 'Global'
    if (group === 'Local' && countrySuffix !== selectedCountryCode) return groups
    ;(groups[group] ??= []).push(bookmaker)
    return groups
  }, {})
  const markets = useMemo(() => Array.from(new Set(bySport.map((o) => o.market))).sort(), [bySport])

  const visible = useMemo(() => {
    const list = bySport.filter(
      (o) =>
        matchesBookmakers(o, bookmakers) &&
        (market === 'Alle' || o.market === market) &&
        o.margin >= minMargin,
    )
    const sorted = [...list]
    if (sort === 'margin') sorted.sort((a, b) => b.margin - a.margin)
    else if (sort === 'kickoff') sorted.sort((a, b) => a.kickoffTs - b.kickoffTs)
    else if (sort === 'bookmaker') sorted.sort((a, b) => a.a.bookmaker.localeCompare(b.a.bookmaker) || b.margin - a.margin)
    else sorted.sort((a, b) => b.createdTs - a.createdTs || b.margin - a.margin)
    return sorted
  }, [bySport, bookmakers, market, minMargin, sort])

  function selectSport(next: string) {
    setSport(next)
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
    <section aria-label={t('sureBetsAria')} className="w-full min-w-0 overflow-x-hidden px-2.5 lg:flex-1 lg:px-0">
      <DesktopHero />
      <div className="-mx-2.5 flex gap-1.5 overflow-x-auto px-3 [scrollbar-width:none] lg:mx-0 lg:gap-2 lg:px-0 lg:pb-1" role="toolbar" aria-label={t('sportsAria')}>
        <button
          type="button"
          onClick={() => selectSport('Alle')}
          aria-pressed={sport === 'Alle'}
          className={cn(chip, 'w-14 justify-center px-0 lg:px-6', sport === 'Alle' ? chipActive : chipIdle)}
        >
          {t('all')}
        </button>
        {MAIN_SPORTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => selectSport(s)}
            aria-pressed={sport === s}
            className={cn(chip, chipMobile, s === 'Fodbold' && 'w-[75px]', s === 'Basketball' && 'w-[86px]', s === 'Tennis' && 'w-[69px]', sport === s ? chipActive : chipIdle)}
          >
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
          triggerClassName={cn(chip, 'w-[76px] justify-between px-[17px]', moreActive ? chipActive : chipIdle)}
          trigger={
            <>
              <span className="truncate">{moreActive ? t(SPORT_KEYS[sport] ?? 'more') : t('more')}</span>
              <ChevronDown className="size-3 shrink-0" />
            </>
          }
        >
          {(close) =>
            [...MORE_SPORTS, 'Favoritter'].map((s) => (
              <MenuOption key={s} selected={sport === s} onSelect={() => (selectSport(s), close())}>
                {tx(s)}
              </MenuOption>
            ))
          }
        </Popover>
        </div>
      </div>

      <div className="mt-[13px] flex gap-[13px] lg:mt-3 lg:grid lg:grid-cols-4 lg:gap-3">
        <Popover
          className="min-w-0 flex-[97_1_0%]"
          label={t('bookmakersFilter')}
          triggerClassName={filterBtn}
          panelClassName="left-0 w-[min(720px,calc(100vw-2rem))] p-0 lg:left-0"
          trigger={
            <>
              <ListFilter className="size-3 shrink-0 lg:size-5" />
              <span className="min-w-0 flex-1 truncate text-left">{bookmakers.length === 0 ? t('bookmakersFilter') : bookmakerLabel}</span>
              <ChevronDown className="size-3 shrink-0 lg:size-4" />
            </>
          }
        >

          {(close) => (
            <div className="overflow-hidden">
              <div className="border-b border-[#273452] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('bookmakersFilter')}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Choose bookmakers available in your country</p>
                  </div>
                  <button type="button" onClick={() => setBookmakers([])} className="rounded-lg border border-[#42516f] px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent">Clear all</button>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#273452] bg-[#182238] px-3 py-2">
                  <span aria-hidden="true" className="text-lg">{bookmakerCountry === 'dk' ? '🇩🇰' : bookmakerCountry === 'se' ? '🇸🇪' : bookmakerCountry === 'no' ? '🇳🇴' : bookmakerCountry === 'gb-eng' ? '🇬🇧' : bookmakerCountry === 'de' ? '🇩🇪' : '🌐'}</span>
                  <select value={bookmakerCountry} onChange={(event) => setBookmakerCountry(event.target.value)} className="min-h-8 flex-1 bg-transparent text-sm font-medium text-foreground outline-none">
                    {BOOKMAKER_COUNTRIES.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
                  </select>
                  <X className="size-4 text-muted-foreground" aria-hidden="true" />
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#273452] bg-[#101a31] px-3">
                  <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                  <input value={bookmakerSearch} onChange={(event) => setBookmakerSearch(event.target.value)} placeholder="Search books ..." className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" aria-label="Search bookmakers" />
                  {bookmakerSearch && <button type="button" onClick={() => setBookmakerSearch('')} aria-label="Clear search"><X className="size-4 text-muted-foreground" /></button>}
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
                  {(['Local', 'Offshore', 'Global', 'Exchanges', 'Live Betting'] as const).map((geo) => <button key={geo} type="button" onClick={() => setBookmakerGeo(geo)} className={cn('rounded-lg border px-3 py-2 text-xs font-semibold whitespace-nowrap', bookmakerGeo === geo ? 'border-primary bg-primary/15 text-primary' : 'border-[#273452] text-muted-foreground hover:bg-accent')}>{geo}</button>)}
                </div>
              </div>
              <div className="max-h-[360px] space-y-3 overflow-y-auto bg-[#0c1428] p-3">
                {Object.entries(bookmakerGroups).map(([group, options]) => <div key={group} className={cn('rounded-xl border border-[#273452] bg-[#121c3a] p-3', bookmakerGeo !== group && 'hidden')}>
                  <div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-primary">{group} <span className="text-xs text-muted-foreground">{options.length} available</span></span><button type="button" onClick={() => setBookmakers((prev) => Array.from(new Set([...prev, ...options.map((option) => option.id)])))} className="rounded-md border border-[#42516f] px-2 py-1 text-xs text-muted-foreground">Select all</button></div>
                  <div className="grid gap-2 sm:grid-cols-2">{options.map((b) => <button key={b.id} type="button" onClick={() => setBookmakers((prev) => toggleBookmaker(prev, b.id))} className={cn('flex min-h-12 items-center justify-between rounded-lg border px-3 text-left text-sm', bookmakers.includes(b.id) ? 'border-primary bg-primary/15 text-foreground' : 'border-[#354579] bg-[#1b216b]/30 text-muted-foreground hover:border-primary')}><span className="truncate">{b.name}</span><span className={cn('size-2 rounded-full', bookmakers.includes(b.id) ? 'bg-primary' : 'bg-[#e40046]')} /></button>)}</div>
                </div>)}
                {filteredBookmakerOptions.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No bookmakers found</p>}
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-[#273452] bg-[#10182e] p-3"><button type="button" onClick={close} className="rounded-lg bg-[#34405a] px-4 py-2 text-sm font-semibold text-white">Cancel</button><button type="button" onClick={close} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Apply filters</button></div>
            </div>
          )}
        </Popover>
        <Popover
          className="min-w-0 flex-[140_1_0%]"
          label={t('minMargin')}
          triggerClassName={filterBtn}
          trigger={
            <>
              <SmallBarsIcon className="size-2.5 shrink-0 lg:size-5" />
              <span className="min-w-0 flex-1 truncate text-left">
                {t('minMargin')}: <span className="text-primary">{minMargin}%</span>
              </span>
              <ChevronDown className="size-3 shrink-0 lg:size-4" />
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
          className="min-w-0 flex-[127_1_0%]"
          align="right"
          label={t('sorting')}
          triggerClassName={filterBtn}
          trigger={
            <>
              <ArrowDownWideNarrow className="size-3 shrink-0 lg:size-5" />
              <span className="min-w-0 flex-1 truncate text-left">
                <span className="lg:hidden">{t(SORTS.find((s) => s.id === sort)?.key ?? 'newest').replace(/\s+margin$/i, '')}</span>
                <span className="hidden lg:inline">{t(SORTS.find((s) => s.id === sort)?.key ?? 'newest')}</span>
              </span>
              <ChevronDown className="size-3 shrink-0 lg:size-4" />
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
        {t('foundCount', { count: visible.length })}
      </p>

      <div
        className={cn(
          'mt-3 flex flex-col gap-[9px] lg:gap-3',
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
