'use client'

import useSWR from 'swr'
import { ExternalLink } from 'lucide-react'
import { getBookmaker } from '@/lib/bookmakers'
import { formatInt } from '@/lib/odds'
import { useLocale } from '@/components/locale-provider'

// Alle bookmakere sender til forsiden indtil direkte kamp-links er klar. Sæt til true for at aktivere opslaget igen.
const EXACT_MATCH_LINKS_ENABLED = false

type MatchLink = { url: string; exact: boolean }

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? (r.json() as Promise<MatchLink>) : null))

function fallbackLink(bookmaker: string): MatchLink {
  const brand = getBookmaker(bookmaker)
  const plainAffiliate = brand.affiliate && !brand.affiliate.includes('{url}') ? brand.affiliate : null
  return { url: plainAffiliate ?? brand.url, exact: false }
}

export function GoToBookmaker({
  bookmaker,
  label,
  homeTeam,
  awayTeam,
  kickoffTs,
  sport,
  league,
  country,
  amount,
  handedOff,
  onHandOff,
}: {
  bookmaker: string
  label: string
  homeTeam: string
  awayTeam: string
  kickoffTs: number
  sport: string
  league: string
  country: string
  amount: number
  handedOff: boolean
  onHandOff: () => void
}) {
  const { t } = useLocale()
  const params = new URLSearchParams({ bookmaker, home: homeTeam, away: awayTeam, kickoff: String(kickoffTs), sport, league, country })
  const { data } = useSWR(EXACT_MATCH_LINKS_ENABLED ? `/api/match-link?${params}` : null, fetcher, { revalidateOnFocus: false })
  const link = data ?? fallbackLink(bookmaker)

  return (
    <>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={onHandOff}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-2 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-[#2a85ff]"
      >
        {link.exact ? t('gotoMatch') : t('gotoBookmaker')}
        <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t('opensInNewTab', { name: bookmaker })}</span>
      </a>
      <p aria-live="polite" className="min-h-[2.5em] text-pretty text-center text-[12px] leading-snug text-[#a9b6d3]">
        {handedOff ? (
          <>
            <span className="font-semibold text-success">{t('copiedAmount', { amount: formatInt(amount) })}</span>{' '}
            {link.exact ? (
              t('pickAndPaste', { label })
            ) : (
              <>
                {t('searchBefore')}
                <span className="font-semibold text-foreground">{homeTeam}</span>
                {t('searchAfter', { label })}
              </>
            )}
          </>
        ) : (
          t('stakeAutoCopied')
        )}
      </p>
    </>
  )
}
