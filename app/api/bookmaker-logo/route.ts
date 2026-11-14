const DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/
const WEEK = 60 * 60 * 24 * 7

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get('domain')?.toLowerCase() ?? ''
  if (!DOMAIN.test(domain) || domain.length > 80) return new Response('Ugyldigt domæne', { status: 400 })

  const source =
    'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=' +
    encodeURIComponent(`https://${domain}`)

  try {
    const upstream = await fetch(source, { signal: AbortSignal.timeout(8_000), next: { revalidate: WEEK } })
    const type = upstream.headers.get('content-type') ?? ''
    if (!upstream.ok || !type.startsWith('image/')) {
      return new Response('Intet logo', { status: 404, headers: { 'Cache-Control': `public, max-age=86400, s-maxage=86400` } })
    }
    return new Response(await upstream.arrayBuffer(), {
      headers: { 'Content-Type': type, 'Cache-Control': `public, max-age=${WEEK}, s-maxage=${WEEK}, stale-while-revalidate=${WEEK}` },
    })
  } catch {
    return new Response('Logo-opslag fejlede', { status: 502 })
  }
}
