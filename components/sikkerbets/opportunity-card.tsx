import Link from 'next/link'
import { ArrowRight, Calculator, Info, Lock, Megaphone, Star } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { Flag } from '@/components/flag'
import { SmallBarsIcon } from '@/components/icons'
import { LockBadge, LockTile } from '@/components/locked-odds'
import { TeamCrest } from '@/components/team-crest'
import type { Opportunity } from '@/lib/data'
import { formatOdds, formatPct } from '@/lib/odds'
import { cn } from '@/lib/utils'

function OddsBox({
  bookmaker,
  label,
  odds,
  loggedIn,
}: {
  bookmaker: string
  label: string
  odds: number
  loggedIn: boolean
}) {
  const boxClass =
    'relative flex h-10 min-w-0 items-center gap-[7px] rounded-[11px] border border-[#1a3557] bg-[#07101f] pl-[5px] pr-2'

  const details = (
    <>
      <BookmakerLogo name={bookmaker} className="size-[26px] shrink-0 rounded-[7px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9.5px] font-semibold leading-3 text-[#f3f6fc]">{bookmaker}</p>
        {loggedIn ? (
          <p className="mt-1 truncate text-[9px] leading-3 text-[#a9b6d3]" title={label}>
            {label}
          </p>
        ) : (
          <p className="mt-1 truncate text-[9px] leading-3 text-[#6b7da3]">Låst</p>
        )}
      </div>
    </>
  )

  if (!loggedIn) {
    return (
      <Link
        href="/konto"
        aria-label={`Opret gratis konto for at se oddsene fra ${bookmaker}`}
        className={cn(boxClass, 'transition-colors hover:border-primary')}
      >
        {details}
        <LockBadge className="size-[22px] shrink-0" />
      </Link>
    )
  }

  return (
    <div className={boxClass}>
      {details}
      <p className="mt-2 shrink-0 text-[14.5px] font-extrabold leading-none tracking-tight tabular-nums text-[#4aa3ff]">
        {formatOdds(odds)}
      </p>
      <Megaphone className="absolute right-2 top-1 size-2.5 text-[#2b4062]" aria-hidden="true" />
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
    <article className="w-full rounded-[14px] border border-[#183252] bg-[linear-gradient(135deg,#0a1628_0%,#07111f_55%,#08182a_100%)] pb-[6.5px] pl-2.5 pr-[5.5px] pt-[7.5px] lg:hidden">
      <div className="flex h-4 items-center justify-between gap-2 pl-px pr-[7.5px] text-[9.5px] text-[#a9b6d3]">
        <span className="flex min-w-0 items-center gap-[5px]">
          <Flag code={o.countryCode} label={o.country} className="size-4" />
          <span className="truncate">{o.league}</span>
        </span>
        <span className="shrink-0 tabular-nums">{o.kickoffLabel}</span>
      </div>

      <div className="mt-0.5 grid grid-cols-[minmax(0,1fr)_99.5px] gap-x-[5px]">
        <div className="flex min-w-0 flex-col">
          <div className="grid h-7 grid-cols-[minmax(0,1.12fr)_auto_minmax(0,1fr)] items-center">
            <span className="flex min-w-0 items-center gap-2.5">
              <TeamCrest name={o.homeTeam} logoUrl={o.homeLogo} className="size-7 text-[8px]" fallbackClassName="border-[1.5px]" />
              <span className="line-clamp-2 min-w-0 text-[10.5px] font-bold leading-[1.15] [hyphens:auto] [overflow-wrap:anywhere]" lang="da">
                {o.homeTeam}
              </span>
            </span>
            <span className="px-3 text-[9.5px] text-[#6b7da3]">vs</span>
            <span className="flex min-w-0 items-center gap-2.5 pl-1">
              <TeamCrest name={o.awayTeam} logoUrl={o.awayLogo} className="size-7 text-[8px]" fallbackClassName="border-[1.5px]" />
              <span className="line-clamp-2 min-w-0 text-[10.5px] font-bold leading-[1.15] [hyphens:auto] [overflow-wrap:anywhere]" lang="da">
                {o.awayTeam}
              </span>
            </span>
          </div>
          <p className="mt-1.5 flex h-3 min-w-0 items-center gap-[7px] pl-[3px] text-[10px] text-[#d5ddef]">
            {loggedIn ? (
              <>
                <SmallBarsIcon className="size-2.5 shrink-0 text-[#8fa3cc]" />
                <span className="truncate">{o.market}</span>
              </>
            ) : (
              <>
                <Lock className="size-2.5 shrink-0 text-[#8fa3cc]" aria-hidden="true" />
                <span className="truncate text-[#8fa3cc]">Marked låst</span>
              </>
            )}
          </p>
          <div className="mt-[6.5px] grid grid-cols-2 gap-1.5">
            <OddsBox {...o.a} loggedIn={loggedIn} />
            <OddsBox {...o.b} loggedIn={loggedIn} />
          </div>
        </div>

        <div className="flex h-[85px] flex-col justify-between self-end rounded-[13px] border border-[#1b6b55] bg-[#041a1c] pb-[7.5px] pl-3 pr-2.5 pt-2.5">
          <div>
            <div className="flex h-[11px] items-center justify-between">
              <span className="text-[9px] font-medium leading-none text-[#6ee7b7]">MARGIN</span>
              <SmallBarsIcon className="size-2.5 text-[#7db4d0]" />
            </div>
            <p
              className={`mt-[3px] whitespace-nowrap font-bold leading-[1.1] tabular-nums tracking-tight text-[#5fe8b0] ${formatPct(o.margin).length > 6 ? 'text-[18.5px]' : 'text-[23px]'}`}
            >
              {formatPct(o.margin)}
            </p>
          </div>
          <span
            className="mx-[-5px] flex h-5 items-center justify-center gap-1.5 rounded-full border border-[#1f3a63] bg-[#0a1630] text-[9.5px] text-[#e3e9f5]"
            title="Begge mulige udfald er dækket"
          >
            2 udfald <Info className="size-2.5 text-[#8fa3cc]" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 pr-[4.5px]">
        <Link
          href={`/beregn?id=${o.id}`}
          className="flex h-[34px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(100deg,#1a86ff,#1676f5)] px-3 text-[11.5px] font-semibold text-primary-foreground transition-colors hover:bg-[#2a85ff] active:bg-[#0f63d6]"
        >
          <Calculator className="mr-1 size-[13px] shrink-0" aria-hidden="true" />
          Beregn indsats
          <ArrowRight className="size-3 shrink-0" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite(o.id)}
          aria-pressed={o.favorite}
          aria-label={o.favorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#1b3557] bg-[#081123] transition-colors hover:bg-accent"
        >
          <Star className={cn('size-4', o.favorite ? 'fill-[#facc15] text-[#facc15]' : 'text-[#d5ddef]')} />
        </button>
      </div>
    </article>
  )
}
