import Link from 'next/link'
import { ArrowRight, Calculator, Info, LockKeyhole, Star } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { Flag } from '@/components/flag'
import { SmallBarsIcon } from '@/components/icons'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'
import { formatOdds, formatPct } from '@/lib/odds'
import { cn } from '@/lib/utils'

function OddsBox({ bookmaker, label, odds, loggedIn }: { bookmaker: string; label: string; odds: number; loggedIn: boolean }) {
  return (
    <div className="flex h-[68px] min-w-0 flex-1 items-center gap-2 rounded-[16px] border border-[#1a3557] bg-[#081123] px-3">
      <BookmakerLogo name={bookmaker} className="size-10 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-[#f3f6fc]">{bookmaker}</p>
        <p className="mt-1 truncate text-[12px] leading-tight text-[#a9b6d3]">{label}</p>
      </div>
      {loggedIn ? <p className="text-[18px] font-extrabold tabular-nums text-[#55a8ff]">{formatOdds(odds)}</p> : <LockKeyhole className="size-4 shrink-0 text-[#f5c84b]" aria-label="Odds låst" />}
    </div>
  )
}

export function OpportunityCard({
  opportunity: o,
  onToggleFavorite,
}: {
  opportunity: Opportunity
  onToggleFavorite: (id: number) => void
  loggedIn: boolean
}) {
  return (
    <article className="w-full rounded-[24px] border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_55%,#071a2a_100%)] p-3.5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between gap-2 text-[13px] text-[#a9b6d3]">
        <span className="flex min-w-0 items-center gap-2">
          <Flag code={o.countryCode} label={o.country} />
          <span className="truncate">
            {o.country} · {o.league}
          </span>
        </span>
        <span className="shrink-0">{o.kickoffLabel}</span>
      </div>

      <div className="mt-1.5 flex min-h-[94px] gap-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <span className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
              <span className="min-h-[18px] min-w-0 break-words text-[14px] font-bold leading-tight [hyphens:auto]">{o.homeTeam}</span>
              <TeamCrest name={o.homeTeam} className="size-[54px] shrink-0 text-[11px]" />
            </span>
            <span className="mt-7 shrink-0 text-xs text-muted-foreground">vs</span>
            <span className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
              <span className="min-h-[18px] min-w-0 break-words text-[14px] font-bold leading-tight [hyphens:auto]">{o.awayTeam}</span>
              <TeamCrest name={o.awayTeam} className="size-[54px] shrink-0 text-[11px]" />
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[14px] text-[#d5ddef]">
            <SmallBarsIcon className="size-4 text-[#8fa3cc]" />
            {o.market}
          </p>
        </div>

        <div className="flex w-[108px] shrink-0 flex-col items-stretch justify-center rounded-[18px] border border-[#23785f] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(46,230,166,0.17),rgba(8,30,30,0.62))] px-2.5 py-1.5 shadow-[0_0_24px_-10px_var(--success)]">
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

      <div className="mt-1.5 flex h-[68px] gap-1.5">
        <OddsBox bookmaker={o.a.bookmaker} label={o.a.label} odds={o.a.odds} loggedIn={loggedIn} />
        <OddsBox bookmaker={o.b.bookmaker} label={o.b.label} odds={o.b.odds} loggedIn={loggedIn} />
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <Link
          href={loggedIn ? `/beregn?id=${o.id}` : '/konto'}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[14px] bg-[linear-gradient(100deg,#1682ff,#1372ee)] px-1.5 text-center text-[13px] font-semibold leading-tight text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)] transition-colors hover:bg-[#2a85ff] active:bg-[#0f63d6]"
        >
          {loggedIn ? <Calculator className="size-4 shrink-0" /> : <LockKeyhole className="size-4 shrink-0" />}
          {loggedIn ? 'Beregn indsats' : 'Opret gratis konto for at se oddsene'}
          <ArrowRight className="size-4 shrink-0" />
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
