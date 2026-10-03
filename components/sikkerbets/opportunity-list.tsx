'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { ChevronDown, ListFilter, ArrowDownWideNarrow } from 'lucide-react'
import { toggleFavorite } from '@/app/actions'
import { MenuOption, Popover } from '@/components/menu'
import { SmallBarsIcon } from '@/components/icons'
import { OpportunityCard } from '@/components/sikkerbets/opportunity-card'
import type { Opportunity } from '@/lib/data'
import { cn } from '@/lib/utils'

const MAIN_SPORTS = ['Fodbold', 'Basketball', 'Tennis'] as const
const MORE_SPORTS = ['Ishockey', 'Håndbold'] as const
const MARGINS = [0, 1, 2, 3, 4, 5]
const SORTS = [
  { id: 'newest', label: 'Nyeste først' },
  { id: 'margin', label: 'Højeste margin' },
  { id: 'kickoff', label: 'Starter snart' },
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
  const [minMargin, setMinMargin] = useState(3)
  const [sort, setSort] = useState<SortId>('newest')
  const [, startTransition] = useTransition()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(document.cookie.includes('bettracker_logged_in=true'))
  }, [])

  const [prevInitial, setPrevInitial] = useState(initial)
  if (initial !== prevInitial) {
    setPrevInitial(initial)
    setItems(initial)
  }

  const bySport = useMemo(
    () =>
      items.filter((o) =>
        sport === 'Alle' ? true : sport === 'Favoritter' ? o.favorite : o.sport === sport,
      ),
    [items, sport],
  )
  const leagues = useMemo(() => Array.from(new Set(bySport.map((o) => o.league))).sort(), [bySport])

  const visible = useMemo(() => {
    const list = bySport.filter(
      (o) => (league === 'Alle' || o.league === league) && o.margin >= minMargin,
    )
    const sorted = [...list]
    if (sort === 'margin') sorted.sort((a, b) => b.margin - a.margin)
    else if (sort === 'kickoff') sorted.sort((a, b) => a.kickoffTs - b.kickoffTs)
    else sorted.sort((a, b) => b.createdTs - a.createdTs || b.margin - a.margin)
    return sorted
  }, [bySport, league, minMargin, sort])

  function selectSport(next: string) {
    setSport(next)
    setLeague('Alle')
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
    <section aria-label="SikkerBets" className="w-full min-w-0 overflow-x-hidden px-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="toolbar" aria-label="Sportsgren">
        <button type="button" onClick={() => selectSport('Alle')} aria-pressed={sport === 'Alle'} className={cn(chip, 'px-6', sport === 'Alle' ? chipActive : chipIdle)}>
          Alle
        </button>
        {MAIN_SPORTS.map((s) => (
          <button key={s} type="button" onClick={() => selectSport(s)} aria-pressed={sport === s} className={cn(chip, sport === s ? chipActive : chipIdle)}>
            <SportGlyph sport={s} />
            {s}
          </button>
        ))}
        <Popover
          align="right"
          label="Flere sportsgrene"
          triggerClassName={cn(chip, 'px-4', moreActive ? chipActive : chipIdle)}
          trigger={
            <>
              {moreActive ? sport : 'Flere'}
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

      <div className="mt-3 grid grid-cols-[1fr_1.35fr_1.3fr] gap-2">
        <Popover
          label="Vælg liga"
          triggerClassName={filterBtn}
          trigger={
            <>
              <ListFilter className="size-5 shrink-0" />
              <span className="truncate">{league === 'Alle' ? 'Ligaer' : league}</span>
              <ChevronDown className="size-4 shrink-0" />
            </>
          }
        >
          {(close) => (
            <div className="max-h-72 overflow-y-auto">
              <MenuOption selected={league === 'Alle'} onSelect={() => (setLeague('Alle'), close())}>
                Alle ligaer
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
                Min. margin: <span className="text-primary">{minMargin}%</span>
              </span>
              <ChevronDown className="size-4 shrink-0" />
            </>
          }
        >
          {(close) =>
            MARGINS.map((m) => (
              <MenuOption key={m} selected={minMargin === m} onSelect={() => (setMinMargin(m), close())}>
                {m === 0 ? 'Alle margins' : `Mindst ${m}%`}
              </MenuOption>
            ))
          }
        </Popover>
        <Popover
          align="right"
          label="Sortering"
          triggerClassName={filterBtn}
          trigger={
            <>
              <ArrowDownWideNarrow className="size-5 shrink-0" />
              <span className="truncate">{SORTS.find((s) => s.id === sort)?.label}</span>
              <ChevronDown className="size-4 shrink-0" />
            </>
          }
        >
          {(close) =>
            SORTS.map((s) => (
              <MenuOption key={s.id} selected={sort === s.id} onSelect={() => (setSort(s.id), close())}>
                {s.label}
              </MenuOption>
            ))
          }
        </Popover>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} SikkerBets fundet
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-semibold">Ingen SikkerBets matcher</p>
            <p className="mt-1 text-sm text-muted-foreground">Prøv en lavere minimum margin eller en anden sportsgren.</p>
            <button
              type="button"
              onClick={() => {
                selectSport('Alle')
                setMinMargin(0)
              }}
              className="mt-4 min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Nulstil filtre
            </button>
          </div>
        ) : (
          visible.map((o) => <OpportunityCard key={o.id} opportunity={o} onToggleFavorite={handleFavorite} loggedIn={loggedIn} />)
        )}
      </div>
    </section>
  )
}
