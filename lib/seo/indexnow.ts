import sitemap from '@/app/sitemap'
import { SITE_URL } from '@/lib/site'

export const INDEXNOW_KEY = '1c287a76a0eae1f4fec118fcbbfaa690'

const FRESH_PATHS = ['/', '/surebets', '/dagens-surebets']

/** Pages whose content changes every day; the full sitemap is only resent weekly. */
export function indexNowUrls(full: boolean) {
  if (full) return sitemap().map((entry) => entry.url)
  return FRESH_PATHS.map((path) => `${SITE_URL}${path === '/' ? '' : path}`)
}

/** Notifies Bing, Yandex, Seznam and others (shared via IndexNow) that the URLs changed. */
export async function submitIndexNow(urls: string[]) {
  if (urls.length === 0) return { ok: true, status: 0, count: 0 }
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    return { ok: res.ok, status: res.status, count: urls.length }
  } catch {
    return { ok: false, status: 0, count: urls.length }
  }
}
