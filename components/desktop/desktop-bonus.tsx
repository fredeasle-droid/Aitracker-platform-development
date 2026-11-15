'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Crown,
  Gift,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Star,
  Undo2,
  type LucideIcon,
} from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { BONUS_CATEGORIES, BONUS_OFFERS, type BonusCategory, type BonusOffer } from '@/lib/bonus-offers'
import { getBookmaker } from '@/lib/bookmakers'
import { useLocale } from '@/components/locale-provider'
import { cn } from '@/lib/utils'

type Filter = 'Alle' | BonusCategory

const FILTER_ICONS: Record<BonusCategory, LucideIcon> = {
  Velkomstbonus: Gift,
  'Free spins': PlayCircle,
  Cashback: Undo2,
  Loyalitet: Crown,
  Eksklusivt: Star,
}

const TRUST = [
  { icon: Gift, title: 'trustBestTitle', detail: 'trustBestDetail' },
  { icon: RefreshCw, title: 'trustFreshTitle', detail: 'trustFreshDetail' },
  { icon: ShieldCheck, title: 'trustSafeTitle', detail: 'trustSafeDetail' },
] as const

export function DesktopBonus() {
  const { t, tx } = useLocale()
  const [filter, setFilter] = useState<Filter>('Alle')
  const offers = filter === 'Alle' ? BONUS_OFFERS : BONUS_OFFERS.filter((offer) => offer.tags.includes(filter))

  return (
    <section aria-labelledby="bonus-title" className="hidden min-w-0 flex-1 lg:block">
      <header className="flex items-center justify-between gap-6 rounded-2xl border border-[#183252] bg-[#050f1f] px-5 py-4">
        <div className="min-w-0">
          <h1 id="bonus-title" className="text-balance text-[34px] font-extrabold leading-tight tracking-tight">
            {t('bonusDeskTitle')}
          </h1>
          <p className="mt-1 text-pretty text-[14px] leading-relaxed text-[#c3cde2]">
            {t('bonusDeskText')}
          </p>
        </div>
        <ul className="hidden shrink-0 items-center gap-5 rounded-xl border border-[#183252] bg-[#071428] px-5 py-3 2xl:flex">
          {TRUST.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-2.5">
              <Icon className="size-7 shrink-0 text-[#2ee6a6]" strokeWidth={1.6} aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-[12px] font-semibold leading-tight">{t(title)}</span>
                <span className="text-[11px] leading-tight text-[#9fb0cc]">{t(detail)}</span>
              </span>
            </li>
          ))}
        </ul>
      </header>

      <div role="group" aria-label={t('filterBonuses')} className="mt-4 flex flex-wrap items-center gap-3">
        <FilterButton active={filter === 'Alle'} onClick={() => setFilter('Alle')}>
          {t('all')}
        </FilterButton>
        {BONUS_CATEGORIES.map((category) => {
          const Icon = FILTER_ICONS[category]
          return (
            <FilterButton key={category} active={filter === category} onClick={() => setFilter(category)}>
              <Icon className="size-4" aria-hidden="true" />
              {tx(category)}
            </FilterButton>
          )
        })}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5" aria-label={t('bonusListAria')}>
        {offers.map((offer) => (
          <li key={offer.bookmaker}>
            <OfferRow offer={offer} />
          </li>
        ))}
        {offers.length === 0 && (
          <li className="rounded-2xl border border-[#183252] p-8 text-center text-[#9fb0cc]">
            {t('noBonuses')}
          </li>
        )}
      </ul>

      <p className="mt-4 text-[12px] leading-relaxed text-[#8298b2]">
        {t('responsible')}
      </p>
    </section>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex min-h-11 items-center gap-2 rounded-full border px-5 text-[14px] font-semibold transition-colors',
        active
          ? 'border-[#1682ff] bg-[#1682ff] text-white shadow-[0_8px_22px_-10px_#1682ff]'
          : 'border-[#183252] bg-[#071428] text-[#e0eaf5] hover:bg-[#0b1d39]',
      )}
    >
      {children}
    </button>
  )
}

function OfferRow({ offer }: { offer: BonusOffer }) {
  const { t, tx } = useLocale()
  const [open, setOpen] = useState(false)
  const brand = getBookmaker(offer.bookmaker)
  const panelId = `terms-${offer.bookmaker.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <article className="rounded-2xl border border-[#183252] bg-[#050f1f] p-3">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-[84px] w-[142px] shrink-0 items-center justify-center gap-3 overflow-hidden rounded-xl px-3 text-center font-black leading-none tracking-tight"
          style={{ background: brand.logo ? '#0b1a31' : brand.bg, color: brand.fg }}
        >
          {brand.logo ? (
            <BookmakerLogo name={offer.bookmaker} className="size-14 rounded-xl" />
          ) : (
            <span className="text-[22px] italic">{offer.bookmaker}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-[22px] font-extrabold leading-tight tracking-tight">
            <span className="sr-only">{offer.bookmaker}: </span>
            {tx(offer.title)}
          </h2>
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {offer.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-[#c3cde2]">
                <Check className="size-3.5 shrink-0 text-[#1682ff]" aria-hidden="true" />
                {tx(item)}
              </li>
            ))}
          </ul>
        </div>

        <ul className="hidden w-[200px] shrink-0 flex-wrap content-center gap-2 xl:flex" aria-label={t('categoriesAria')}>
          {offer.tags.map((tag) => (
            <li
              key={tag}
              className={cn(
                'rounded-full px-3 py-1.5 text-[12px] font-semibold',
                tag === 'Velkomstbonus' || tag === 'Free spins'
                  ? 'bg-[#0f2f52] text-[#5cb8ff]'
                  : tag === 'Eksklusivt'
                    ? 'bg-[#4a1fd1] text-white'
                    : 'bg-[#0b1d39] text-[#e0eaf5]',
              )}
            >
              {tx(tag)}
            </li>
          ))}
        </ul>

        <div className="hidden w-[110px] shrink-0 flex-col items-center gap-1.5 text-center xl:flex">
          <span className="text-[13px] font-semibold text-[#e0eaf5]">{t('highRating')}</span>
          <span className="flex gap-0.5" role="img" aria-label={t('fiveStars')}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-4 fill-[#2ee6a6] text-[#2ee6a6]" aria-hidden="true" />
            ))}
          </span>
        </div>

        <div className="flex w-[152px] shrink-0 flex-col items-center gap-2.5">
          <a
            href={brand.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2ee6a6] text-[15px] font-bold text-[#03141c] shadow-[0_8px_22px_-12px_#2ee6a6] transition-colors hover:bg-[#54f0ba]"
          >
            {t('getBonus')}
            <ArrowRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> {t('atBookmakerNewWindow', { name: offer.bookmaker })}</span>
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="min-h-6 text-[13px] text-[#e0eaf5] underline underline-offset-2 hover:text-white"
          >
            {open ? t('hideTerms') : t('readMore')}
          </button>
        </div>
      </div>

      {open && (
        <ul id={panelId} className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-[#183252] px-1 pt-3">
          {offer.terms.map((term) => (
            <li key={term} className="flex items-center gap-2 text-[13px] text-[#c3cde2]">
              <Check className="size-4 shrink-0 text-[#2ee6a6]" aria-hidden="true" />
              {tx(term)}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
