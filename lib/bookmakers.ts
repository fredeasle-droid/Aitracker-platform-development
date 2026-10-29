export type BookmakerBrand = {
  name: string
  url: string
  bg: string
  fg: string
  mark: string
  logo?: string
  inset?: boolean
  small?: boolean
}

type BrandSeed = Omit<BookmakerBrand, 'name' | 'bg' | 'fg' | 'mark'> & {
  name: string
  bg?: string
  fg?: string
  mark?: string
}

const WHITE = '#ffffff'
const NAVY = '#1e2a44'

const SEEDS: Record<string, BrandSeed> = {
  bet365: { name: 'Bet365', url: 'https://www.bet365.dk', logo: '/bookmakers/bet365.png' },
  nordicbet: { name: 'NordicBet', url: 'https://www.nordicbet.dk', logo: '/bookmakers/nordicbet.png' },
  unibet: { name: 'Unibet', url: 'https://www.unibet.dk', logo: '/bookmakers/unibet.png', bg: WHITE },
  expekt: { name: 'Expekt', url: 'https://www.expekt.dk', logo: '/bookmakers/expekt.png' },
  leovegas: { name: 'LeoVegas', url: 'https://www.leovegas.dk', logo: '/bookmakers/leovegas.png', bg: 'transparent' },
  betsson: { name: 'Betsson', url: 'https://www.betsson.dk', logo: '/bookmakers/betsson.png', bg: 'transparent' },
  betano: { name: 'Betano', url: 'https://www.betano.dk', logo: '/bookmakers/betano.png' },
  casumo: { name: 'Casumo', url: 'https://www.casumo.dk', logo: '/bookmakers/casumo.png' },
  danskespil: { name: 'Danske Spil', url: 'https://danskespil.dk/oddset', logo: '/bookmakers/oddset.png' },
  oddset: { name: 'Oddset', url: 'https://danskespil.dk/oddset', logo: '/bookmakers/oddset.png' },
  betinia: { name: 'Betinia', url: 'https://www.betinia.dk', logo: '/bookmakers/betinia.png' },
  marathonbet: { name: 'Marathonbet', url: 'https://www.marathonbet.com', logo: '/bookmakers/marathonbet.png' },
  pinnacle: { name: 'Pinnacle', url: 'https://www.pinnacle.com', logo: '/bookmakers/pinnacle.png' },
  paddypower: { name: 'Paddy Power', url: 'https://www.paddypower.com', logo: '/bookmakers/paddypower.png' },
  betfair: { name: 'Betfair', url: 'https://www.betfair.com', logo: '/bookmakers/betfair.svg', bg: '#14151a', inset: true },
  pokerstars: { name: 'PokerStars', url: 'https://www.pokerstars.dk', logo: '/bookmakers/pokerstars.png' },
  sportsbet: { name: 'Sportsbet', url: 'https://www.sportsbet.com.au', logo: '/bookmakers/sportsbet.png' },
  vbet: { name: 'Vbet', url: 'https://www.vbet.com', logo: '/bookmakers/vbet.png' },
  '888sport': { name: '888sport', url: 'https://www.888sport.dk', logo: '/bookmakers/888sport.png' },
  bwin: { name: 'bwin', url: 'https://www.bwin.com', logo: '/bookmakers/bwin.png' },
  betway: { name: 'Betway', url: 'https://www.betway.dk', logo: '/bookmakers/betway.png' },
  williamhill: { name: 'William Hill', url: 'https://www.williamhill.com', logo: '/bookmakers/williamhill.png' },
  ladbrokes: { name: 'Ladbrokes', url: 'https://www.ladbrokes.com', logo: '/bookmakers/ladbrokes.png' },
  betvictor: { name: 'BetVictor', url: 'https://www.betvictor.com', logo: '/bookmakers/betvictor.png' },
  betclic: { name: 'Betclic', url: 'https://www.betclic.com', logo: '/bookmakers/betclic.png' },
  comeon: { name: 'ComeOn', url: 'https://www.comeon.com', logo: '/bookmakers/comeon.png' },
  mrgreen: { name: 'Mr Green', url: 'https://www.mrgreen.dk', logo: '/bookmakers/mrgreen.png' },
  spilnu: { name: 'Spilnu', url: 'https://www.spilnu.dk', logo: '/bookmakers/spilnu.png' },
  kambi: { name: 'Kambi', url: 'https://www.kambi.com', logo: '/bookmakers/kambi.png' },
  '1xbet': { name: '1xBet', url: 'https://1xbet.com', logo: '/bookmakers/1xbet.png' },
  campobet: { name: 'Campobet', url: 'https://www.campobet.com', logo: '/bookmakers/campobet.png' },
  tonybet: { name: 'TonyBet', url: 'https://www.tonybet.com', logo: '/bookmakers/tonybet.png' },
  skybet: { name: 'Sky Bet', url: 'https://www.skybet.com', logo: '/bookmakers/skybet.png' },
  '18bet': { name: '18bet', url: 'https://www.18bet.com', logo: '/bookmakers/18bet.png' },
  bet9ja: { name: 'Bet9ja', url: 'https://www.bet9ja.com', logo: '/bookmakers/bet9ja.png', small: true },
}

const SEED_KEYS_LONGEST_FIRST = Object.keys(SEEDS).sort((a, b) => b.length - a.length)

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function initials(name: string): string {
  return name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase()
}

export function isKnownBookmaker(name: string): boolean {
  const key = normalize(name)
  return Boolean(SEEDS[key]) || SEED_KEYS_LONGEST_FIRST.some((k) => key.startsWith(k))
}

export function getBookmaker(name: string): BookmakerBrand {
  const key = normalize(name)
  const matchedKey = SEEDS[key] ? key : SEED_KEYS_LONGEST_FIRST.find((k) => key.startsWith(k))
  const seed = matchedKey ? SEEDS[matchedKey] : undefined

  if (!seed) {
    return { name, url: '#', bg: NAVY, fg: WHITE, mark: initials(name) }
  }

  return {
    name,
    url: seed.url,
    logo: seed.logo,
    inset: seed.inset,
    small: seed.small,
    bg: seed.bg ?? NAVY,
    fg: seed.fg ?? WHITE,
    mark: seed.mark ?? initials(name),
  }
}
