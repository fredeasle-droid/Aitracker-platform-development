/** The bookmakers shown under "Lokale bookmakere". This is the single list that decides what counts as local. */
export const LOCAL_BOOKMAKERS: { id: string; name: string }[] = [
  { id: 'bet365', name: 'Bet365' },
  { id: 'danskespil', name: 'Danske Spil' },
  { id: 'betano', name: 'Betano' },
  { id: 'betfair', name: 'Betfair' },
  { id: 'betinia', name: 'Betinia' },
  { id: 'campobet', name: 'CampoBet' },
  { id: 'betsson', name: 'Betsson' },
  { id: 'nordicbet', name: 'NordicBet' },
  { id: 'unibet', name: 'Unibet' },
  { id: '888sport', name: '888sport' },
  { id: 'bwin', name: 'Bwin' },
  { id: 'comeon', name: 'ComeOn' },
  { id: 'bet25', name: 'Bet25' },
  { id: 'betmaster', name: 'Betmaster' },
  { id: 'expekt', name: 'Expekt' },
  { id: 'leovegas', name: 'LeoVegas' },
  { id: 'marathonbet', name: 'Marathonbet' },
  { id: 'mrgreen', name: 'Mr Green' },
  { id: 'pokerstars', name: 'PokerStars Sports' },
  { id: 'tipwin', name: 'Tipwin' },
  { id: 'stake', name: 'Stake' },
  { id: 'getlucky', name: 'GetLucky' },
  { id: 'swiper', name: 'Swiper' },
  { id: 'vbet', name: 'Vbet' },
]

export const LOCAL_IDS = new Set(LOCAL_BOOKMAKERS.map((b) => b.id))

/** The same bookmaker under another name in the scans. */
const ALIASES: Record<string, string> = { oddset: 'danskespil', pokerstarssports: 'pokerstars' }

/** Bet Hero suffixes the licence country, e.g. "bwin (DK)"; it is the same bookmaker as "bwin". */
const rawKey = (name: string) =>
  name
    .replace(/\s*\([^)]*\)\s*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

export const bookmakerKey = (name: string) => {
  const key = rawKey(name)
  return ALIASES[key] ?? key
}

export const isLocalBookmaker = (name: string) => LOCAL_IDS.has(bookmakerKey(name))

/** The limited list: the local bookmakers plus the other books from the original whitelist. Nothing outside it is stored or shown. */
export const APPROVED_IDS = new Set([
  ...LOCAL_IDS,
  'dbbet', 'rainbet', 'mystake', '20', '20bet', 'vave', 'wildio', 'cloudbet', 'shuffle', 'sportsbetio', 'betfairexchange',
])

export const isApprovedBookmaker = (name: string) => APPROVED_IDS.has(bookmakerKey(name))
