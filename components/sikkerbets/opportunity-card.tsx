import Link from 'next/link'
import { ArrowRight, Calculator, Info, LockKeyhole, Star } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { Flag } from '@/components/flag'
import { SmallBarsIcon } from '@/components/icons'
import { LockTile } from '@/components/locked-odds'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'
import { formatOdds, formatPct } from '@/lib/odds'
import { cn } from '@/lib/utils'

function OddsBox({ bookmaker, label, odds, loggedIn }: { bookmaker: string; label: string; odds: number; loggedIn: boolean }) {
  return (
    <div className="flex h-16 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#1a3557] bg-[#081123] pl-2 pr-2.5">
      <BookmakerLogo name={bookmaker} className="size-10 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-[#f3f6fc]">{bookmaker}</p>
        <p className="mt-1 truncate text-[12px] leading-tight text-[#a9b6d3]" title={label}>
          {label}
        </p>
      </div>
      {loggedIn ? (
        <p className="shrink-0 text-[20px] font-extrabold leading-none tabular-nums text-[#55a8ff]">{formatOdds(odds)}</p>
      ) : (
        <Link
          href="/konto"
          aria-label={`Lås odds op hos ${bookmaker}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#1f4a7a] text-[#55a8ff] transition-colors hover:bg-accent"
        >
          <LockKeyhole className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

function RowOdds({ bookmaker, label, odds, loggedIn }: { bookmaker: string; label: string; odds: number; loggedIn: boolean }) {
  if (!loggedIn) return <LockTile bookmaker={bookmaker} className="h-[72px] min-w-0" />

  return (
    <div className="flex h-[72px] min-w-0 items-center gap-2.5 rounded-xl border border-[#1a3557] bg-[#081123] px-2.5">
      <BookmakerLogo name={bookmaker} className="size-10 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1 pr-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[#d5ddef]">{bookmaker}</p>
        <p className="truncate text-[12px] text-[#a9b6d3]" title={label}>
          {label}
        </p>
        <p className="text-[19px] font-extrabold leading-tight tabular-nums text-[#55a8ff]">{formatOdds(odds)}</p>
      </div>
    </div>
  )
}

function DesktopRow({
  opportunity: o,
  onToggleFavorite,
  loggedIn,
}: {
  opportunity: Opportunity
  onToggleFavorite: (id: number) => void
  loggedIn: boolean
}) {
  return (
    <article className="hidden items-center gap-3 px-4 py-3 transition-colors hover:bg-[#0a1830] lg:grid lg:grid-cols-[minmax(0,104px)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_108px_auto]">
      <div className="min-w-0 text-[13px]">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <Flag code={o.countryCode} label={o.country} />
          <span className="truncate">{o.league}</span>
        </p>
        <p className="mt-1.5 text-[#a9b6d3]">{o.kickoffLabel}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        {[
          { team: o.homeTeam, logo: o.homeLogo },
          { team: o.awayTeam, logo: o.awayLogo },
        ].map(({ team, logo }) => (
          <span key={team} className="flex min-w-0 items-center gap-2.5">
            <TeamCrest name={team} logoUrl={logo} className="size-7 shrink-0 text-[9px]" />
            <span className="truncate text-[14px] font-medium">{team}</span>
          </span>
        ))}
      </div>

      <RowOdds {...o.a} loggedIn={loggedIn} />
      <RowOdds {...o.b} loggedIn={loggedIn} />

      <div className="flex h-[72px] flex-col justify-center rounded-xl border border-[#23785f] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(46,230,166,0.17),rgba(8,30,30,0.62))] px-2.5 shadow-[0_0_24px_-12px_var(--success)]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wide text-success">MARGIN</span>
          <SmallBarsIcon className="size-3.5 text-success/80" />
        </div>
        <p className="text-[20px] font-extrabold leading-tight tabular-nums text-success">{formatPct(o.margin)}</p>
        <span className="flex items-center justify-center gap-1 text-[10px] text-[#d5ddef]" title="Begge mulige udfald er dækket">
          2 udfald <Info className="size-3" aria-hidden="true" />
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/beregn?id=${o.id}`}
          className="flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl border border-border bg-[#081123] px-3.5 text-[13px] font-semibold transition-colors hover:border-primary hover:bg-accent"
        >
          Se detaljer
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite(o.id)}
          aria-pressed={o.favorite}
          aria-label={o.favorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
          className="hidden size-9 items-center justify-center rounded-full transition-colors hover:bg-accent 2xl:flex"
        >
          <Star className={cn('size-5', o.favorite ? 'fill-[#facc15] text-[#facc15]' : 'text-[#8fa3cc]')} />
        </button>
      </div>
    </article>
  )
}

export function OpportunityCard(props: {
  opportunity: Opportunity
  onToggleFavorite: (id: number) => void
  loggedIn: boolean
}) {
  return (
    <>
      <MobileCard {...props} />
      <DesktopRow {...props} />
    </>
  )
}

function MobileCard({
  opportunity: o,
  onToggleFavorite,
  loggedIn,
}: {
  opportunity: Opportunity
  onToggleFavorite: (id: number) => void
  loggedIn: boolean
}) {
  return (
    <article className="w-full rounded-3xl border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_55%,#071a2a_100%)] p-3 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.85)] lg:hidden">
      <div className="flex items-center justify-between gap-2 px-0.5 text-[13px] text-[#a9b6d3]">
        <span className="flex min-w-0 items-center gap-2">
          <Flag code={o.countryCode} label={o.country} />
          <span className="truncate">
            {o.country} · {o.league}
          </span>
        </span>
        <span className="shrink-0 tabular-nums">{o.kickoffLabel}</span>
      </div>

      <div className="mt-2 flex gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <TeamCrest name={o.homeTeam} logoUrl={o.homeLogo} className="size-9 border-2 text-[10px]" />
              <span className="line-clamp-2 min-w-0 text-[13.5px] font-bold leading-tight [hyphens:auto] [overflow-wrap:anywhere]" lang="da">
                {o.homeTeam}
              </span>
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">vs</span>
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <TeamCrest name={o.awayTeam} logoUrl={o.awayLogo} className="size-9 border-2 text-[10px]" />
              <span className="line-clamp-2 min-w-0 text-[13.5px] font-bold leading-tight [hyphens:auto] [overflow-wrap:anywhere]" lang="da">
                {o.awayTeam}
              </span>
            </span>
          </div>
          <p className="flex min-w-0 items-center gap-1.5 text-[14px] text-[#d5ddef]">
            <SmallBarsIcon className="size-4 shrink-0 text-[#8fa3cc]" />
            <span className="truncate">{o.market}</span>
          </p>
        </div>

        <div className="flex w-[96px] shrink-0 flex-col justify-center gap-1 rounded-2xl border border-[#23785f] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(46,230,166,0.17),rgba(8,30,30,0.62))] px-2 py-2 shadow-[0_0_24px_-10px_var(--success)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wide text-success">MARGIN</span>
            <SmallBarsIcon className="size-3.5 text-success/80" />
          </div>
          <p className="text-[22px] font-extrabold leading-none tabular-nums tracking-tight text-success">{formatPct(o.margin)}</p>
          <span
            className="flex items-center justify-center gap-1 rounded-full border border-border bg-[#0a1426] py-0.5 text-[11px] text-[#d5ddef]"
            title="Begge mulige udfald er dækket"
          >
            2 udfald <Info className="size-3" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <OddsBox bookmaker={o.a.bookmaker} label={o.a.label} odds={o.a.odds} loggedIn={loggedIn} />
        <OddsBox bookmaker={o.b.bookmaker} label={o.b.label} odds={o.b.odds} loggedIn={loggedIn} />
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Link
          href={`/beregn?id=${o.id}`}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(100deg,#1682ff,#1372ee)] px-3 text-[15px] font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)] transition-colors hover:bg-[#2a85ff] active:bg-[#0f63d6]"
        >
          <Calculator className="size-5 shrink-0" aria-hidden="true" />
          Beregn indsats
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
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
