export const BONUS_CATEGORIES = ['Velkomstbonus', 'Free spins', 'Cashback', 'Loyalitet', 'Eksklusivt'] as const

export type BonusCategory = (typeof BONUS_CATEGORIES)[number]

export type BonusOffer = {
  bookmaker: string
  title: string
  highlights: readonly string[]
  tags: readonly BonusCategory[]
  terms: readonly string[]
}

export const BONUS_OFFERS: readonly BonusOffer[] = [
  {
    bookmaker: 'Unibet',
    title: '100% op til 1.000 kr.',
    highlights: ['100% bonus op til 1.000 kr.', 'Hurtig udbetaling', 'Stort udvalg af sportsgrene'],
    tags: ['Velkomstbonus', 'Eksklusivt'],
    terms: ['Kun for nye kunder', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', 'Bonus skal aktiveres manuelt'],
  },
  {
    bookmaker: 'Betsson',
    title: '100% op til 1.000 kr.',
    highlights: ['100% bonus op til 1.000 kr.', 'Live betting', 'Casino og live casino'],
    tags: ['Velkomstbonus', 'Cashback'],
    terms: ['Kun for nye kunder', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', 'Kampagnen skal aktiveres'],
  },
  {
    bookmaker: 'LeoVegas',
    title: '200 Free Spins',
    highlights: ['200 free spins på udvalgte spil', 'Stort casinoudvalg', 'Hurtige udbetalinger'],
    tags: ['Free spins', 'Eksklusivt'],
    terms: ['Kun for nye kunder', 'Indbetal min. 100 kr.', 'Free spins udløber efter 7 dage', 'Kampagnevilkår gælder'],
  },
  {
    bookmaker: 'Casumo',
    title: '100% op til 1.000 kr.',
    highlights: ['100% bonus op til 1.000 kr.', 'Unikke spiloplevelser', 'Ingen gebyrer'],
    tags: ['Velkomstbonus', 'Loyalitet'],
    terms: ['Gælder første indbetaling', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', 'Loyalitetsprogram for faste kunder'],
  },
  {
    bookmaker: 'NordicBet',
    title: '100% op til 1.000 kr.',
    highlights: ['100% bonus op til 1.000 kr.', 'Fokus på sport', 'Cash out'],
    tags: ['Velkomstbonus', 'Eksklusivt'],
    terms: ['Gælder første indbetaling', 'Indbetal min. 100 kr.', 'Omsætning 3x bonus', 'Odds 1.80 eller højere'],
  },
  {
    bookmaker: 'Betano',
    title: '100% op til 1.000 kr.',
    highlights: ['100% bonus op til 1.000 kr.', 'Live betting', 'Stort udvalg af markeder'],
    tags: ['Velkomstbonus', 'Cashback'],
    terms: ['Gælder første indbetaling', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', 'Odds 1.80 eller højere'],
  },
  {
    bookmaker: 'Bet365',
    title: '100% op til 1.000 kr.',
    highlights: ['100% bonus op til 1.000 kr.', 'Streaming af udvalgte kampe', 'Bet builder'],
    tags: ['Velkomstbonus'],
    terms: ['Velkomstbonus til nye kunder', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', '7 dage til at aktivere bonus'],
  },
  {
    bookmaker: 'Danske Spil',
    title: 'Bonus op til 1.000 kr.',
    highlights: ['Dansk favorit', 'Odds på dansk og international sport', 'Trygt og velkendt'],
    tags: ['Velkomstbonus', 'Loyalitet'],
    terms: ['Gælder første indbetaling', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', 'Kun for nye kunder'],
  },
  {
    bookmaker: 'Expekt',
    title: '50% op til 500 kr.',
    highlights: ['50% bonus op til 500 kr.', 'Sportsfokus', 'Mulighed for cashback'],
    tags: ['Velkomstbonus', 'Cashback'],
    terms: ['Velkomstbonus til nye kunder', 'Indbetal min. 100 kr.', 'Omsætning 5x bonus', 'Minimum odds gælder'],
  },
] as const
