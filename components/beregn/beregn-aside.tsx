'use client'

import Link from 'next/link'
import { CircleHelp, Layers, Target, TrendingUp, Trophy, Zap } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { LockedOdds } from '@/components/locked-odds'
import { BookmakerMark } from '@/components/sb/BookmakerMark'
import { Crest } from '@/components/sb/Crest'
import type { Opportunity } from '@/lib/data'
import { formatPct } from '@/lib/odds'
import { markId } from '@/components/beregn/mark-id'

const FEATURES = [
  { icon: Layers, value: '2.000+', labelKey: 'bookmakers' },
  { icon: Zap, value: '24/7', labelKey: 'live' },
  { icon: Trophy, value: '30+', labelKey: 'sportBranches' },
] as const

const timeFormat = new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })

/** Same content as DesktopAside, dressed in the surebets panel language. */
export function BeregnAside({ opportunities }: { opportunities: Opportunity[] }) {
  const { t } = useLocale()
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const foundToday = opportunities.filter((o) => o.createdTs >= startOfToday.getTime()).length || opportunities.length
  const example = [...opportunities].sort((a, b) => b.margin - a.margin)[0]
  const latest = [...opportunities].sort((a, b) => b.createdTs - a.createdTs).slice(0, 5)

  return (
    <aside aria-label={t('overview')} className="sticky top-4 hidden flex-col gap-4 xl:flex">
      <section className="sb-panel panel-glow edge-light relative overflow-hidden p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-[16px] font-bold">
            <span className="glow-dot size-2.5 animate-blink rounded-full bg-success" aria-hidden="true" />
            {t('live')}
          </h2>
          <span className="live-pill inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold tracking-[0.14em] text-success">
            <span className="size-1.5 animate-blink rounded-full bg-success" aria-hidden="true" /> LIVE
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t('scanText')}</p>
        <ul className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
          {FEATURES.map(({ icon: Icon, value, labelKey }) => (
            <li key={labelKey} className="flex items-center gap-3">
              <span className="chip-surface flex size-10 items-center justify-center rounded-lg border border-border text-primary-glow">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-bold">{value}</span>
                <span className="block text-[12.5px] text-muted-foreground">{t(labelKey)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sb-panel edge-light relative flex items-center justify-between p-5">
        <div>
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-muted-foreground">
            <Target className="size-5 text-cyan" aria-hidden="true" />
            {t('foundToday')}
          </h2>
          <p className="mt-1 text-[38px] font-extrabold leading-none tabular-nums">{foundToday}</p>
        </div>
        <TrendingUp className="icon-glow size-10 text-primary-glow" aria-hidden="true" />
      </section>

      {example && (
        <section className="sb-panel relative p-5">
          <h2 className="text-[15px] font-bold">{t('exampleTitle')}</h2>
          <div className="mt-3 flex items-center justify-around gap-2">
            <span className="flex min-w-0 flex-col items-center gap-1.5 text-center">
              <Crest src={example.homeLogo ?? null} name={example.homeTeam} />
              <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{example.homeTeam}</span>
            </span>
            <span className="text-[12px] font-extrabold text-muted-foreground">VS</span>
            <span className="flex min-w-0 flex-col items-center gap-1.5 text-center">
              <Crest src={example.awayLogo ?? null} name={example.awayTeam} />
              <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{example.awayTeam}</span>
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {[example.a, example.b].map((side) => (
              <div key={side.bookmaker + side.label} className="leg-row flex items-center gap-2 rounded-lg px-2.5 py-2">
                <span className="flex w-[92px] shrink-0 justify-center overflow-hidden">
                  <BookmakerMark id={markId(side.bookmaker)} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-muted-foreground">{side.label}</span>
                <span className="odds-chip rounded-md border px-2 py-0.5 text-[15px] font-extrabold tabular-nums">
                  <LockedOdds odds={side.odds} />
                </span>
              </div>
            ))}
          </div>
          <Link
            href={`/beregn?id=${example.id}`}
            className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-muted-foreground transition hover:text-foreground"
          >
            {t('potentialProfit')}
            <span className="margin-pill ml-auto rounded-md px-2 py-0.5 text-[16px] font-extrabold tabular-nums text-success">
              +{formatPct(example.margin)}
            </span>
            <CircleHelp className="size-4 shrink-0" aria-label={t('profitHelp')} />
          </Link>
        </section>
      )}

      {latest.length > 0 && (
        <section className="sb-panel relative overflow-hidden">
          <h2 className="px-5 pb-2 pt-4 text-[15px] font-bold">{t('latestFinds')}</h2>
          <ul className="divide-y divide-border border-t border-border">
            {latest.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/beregn?id=${o.id}`}
                  className="flex min-h-11 items-center gap-2.5 px-5 py-2 text-[12.5px] transition-colors hover:bg-surface-elevated/50"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold">
                    {o.homeTeam} – {o.awayTeam}
                  </span>
                  <span className="margin-pill rounded-md px-1.5 py-0.5 font-extrabold tabular-nums text-success">+{formatPct(o.margin)}</span>
                  <span className="w-10 text-right tabular-nums text-muted-foreground">{timeFormat.format(o.kickoffTs)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  )
}
