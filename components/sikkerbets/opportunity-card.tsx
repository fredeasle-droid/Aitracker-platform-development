import Link from 'next/link'
import { ArrowRight, Calculator, Info, Star } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { Flag } from '@/components/flag'
import { SmallBarsIcon } from '@/components/icons'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'
import { formatOdds, formatPct } from '@/lib/odds'
import { cn } from '@/lib/utils'

function OddsBox({ bookmaker, label, odds }: { bookmaker: string; label: string; odds: number }) {
  return (
    <div className="flex h-[80px] min-w-0 flex-1 items-center gap-2.5 rounded-[18px] border border-[#1a3557] bg-[#081123] px-3">
      <BookmakerLogo name={bookmaker} className="size-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-[#f3f6fc]">{bookmaker}</p>
        <p className="mt-1 truncate text-[12px] leading-tight text-[#a9b6d3]">{label}</p>
      </div>
      <p className="text-[20px] font-extrabold tabular-nums text-[#55a8ff]">{formatOdds(odds)}</p>
    </div>
  )
}

export function OpportunityCard({
  opportunity: o,
  onToggleFavorite,
}: {
  opportunity: Opportunity
  onToggleFavorite: (id: number) => void
}) {
  return (
    <article className="w-full rounded-[24px] border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_55%,#071a2a_100%)] p-4 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between gap-2 text-[13px] text-[#a9b6d3]">
        <span className="flex min-w-0 items-center gap-2">
          <Flag code={o.countryCode} label={o.country} />
          <span className="truncate">
            {o.country} · {o.league}
          </span>
        </span>
        <span className="shrink-0">{o.kickoffLabel}</span>
      </div>

      <div className="mt-2.5 flex min-h-[106px] gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <TeamCrest name={o.homeTeam} className="size-11 shrink-0 text-[11px]" />
              <span className="min-w-0 break-words text-[15px] font-bold leading-tight [hyphens:auto]">{o.homeTeam}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">vs</span>
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <TeamCrest name={o.awayTeam} className="size-11 shrink-0 text-[11px]" />
              <span className="min-w-0 break-words text-[15px] font-bold leading-tight [hyphens:auto]">{o.awayTeam}</span>
            </span>
          </div>
          <p className="mt-3 flex items-center gap-2 text-[15px] text-[#d5ddef]">
            <SmallBarsIcon className="size-4 text-[#8fa3cc]" />
            {o.market}
          </p>
        </div>

        <div className="flex w-[116px] shrink-0 flex-col items-stretch justify-center rounded-[20px] border border-[#23785f] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(46,230,166,0.17),rgba(8,30,30,0.62))] px-3 py-2 shadow-[0_0_24px_-10px_var(--success)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-success">MARGIN</span>
            <SmallBarsIcon className="size-3.5 text-success/80" />
          </div>
          <p className="text-[26px] font-extrabold leading-tight tabular-nums text-success">{formatPct(o.margin)}</p>
          <span
            className="mt-1 flex items-center justify-center gap-1 rounded-full border border-border bg-[#0a1426] py-0.5 text-[11px] text-[#d5ddef]"
            title="Begge mulige udfald er dækket"
          >
            2 udfald <Info className="size-3" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex h-[80px] gap-2">
        <OddsBox bookmaker={o.a.bookmaker} label={o.a.label} odds={o.a.odds} />
        <OddsBox bookmaker={o.b.bookmaker} label={o.b.label} odds={o.b.odds} />
      </div>

      <div className="mt-2.5 flex items-center gap-2.5">
        <Link
          href={`/beregn?id=${o.id}`}
          className="flex min-h-[68px] flex-1 items-center justify-center gap-3 rounded-[20px] bg-[linear-gradient(100deg,#1682ff,#1372ee)] text-[18px] font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)] transition-colors hover:bg-[#2a85ff] active:bg-[#0f63d6]"
        >
          <Calculator className="size-5" />
          Beregn indsats
          <ArrowRight className="size-5" />
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite(o.id)}
          aria-pressed={o.favorite}
          aria-label={o.favorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-[#081123] transition-colors hover:bg-accent"
        >
          <Star className={cn('size-6', o.favorite ? 'fill-[#facc15] text-[#facc15]' : 'text-[#d5ddef]')} />
        </button>
      </div>
    </article>
  )
}
