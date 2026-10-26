export type BookmakerBrand = {
  name: string
  url: string
  bg: string
  fg: string
  mark: string
  accent?: string
  style?: 'ring' | 'text' | 'dice'
}

const BRANDS: Record<string, BookmakerBrand> = {
  Bet365: { name: 'Bet365', url: 'https://www.bet365.dk', bg: '#126e51', fg: '#ffffff', accent: '#ffdf1b', mark: 'Bet365', style: 'text' },
  NordicBet: { name: 'NordicBet', url: 'https://www.nordicbet.dk', bg: '#0b6cf5', fg: '#ffffff', mark: '', style: 'ring' },
  Unibet: { name: 'Unibet', url: 'https://www.unibet.dk', bg: '#147b45', fg: '#ffffff', mark: 'U' },
  Expekt: { name: 'Expekt', url: 'https://www.expekt.dk', bg: '#ff5b0a', fg: '#ffffff', mark: 'ex' },
  LeoVegas: { name: 'LeoVegas', url: 'https://www.leovegas.dk', bg: '#f6e3cf', fg: '#c2410c', mark: 'LV' },
  Betsson: { name: 'Betsson', url: 'https://www.betsson.dk', bg: '#ff6a13', fg: '#ffffff', mark: 'b' },
  Betano: { name: 'Betano', url: 'https://www.betano.dk', bg: '#ff4f00', fg: '#ffffff', mark: 'B' },
  'Danske Spil': { name: 'Danske Spil', url: 'https://danskespil.dk/oddset', bg: '#ffd100', fg: '#d62a1e', mark: '', style: 'dice' },
}

export function getBookmaker(name: string): BookmakerBrand {
  return (
    BRANDS[name] ?? {
      name,
      url: '#',
      bg: '#1e2a44',
      fg: '#ffffff',
      mark: name.slice(0, 2).toUpperCase(),
    }
  )
}
