const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

const ALLOWED = new Set(
  [
    'marathonbet',
    'campobet',
    'bet365',
    'unibet',
    'bc-game',
    'bcbet',
    'ggbet',
    'betinia',
    'pinnacle',
    'bet9ja',
    'vbet',
    'dafabet',
  ].map(normalize),
)

export const isAllowedBookmaker = (name: string) => ALLOWED.has(normalize(name))
