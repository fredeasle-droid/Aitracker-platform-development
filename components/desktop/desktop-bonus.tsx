'use client'

import { ArrowRight, Gift, RefreshCw, ShieldCheck } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { type BonusOffer } from '@/lib/bonus-offers'
import { useLocale } from '@/components/locale-provider'

const TRUST = [
  { icon: Gift, title: 'trustBestTitle', detail: 'trustBestDetail' },
  { icon: RefreshCw, title: 'trustFreshTitle', detail: 'trustFreshDetail' },
  { icon: ShieldCheck, title: 'trustSafeTitle', detail: 'trustSafeDetail' },
] as const

export function DesktopBonus({ offers }: { offers: readonly BonusOffer[] }) {
  const { t } = useLocale()

  return (
    <section aria-labelledby="bonus-title" className="hidden min-w-0 flex-1 lg:block">
      <header className="flex items-center justify-between gap-6 rounded-2xl border border-[#183252] bg-[#050f1f] px-5 py-4">
        <div className="min-w-0">
          <h1 id="bonus-title" className="text-balance text-[34px] font-extrabold leading-tight tracking-tight">{t('bonusDeskTitle')}</h1>
          <p className="mt-1 text-pretty text-[14px] leading-relaxed text-[#c3cde2]">{t('bonusDeskText')}</p>
        </div>
        <ul className="hidden shrink-0 items-center gap-5 rounded-xl border border-[#183252] bg-[#071428] px-5 py-3 2xl:flex">
          {TRUST.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-2.5">
              <Icon className="size-7 shrink-0 text-[#2ee6a6]" strokeWidth={1.6} aria-hidden="true" />
              <span className="flex flex-col"><span className="text-[12px] font-semibold leading-tight">{t(title)}</span><span className="text-[11px] leading-tight text-[#9fb0cc]">{t(detail)}</span></span>
            </li>
          ))}
        </ul>
      </header>

      <ul className="mt-4 flex flex-col gap-2.5" aria-label={t('bonusListAria')}>
        {offers.map((offer) => (
          <li key={offer.bookmaker}>
            <article className="rounded-2xl border border-[#183252] bg-[#050f1f] p-4">
              <div className="flex items-center gap-4">
                <BookmakerLogo name={offer.bookmaker} className="size-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[20px] font-extrabold leading-tight">{offer.bookmaker}</h2>
                  {offer.status === 'reported' ? <p className="mt-1 text-[16px] font-semibold text-[#5cb8ff]">{offer.title}</p> : <p className="mt-1 text-[13px] text-[#9fb0cc]">{offer.status === 'restricted' ? t('noBonuses') : t('readMore')}</p>}
                </div>
                <a href={offer.url} target="_blank" rel="noopener noreferrer sponsored" className="flex min-h-12 w-[152px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2ee6a6] px-3 text-[14px] font-bold text-[#03141c] transition-colors hover:bg-[#54f0ba]">
                  {t('getBonus')} <ArrowRight className="size-4" aria-hidden="true" /><span className="sr-only"> {t('atBookmakerNewWindow', { name: offer.bookmaker })}</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] leading-relaxed text-[#8298b2]">{t('responsible')}</p>
    </section>
  )
}
