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
import { BONUS_CATEGORIES, BONUS_OFFERS, type BonusCategory, type BonusOffer } from '@/lib/bonus-offers'
import { getBookmaker } from '@/lib/bookmakers'
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
  { icon: Gift, title: 'Bedste bonusser', detail: 'Håndplukkede tilbud' },
  { icon: RefreshCw, title: 'Altid opdateret', detail: 'Nyeste kampagner' },
  { icon: ShieldCheck, title: 'Sikre og pålidelige', detail: 'Kun seriøse bookmakere' },
] as const

export function DesktopBonus() {
  const [filter, setFilter] = useState<Filter>('Alle')
  const offers = filter === 'Alle' ? BONUS_OFFERS : BONUS_OFFERS.filter((offer) => offer.tags.includes(filter))

  return (
    <section aria-labelledby="bonus-title" className="hidden min-w-0 flex-1 lg:block">
      <header className="flex items-center justify-between gap-6 rounded-2xl border border-[#183252] bg-[#050f1f] px-5 py-4">
        <div className="min-w-0">
          <h1 id="bonus-title" className="text-balance text-[34px] font-extrabold leading-tight tracking-tight">
            Bookmaker bonusser
          </h1>
          <p className="mt-1 text-pretty text-[14px] leading-relaxed text-[#c3cde2]">
            Sammenlign de bedste velkomstbonusser og få mest muligt ud af dine indsatser.
          </p>
        </div>
        <ul className="hidden shrink-0 items-center gap-5 rounded-xl border border-[#183252] bg-[#071428] px-5 py-3 2xl:flex">
          {TRUST.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-2.5">
              <Icon className="size-7 shrink-0 text-[#2ee6a6]" strokeWidth={1.6} aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-[12px] font-semibold leading-tight">{title}</span>
                <span className="text-[11px] leading-tight text-[#9fb0cc]">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </header>

      <div role="group" aria-label="Filtrér bonusser" className="mt-4 flex flex-wrap items-center gap-3">
        <FilterButton active={filter === 'Alle'} onClick={() => setFilter('Alle')}>
          Alle
        </FilterButton>
        {BONUS_CATEGORIES.map((category) => {
          const Icon = FILTER_ICONS[category]
          return (
            <FilterButton key={category} active={filter === category} onClick={() => setFilter(category)}>
              <Icon className="size-4" aria-hidden="true" />
              {category}
            </FilterButton>
          )
        })}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5" aria-label="Aktuelle bookmaker bonusser">
        {offers.map((offer) => (
          <li key={offer.bookmaker}>
            <OfferRow offer={offer} />
          </li>
        ))}
        {offers.length === 0 && (
          <li className="rounded-2xl border border-[#183252] p-8 text-center text-[#9fb0cc]">
            Ingen bonusser i denne kategori lige nu.
          </li>
        )}
      </ul>

      <p className="mt-4 text-[12px] leading-relaxed text-[#8298b2]">
        Spil ansvarligt. Bonusser er underlagt bookmakerens fulde vilkår. 18+.
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
  const [open, setOpen] = useState(false)
  const brand = getBookmaker(offer.bookmaker)
  const panelId = `terms-${offer.bookmaker.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <article className="rounded-2xl border border-[#183252] bg-[#050f1f] p-3">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-[84px] w-[142px] shrink-0 items-center justify-center overflow-hidden rounded-xl px-2 text-center text-[22px] font-black italic leading-none tracking-tight"
          style={{ background: brand.bg, color: brand.fg }}
        >
          {offer.bookmaker}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-[22px] font-extrabold leading-tight tracking-tight">
            <span className="sr-only">{offer.bookmaker}: </span>
            {offer.title}
          </h2>
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {offer.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-[#c3cde2]">
                <Check className="size-3.5 shrink-0 text-[#1682ff]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ul className="hidden w-[200px] shrink-0 flex-wrap content-center gap-2 xl:flex" aria-label="Kategorier">
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
              {tag}
            </li>
          ))}
        </ul>

        <div className="hidden w-[110px] shrink-0 flex-col items-center gap-1.5 text-center xl:flex">
          <span className="text-[13px] font-semibold text-[#e0eaf5]">Høj rating</span>
          <span className="flex gap-0.5" role="img" aria-label="5 ud af 5 stjerner">
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
            Få bonus
            <ArrowRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> hos {offer.bookmaker} (åbner i nyt vindue)</span>
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="min-h-6 text-[13px] text-[#e0eaf5] underline underline-offset-2 hover:text-white"
          >
            {open ? 'Skjul vilkår' : 'Læs mere'}
          </button>
        </div>
      </div>

      {open && (
        <ul id={panelId} className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-[#183252] px-1 pt-3">
          {offer.terms.map((term) => (
            <li key={term} className="flex items-center gap-2 text-[13px] text-[#c3cde2]">
              <Check className="size-4 shrink-0 text-[#2ee6a6]" aria-hidden="true" />
              {term}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
