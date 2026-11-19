'use client'

import { Clock } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { FlagImage } from '@/components/flag-image'
import { SmallBarsIcon } from '@/components/icons'
import { Crest } from '@/components/sb/Crest'
import type { Opportunity } from '@/lib/data'

function Team({ name, logo }: { name: string; logo: string | null }) {
  return (
    <span className="flex min-w-0 flex-col items-center gap-2 text-center lg:flex-row lg:gap-4 lg:text-left lg:last:flex-row-reverse lg:last:text-right">
      <Crest src={logo} name={name} size="lg" className="lg:h-[76px] lg:w-[76px]" />
      <span className="line-clamp-2 break-words text-[15px] font-bold leading-tight lg:text-[26px]">{name}</span>
    </span>
  )
}

export function MatchCard({ opportunity: o }: { opportunity: Opportunity }) {
  const { t } = useLocale()
  return (
    <section aria-label={t('matchAria')} className="sb-panel hero-frame relative overflow-hidden p-4 lg:p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sb/hero-football.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-[70%_25%] opacity-40"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background/95" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-center justify-between gap-2 text-[13px] font-semibold">
          <span className="glass-pill flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5">
            <FlagImage code={o.countryCode} label={o.country} />
            <span className="truncate">
              {o.country} · {o.league}
            </span>
          </span>
          <span className="glass-pill flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 tabular-nums">
            <Clock className="size-3.5 text-cyan" aria-hidden="true" />
            {o.kickoffLabel}
          </span>
        </div>

        <h2 className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 lg:mt-6 lg:items-center lg:gap-6">
          <Team name={o.homeTeam} logo={o.homeLogo ?? null} />
          <span className="chip-surface mt-4 flex size-10 items-center justify-center rounded-full border border-border-glow/60 text-[13px] font-extrabold text-muted-foreground lg:mt-0 lg:size-12 lg:text-[15px]">
            VS
          </span>
          <Team name={o.awayTeam} logo={o.awayLogo ?? null} />
        </h2>

        <p className="mt-4 flex justify-center lg:mt-6">
          <span className="market-pill flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-cyan">
            <SmallBarsIcon className="size-4" />
            {o.market}
          </span>
        </p>
      </div>
    </section>
  )
}
