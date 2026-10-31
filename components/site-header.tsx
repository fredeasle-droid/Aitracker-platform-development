import Link from 'next/link'
import { Bell } from 'lucide-react'
import { BrandMark } from '@/components/icons'
import { LiveOddsPill } from '@/components/live-odds-pill'
import { LOCALES } from '@/lib/i18n'
import { getServerT } from '@/lib/locale-server'

function updatedLabel(tag: string) {
  return new Intl.DateTimeFormat(tag, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' }).format(new Date())
}

export async function SiteHeader() {
  const { t, locale } = await getServerT()
  return (
    <header className="flex items-center justify-between gap-1 pb-3.5 pl-3 pr-1 pt-[calc(11px+env(safe-area-inset-top))] lg:hidden">
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={t('homeAria')}>
        <BrandMark showTrend={false} className="h-[25px] w-[28px] shrink-0" />
        <span className="flex flex-col">
          <span className="text-[25px] font-extrabold leading-none tracking-tight">
            Bet<span className="text-primary">Tracker</span>
          </span>
          <span className="mt-[7px] whitespace-nowrap text-[7.2px] font-semibold leading-none tracking-[0.04em] text-[#8fa3cc]">
            {t('tagline')}
          </span>
        </span>
      </Link>
      <div className="flex min-w-0 items-center">
        <LiveOddsPill updated={updatedLabel(LOCALES[locale].tag)} />
        <Link
          href="/konto"
          aria-label={t('notificationsAccountAria')}
          className="flex size-[37px] shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
