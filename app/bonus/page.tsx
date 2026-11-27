import type { Metadata } from 'next'
import { ArrowRight, Gift, Info, ShieldCheck } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { DesktopAside } from '@/components/desktop/desktop-aside'
import { DesktopBonus } from '@/components/desktop/desktop-bonus'
import { getOpportunities } from '@/lib/data'
import { getServerLocale, getServerT } from '@/lib/locale-server'
import { getBonusOffers } from '@/lib/bonus-offers'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT()
  return { title: t('bonusMetaTitle'), description: t('bonusMetaDesc'), alternates: { canonical: '/bonus' } }
}

export default async function BonusPage() {
  const [opportunities, locale, { t }] = await Promise.all([getOpportunities(), getServerLocale(), getServerT()])
  const offers = getBonusOffers(locale)

  return (
    <main className="lg:min-h-dvh">
      <div className="hidden w-full gap-4 px-4 lg:flex lg:items-start lg:pb-6 lg:pt-4">
        <DesktopBonus offers={offers} />
        <DesktopAside opportunities={opportunities} />
      </div>
      <div className="lg:hidden">
        <section className="relative overflow-hidden px-4 pb-5 pt-3">
          <div className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#54b8ff]"><Gift className="size-4" /> {t('exclusiveOffers')}</div>
          <h1 className="mt-3 text-[31px] font-black leading-[1.05] tracking-[-0.04em]">{t('bonusHeroTitle')}</h1>
          <p className="mt-3 max-w-md text-[16px] leading-6 text-[#aebed4]">{t('bonusHeroText')}</p>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#1b4164] bg-[#091b2d] px-3 py-3 text-[12px] text-[#c9d8e8]"><ShieldCheck className="size-5 shrink-0 text-[#2ee6a6]" /><span>{t('bonusTermsClear')}</span></div>
        </section>

        <section className="flex flex-col gap-3 px-4" aria-label={t('bonusListAria')}>
          {offers.map((offer) => (
            <article key={offer.bookmaker} className="overflow-hidden rounded-2xl border border-[#1a3653] bg-[linear-gradient(145deg,#0b1d30,#071321)] shadow-[0_12px_30px_-24px_#1682ff]">
              <div className="flex items-start gap-3 p-4 pb-3">
                <BookmakerLogo name={offer.bookmaker} className="size-12" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-extrabold">{offer.bookmaker}</h2>
                  {offer.status === 'reported' ? <p className="mt-1 text-[15px] font-semibold text-[#70c2ff]">{offer.title}</p> : <p className="mt-1 text-[13px] text-[#9fb0cc]">{offer.status === 'restricted' ? t('noBonuses') : t('readMore')}</p>}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                {offer.status === 'restricted' && <span className="text-[11px] leading-4 text-[#9fb0cc]">{t('noBonuses')}</span>}
                <a href={offer.url} target="_blank" rel="noopener noreferrer sponsored" className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#1682ff] px-4 text-[13px] font-bold text-white shadow-[0_8px_20px_-10px_#1682ff]">
                  {t('getBonusMobile')} <ArrowRight className="size-4" />
                  <span className="sr-only"> {t('atBookmakerNewWindow', { name: offer.bookmaker })}</span>
                </a>
              </div>
            </article>
          ))}
        </section>
        <p className="mx-4 mt-5 flex items-start gap-2 rounded-xl border border-[#1a2846] bg-[#081322] p-3 text-[11px] leading-4 text-[#8298b2]"><Info className="mt-0.5 size-4 shrink-0 text-[#54b8ff]" />{t('responsible')}</p>
      </div>
    </main>
  )
}
