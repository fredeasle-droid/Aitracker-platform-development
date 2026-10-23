import { Flag } from '@/components/flag'
import { SmallBarsIcon } from '@/components/icons'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'

export function MatchCard({ opportunity: o }: { opportunity: Opportunity }) {
  return (
    <section aria-label="Kamp" className="relative overflow-hidden rounded-2xl border border-[#1d4e8f] bg-[linear-gradient(180deg,rgba(4,29,61,.88),rgba(4,16,34,.96))] p-4 shadow-[0_12px_40px_-25px_#159cff] lg:p-5">
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
