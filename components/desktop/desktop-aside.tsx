import { CircleHelp, Layers, Target, TrendingUp, Trophy, Zap } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { BarsIcon } from '@/components/icons'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'
import { formatOdds, formatPct } from '@/lib/odds'

const card = 'rounded-2xl border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_60%,#071a2a_100%)]'

const FEATURES = [
  { icon: Layers, value: '2.000+', label: 'Bookmakere' },
  { icon: Zap, value: '24/7', label: 'Live scanning' },
  { icon: Trophy, value: '30+', label: 'Sportsgrene' },
] as const

const timeFormat = new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })

function ExampleOdds({ bookmaker, label, odds }: { bookmaker: string; label: string; odds: number }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-[#1a3557] bg-[#081123] p-2.5">
      <BookmakerLogo name={bookmaker} className="size-11 shrink-0 rounded-[10px]" />
      <div className="min-w-0">
        <p className="truncate text-[12px] text-[#d5ddef]">{bookmaker}</p>
        <p className="truncate text-[12px] text-[#d5ddef]">{label}</p>
        <p className="text-[19px] font-extrabold tabular-nums text-[#55a8ff]">{formatOdds(odds)}</p>
      </div>
    </div>
  )
}

export function DesktopAside({ opportunities }: { opportunities: Opportunity[] }) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const foundToday = opportunities.filter((o) => o.createdTs >= startOfToday.getTime()).length || opportunities.length
  const example = [...opportunities].sort((a, b) => b.margin - a.margin)[0]
  const latest = [...opportunities].sort((a, b) => b.createdTs - a.createdTs).slice(0, 5)

  return (
    <aside aria-label="Overblik" className="sticky top-[86px] hidden w-[345px] shrink-0 flex-col gap-4 xl:flex">
      <section id="live-scanning" className={`${card} scroll-mt-24 p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-3 text-[16px] font-semibold">
              <span className="size-2.5 animate-pulse rounded-full bg-success shadow-[0_0_10px_var(--success)]" aria-hidden="true" />
              Live scanning
            </h2>
            <p className="mt-2 pl-[22px] text-[15px] leading-snug text-[#c3cde2]">
              Vi scanner konstant efter nye muligheder hos 2.000+ bookmakere.
            </p>
          </div>
          <BarsIcon className="mt-8 size-14 shrink-0 text-primary" />
        </div>
        <ul className="mt-4 flex flex-col gap-3 border-t border-[#13294a] pt-4">
          {FEATURES.map(({ icon: Icon, value, label }) => (
            <li key={label} className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#0b1c35] text-[#55a8ff]">
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[17px] font-bold">{value}</span>
                <span className="block text-[15px] text-[#c3cde2]">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${card} flex items-end justify-between p-4`}>
        <div>
          <h2 className="flex items-center gap-3 text-[15px] font-semibold">
            <Target className="size-7 text-[#55a8ff]" aria-hidden="true" />
            Fundne muligheder i dag
          </h2>
          <p className="mt-1 pl-12 text-[40px] font-extrabold leading-none tabular-nums">{foundToday}</p>
        </div>
        <BarsIcon className="size-14 text-primary" />
      </section>

      {example && (
        <section className={`${card} p-4`}>
          <h2 className="text-[15px] font-semibold">Eksempel på sikkerbet</h2>
          <div className="mt-3 flex items-center justify-around">
            <span className="flex flex-col items-center gap-1.5">
              <TeamCrest name={example.homeTeam} className="size-12 text-[11px]" />
              <span className="text-[14px] font-semibold">{example.homeTeam}</span>
            </span>
            <span className="text-sm text-muted-foreground">vs</span>
            <span className="flex flex-col items-center gap-1.5">
              <TeamCrest name={example.awayTeam} className="size-12 text-[11px]" />
              <span className="text-[14px] font-semibold">{example.awayTeam}</span>
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <ExampleOdds {...example.a} />
            <ExampleOdds {...example.b} />
          </div>
          <p className="mt-3 flex items-center gap-3 text-[17px] font-semibold text-[#55a8ff]">
            <TrendingUp className="size-6" aria-hidden="true" />
            Potentiel profit:
            <span className="text-[24px] font-extrabold tabular-nums">{formatPct(example.margin)}</span>
            <CircleHelp className="ml-auto size-5 text-[#d5ddef]" aria-label="Profit ved korrekt indsatsfordeling" />
          </p>
        </section>
      )}

      {latest.length > 0 && (
        <section className={`${card} p-4`}>
          <h2 className="text-[15px] font-semibold">Seneste fund</h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {latest.map((o) => (
              <li key={o.id} className="flex items-center gap-3 text-[13px]">
                <span className="size-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[#e6ecf7]">
                  {o.homeTeam} vs {o.awayTeam}
                </span>
                <span className="rounded-md bg-success/15 px-2 py-0.5 font-semibold tabular-nums text-success">
                  + {formatPct(o.margin)}
                </span>
                <span className="w-10 text-right tabular-nums text-[#c3cde2]">{timeFormat.format(o.kickoffTs)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  )
}
