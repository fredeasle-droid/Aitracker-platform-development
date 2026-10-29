export type BookmakerBrand = {
  name: string
  url: string
  bg: string
  fg: string
  mark: string
  logo?: string
  inset?: boolean
  small?: boolean
  favicon?: boolean
}

type BrandSeed = Omit<BookmakerBrand, 'name' | 'bg' | 'fg' | 'mark' | 'favicon'> & {
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
  sportsbetio: { name: 'Sportsbet.io', url: 'https://sportsbet.io/sports', logo: '/bookmakers/sportsbet.png' },
  dbbet: { name: 'DBbet', url: 'https://dbbet.com' },
  shuffle: { name: 'Shuffle', url: 'https://shuffle.com/sports' },
  wildio: { name: 'Wild.io', url: 'https://wild.io/sports' },
  mystake: { name: 'MyStake', url: 'https://mystake.com' },
  vave: { name: 'Vave', url: 'https://vave.com/sportsbook' },
  '20bet': { name: '20bet', url: 'https://20bet.com/sport' },
  '22bet': { name: '22bet', url: 'https://22bet.com' },
  bcgame: { name: 'BC.Game', url: 'https://bc.game/sports' },
  bcbet: { name: 'BC.Game', url: 'https://bc.game/sports' },
  ggbet: { name: 'GGBet', url: 'https://gg.bet' },
  dafabet: { name: 'Dafabet', url: 'https://www.dafabet.com' },
  cloudbet: { name: 'Cloudbet', url: 'https://www.cloudbet.com/en/sports' },
  stake: { name: 'Stake', url: 'https://stake.com/sports/home' },
  roobet: { name: 'Roobet', url: 'https://roobet.com/sports' },
  rollbit: { name: 'Rollbit', url: 'https://rollbit.com/sports' },
  thunderpick: { name: 'Thunderpick', url: 'https://thunderpick.io' },
  betpanda: { name: 'Betpanda', url: 'https://betpanda.io/sports' },
  melbet: { name: 'Melbet', url: 'https://melbet.com' },
  betwinner: { name: 'Betwinner', url: 'https://betwinner.com' },
  parimatch: { name: 'Parimatch', url: 'https://parimatch.com' },
  coolbet: { name: 'Coolbet', url: 'https://www.coolbet.com' },
  betsafe: { name: 'Betsafe', url: 'https://www.betsafe.com' },
  superbet: { name: 'Superbet', url: 'https://superbet.com' },
  '1win': { name: '1win', url: 'https://1win.com' },
  mostbet: { name: 'Mostbet', url: 'https://mostbet.com' },
  megapari: { name: 'Megapari', url: 'https://megapari.com' },
  rabona: { name: 'Rabona', url: 'https://rabona.com' },
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function guessDomain(name: string) {
  const clean = name.trim().toLowerCase().replace(/\s+/g, '')
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(clean)) return clean
  const key = normalize(name)
  return key.length >= 3 ? `${key}.com` : null
}

const faviconLogo = (domain: string | null) => (domain ? `/api/bookmaker-logo?domain=${encodeURIComponent(domain)}` : undefined)

const SEED_KEYS_LONGEST_FIRST = Object.keys(SEEDS).sort((a, b) => b.length - a.length)

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function initials(name: string): string {
  return name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase()
}

export function getBookmaker(name: string): BookmakerBrand {
  const key = normalize(name)
  const matchedKey = SEEDS[key] ? key : SEED_KEYS_LONGEST_FIRST.find((k) => key.startsWith(k))
  const seed = matchedKey ? SEEDS[matchedKey] : undefined

  if (!seed) {
    const domain = guessDomain(name)
    return {
      name,
      url: domain ? `https://${domain}` : '#',
      logo: faviconLogo(domain),
      favicon: Boolean(domain),
      bg: NAVY,
      fg: WHITE,
      mark: initials(name),
    }
  }

  return {
    name,
    url: seed.url,
    logo: seed.logo ?? faviconLogo(hostOf(seed.url)),
    favicon: !seed.logo,
    inset: seed.inset,
    small: seed.small,
    bg: seed.bg ?? NAVY,
    fg: seed.fg ?? WHITE,
    mark: seed.mark ?? initials(name),
  }
}
