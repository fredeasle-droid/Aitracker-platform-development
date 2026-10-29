import { FlagImage } from '@/components/flag-image'
import { SmallBarsIcon } from '@/components/icons'
import { TeamCrest } from '@/components/team-crest'
import { isIndividualSport } from '@/lib/individual-sports'
import type { Opportunity } from '@/lib/data'

const crest = 'lg:size-[76px] lg:rounded-full lg:bg-[#0b1b34] lg:p-2.5 lg:ring-1 lg:ring-[#1d3a63]'

export function MatchCard({ opportunity: o }: { opportunity: Opportunity }) {
  return (
    <section
      aria-label="Kamp"
      className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-3.5 lg:border-[#1d4e8f] lg:bg-[linear-gradient(180deg,rgba(4,29,61,.88),rgba(4,16,34,.96))] lg:p-6 lg:shadow-[0_12px_40px_-25px_#159cff]"
    >
      <img
        src="/images/hero-stadium.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden size-full object-cover opacity-20 lg:block"
      />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(4,16,34,.9),rgba(4,16,34,.55),rgba(4,16,34,.9))] lg:block" />

      <div className="relative">
        <div className="flex items-center justify-between gap-2 text-[14px] text-[#a9b6d3] lg:text-[16px]">
          <span className="flex min-w-0 items-center gap-2">
            <FlagImage code={o.countryCode} label={o.country} />
            <span className="truncate">
              {o.country} · {o.league}
            </span>
          </span>
          <span className="shrink-0">{o.kickoffLabel}</span>
        </div>
        <h2 className="mt-3 flex items-center gap-2 lg:mt-5">
          <span className="flex min-w-0 flex-1 items-center gap-2.5 lg:gap-5">
            <TeamCrest name={o.homeTeam} logoUrl={o.homeLogo} player={isIndividualSport(o.sport)} className={`size-12 ${crest}`} />
            <span className="text-[16px] font-bold leading-tight lg:text-[28px]">{o.homeTeam}</span>
          </span>
          <span className="shrink-0 text-lg font-bold text-[#6b7ba0] lg:px-6 lg:text-[24px]">VS</span>
          <span className="flex min-w-0 flex-1 items-center justify-end gap-2.5 sm:justify-start lg:gap-5">
            <TeamCrest name={o.awayTeam} logoUrl={o.awayLogo} player={isIndividualSport(o.sport)} className={`size-12 ${crest}`} />
            <span className="text-[16px] font-bold leading-tight lg:text-[28px]">{o.awayTeam}</span>
          </span>
        </h2>
        <p className="mt-3 flex items-center gap-2 text-[15px] text-[#d5ddef] lg:mt-5 lg:text-[16px]">
          <SmallBarsIcon className="size-5 text-primary" />
          {o.market}
        </p>
      </div>
    </section>
  )
}
