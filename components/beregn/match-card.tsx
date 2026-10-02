import { Flag } from '@/components/flag'
import { SmallBarsIcon } from '@/components/icons'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'

export function MatchCard({ opportunity: o }: { opportunity: Opportunity }) {
  return (
    <section aria-label="Kamp" className="rounded-2xl border border-border bg-card/80 p-3.5">
      <div className="flex items-center justify-between gap-2 text-[14px] text-[#a9b6d3]">
        <span className="flex min-w-0 items-center gap-2">
          <Flag code={o.countryCode} label={o.country} />
          <span className="truncate">
            {o.country} · {o.league}
          </span>
        </span>
        <span className="shrink-0">{o.kickoffLabel}</span>
      </div>
      <h1 className="mt-3 flex items-center gap-2">
        <span className="flex min-w-0 flex-1 items-center gap-2.5">
          <TeamCrest name={o.homeTeam} className="size-12" />
          <span className="text-[16px] font-bold leading-tight">{o.homeTeam}</span>
        </span>
        <span className="shrink-0 text-lg font-bold text-[#6b7ba0]">VS</span>
        <span className="flex min-w-0 flex-1 items-center justify-end gap-2.5 sm:justify-start">
          <TeamCrest name={o.awayTeam} className="size-12" />
          <span className="text-[16px] font-bold leading-tight">{o.awayTeam}</span>
        </span>
      </h1>
      <p className="mt-3 flex items-center gap-2 text-[15px] text-[#d5ddef]">
        <SmallBarsIcon className="size-5 text-primary" />
        {o.market}
      </p>
    </section>
  )
}
