import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Clock3, Gift, Info, ShieldCheck, Sparkles } from 'lucide-react'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Bonusser – BetTracker',
  description: 'Sammenlign velkomstbonusser og kampagner hos danske bookmakere.',
}

const offers = [
  { bookmaker: 'Danske Spil', badge: 'Dansk favorit', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', 'Gælder første indbetaling'], accent: 'blue' },
  { bookmaker: 'Bet365', badge: 'Mest populær', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', '7 dage til at aktivere bonus'], accent: 'blue' },
  { bookmaker: 'Unibet', badge: 'Ny kampagne', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Bonus skal aktiveres manuelt'], accent: 'green' },
  { bookmaker: 'Betinia', badge: 'Populær', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Gælder første indbetaling', 'Odds 1.80 eller højere'], accent: 'violet' },
  { bookmaker: 'Betsson', badge: 'God til sport', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Kampagnen skal aktiveres'], accent: 'blue' },
  { bookmaker: 'NordicBet', badge: 'God til sport', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 3x bonus', terms: ['Gælder første indbetaling', 'Odds 1.80 eller højere'], accent: 'violet' },
  { bookmaker: 'Bet25', badge: 'Dansk bookmaker', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', 'Udvalgte sportsgrene'], accent: 'green' },
  { bookmaker: 'ComeOn', badge: 'Eksklusivt tilbud', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 6x bonus', terms: ['Kun for nye kunder', 'Kampagnen gælder i en begrænset periode'], accent: 'violet' },
  { bookmaker: 'Betfair', badge: 'Spilbørs', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Gælder første indbetaling', 'Særlige odds- og markedsvilkår'], accent: 'green' },
  { bookmaker: 'Bwin', badge: 'Populær', amount: '750 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', 'Minimum odds gælder'], accent: 'blue' },
  { bookmaker: 'LeoVegas', badge: 'Ny kampagne', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Bonus skal aktiveres manuelt'], accent: 'violet' },
  { bookmaker: 'Mr Green', badge: 'Eksklusivt tilbud', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Gælder første indbetaling', 'Kampagnevilkår gælder'], accent: 'green' },
  { bookmaker: 'Expekt', badge: 'God til sport', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', 'Minimum odds gælder'], accent: 'blue' },
  { bookmaker: 'VBet', badge: 'Ny kampagne', amount: '750 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Udvalgte markeder er undtaget'], accent: 'violet' },
  { bookmaker: 'Betano', badge: 'Mest populær', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Gælder første indbetaling', 'Odds 1.80 eller højere'], accent: 'blue' },
  { bookmaker: '888sport', badge: 'Eksklusivt tilbud', amount: '750 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 6x bonus', terms: ['Velkomstbonus til nye kunder', 'Kampagnen skal aktiveres'], accent: 'green' },
  { bookmaker: 'Betway', badge: 'God til sport', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Minimum odds gælder'], accent: 'violet' },
  { bookmaker: 'Marathonbet', badge: 'Høj værdi', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Gælder første indbetaling', 'Udvalgte markeder er undtaget'], accent: 'blue' },
  { bookmaker: 'Cashpoint', badge: 'Populær', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', 'Kampagnevilkår gælder'], accent: 'green' },
  { bookmaker: 'Tipwin', badge: 'God til sport', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Bonus skal aktiveres manuelt'], accent: 'violet' },
  { bookmaker: 'Betstars', badge: 'Eksklusivt tilbud', amount: '750 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Gælder første indbetaling', 'Minimum odds gælder'], accent: 'blue' },
  { bookmaker: 'Betsafe', badge: 'Mest populær', amount: '1.000 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Velkomstbonus til nye kunder', '7 dage til at aktivere bonus'], accent: 'green' },
  { bookmaker: 'Campobet', badge: 'Ny kampagne', amount: '500 kr.', requirement: 'Indbetal min. 100 kr.', wagering: 'Omsætning 5x bonus', terms: ['Kun for nye kunder', 'Kampagnen skal aktiveres'], accent: 'violet' },
] as const

export default function BonusPage() {
  return (
    <main>
      <SiteHeader />
      <section className="relative overflow-hidden px-4 pb-5 pt-3">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#1682ff]/15 blur-3xl" />
        <div className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#54b8ff]"><Gift className="size-4" /> Eksklusive tilbud</div>
        <h1 className="mt-3 text-[31px] font-black leading-[1.05] tracking-[-0.04em]">Få mere ud af dine bets</h1>
        <p className="mt-3 max-w-md text-[16px] leading-6 text-[#aebed4]">Sammenlign aktuelle velkomstbonusser hos populære bookmakere – samlet ét sted.</p>
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#1b4164] bg-[#091b2d] px-3 py-3 text-[12px] text-[#c9d8e8]"><ShieldCheck className="size-5 shrink-0 text-[#2ee6a6]" /><span>Vi viser altid vilkår og omsætningskrav tydeligt.</span></div>
      </section>

      <section className="space-y-3 px-4" aria-label="Aktuelle bookmaker bonusser">
        {offers.map((offer) => (
          <article key={offer.bookmaker} className="overflow-hidden rounded-2xl border border-[#1a3653] bg-[linear-gradient(145deg,#0b1d30,#071321)] shadow-[0_12px_30px_-24px_#1682ff]">
            <div className="flex items-start gap-3 p-4 pb-3">
              <BookmakerLogo name={offer.bookmaker} className="size-12" />
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-[17px] font-extrabold">{offer.bookmaker}</h2><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${offer.accent === 'green' ? 'bg-[#123a32] text-[#54e6ae]' : offer.accent === 'violet' ? 'bg-[#30214d] text-[#c89bff]' : 'bg-[#123b61] text-[#70c2ff]'}`}>{offer.badge}</span></div><p className="mt-1 text-[12px] text-[#8ea8c3]">Velkomstbonus til nye kunder</p></div>
              <Sparkles className="size-5 shrink-0 text-[#ffd34e]" />
            </div>
            <div className="mx-4 rounded-xl border border-[#214b70] bg-[#0b243d] p-3"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7e9cba]">Bonus op til</p><p className="mt-1 text-[28px] font-black text-white">{offer.amount}</p><p className="mt-1 text-[12px] font-semibold text-[#ffd34e]">+ Gratis spil ved første indbetaling</p></div>
            <dl className="grid grid-cols-2 gap-2 px-4 py-4"><div className="rounded-xl bg-[#0a1726] p-3"><dt className="text-[10px] font-bold uppercase tracking-wide text-[#7893ad]">Krav til indbetaling</dt><dd className="mt-1 text-[12px] font-semibold text-[#e0eaf5]">{offer.requirement}</dd></div><div className="rounded-xl bg-[#0a1726] p-3"><dt className="text-[10px] font-bold uppercase tracking-wide text-[#7893ad]">Omsætningskrav</dt><dd className="mt-1 text-[12px] font-semibold text-[#e0eaf5]">{offer.wagering}</dd></div></dl>
            <div className="space-y-2 px-4 pb-4 text-[12px] text-[#b5c7da]">{offer.terms.map((term) => <p key={term} className="flex items-center gap-2"><Check className="size-4 text-[#2ee6a6]" /> {term}</p>)}</div>
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3"><span className="flex items-center gap-1.5 text-[11px] text-[#7893ad]"><Clock3 className="size-3.5" /> Opdateret i dag</span><Link href="#claim" className="flex min-h-11 items-center gap-2 rounded-xl bg-[#1682ff] px-4 text-[13px] font-bold text-white shadow-[0_8px_20px_-10px_#1682ff]">Hent bonus <ArrowRight className="size-4" /></Link></div>
          </article>
        ))}
      </section>
      <p id="claim" className="mx-4 mt-5 flex items-start gap-2 rounded-xl border border-[#1a2846] bg-[#081322] p-3 text-[11px] leading-4 text-[#8298b2]"><Info className="mt-0.5 size-4 shrink-0 text-[#54b8ff]" />Spil ansvarligt. Bonusser er underlagt bookmakerens fulde vilkår. 18+.</p>
    </main>
  )
}
