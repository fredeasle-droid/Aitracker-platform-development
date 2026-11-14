import 'server-only'

export const ODDSJAM_SOURCE = 'oddsjam'
export const ODDSJAM_ARBITRAGE_URL = 'https://oddsjam.com/betting-tools/arbitrage'

export async function inspectOddsJamPage(cookie: string) {
  const response = await fetch(ODDSJAM_ARBITRAGE_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      Cookie: cookie,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  })
  const html = await response.text()

  if (response.status === 401 || response.status === 403 || response.status === 429) {
    throw new Error(`OddsJam afviste sessionen eller serveradgangen (${response.status})`)
  }
  if (/performing security verification|just a moment|cf-chl-/i.test(html)) {
    throw new Error('OddsJam viste en sikkerhedskontrol. Den bliver ikke forsøgt omgået.')
  }
  if (!response.ok) throw new Error(`OddsJam svarede ${response.status}`)
  if (response.url.includes('/login') || /sign in to your account/i.test(html)) {
    throw new Error('OddsJam viderestillede til login. Kontrollér at session-cookien er komplet.')
  }

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim().slice(0, 120) || 'Ukendt sidetitel'
  return { title, status: response.status, url: response.url }
}
