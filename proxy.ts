import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { LOCALE_HEADER, localePath, stripLocalePrefix } from '@/lib/i18n'
import { canonicalRoute } from '@/lib/route-slugs'
import { isIndexed } from '@/lib/locale-packs'
import { MAINTENANCE_BYPASS_COOKIE, getOpensAt, isMaintenanceActive } from '@/lib/maintenance'

export const USER_COOKIE = 'bt_uid'

const MEMBERS_ONLY_PATHS = ['/beregn', '/kilder']

// Pages written only in Danish (Danish bonuses, contact, company and legal copy).
const DANISH_ONLY_PATHS = ['/om-os', '/kontakt', '/bonus', '/vilkaar', '/privatlivspolitik']

function isMembersOnly(pathname: string) {
  return MEMBERS_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

const MAINTENANCE_OPEN_PATHS = ['/lukket', '/api']

function isMaintenanceOpenPath(pathname: string) {
  return MAINTENANCE_OPEN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

// Returns a response when the visitor should see the "closed" page, or null to continue as normal.
function maintenanceResponse(request: NextRequest): NextResponse | null {
  if (!isMaintenanceActive()) return null
  if (isMaintenanceOpenPath(request.nextUrl.pathname)) return null

  const bypassKey = process.env.MAINTENANCE_BYPASS_KEY
  if (bypassKey) {
    if (request.nextUrl.searchParams.get('preview') === bypassKey) {
      const cleanUrl = request.nextUrl.clone()
      cleanUrl.searchParams.delete('preview')
      const response = NextResponse.redirect(cleanUrl)
      response.cookies.set(MAINTENANCE_BYPASS_COOKIE, bypassKey, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return response
    }
    if (request.cookies.get(MAINTENANCE_BYPASS_COOKIE)?.value === bypassKey) return null
  }

  const retryAfter = Math.max(1, Math.ceil((getOpensAt() - Date.now()) / 1000))
  return NextResponse.rewrite(new URL('/lukket', request.url), {
    status: 503,
    headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' },
  })
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, path: publicPath } = stripLocalePrefix(pathname)
  const path = locale ? canonicalRoute(locale, publicPath) : publicPath

  const closed = maintenanceResponse(request)
  if (closed) return closed

  // Old or untranslated addresses (e.g. /en/guide/hvad-er-surebets) move permanently to the localized one.
  if (locale && (request.method === 'GET' || request.method === 'HEAD')) {
    const wanted = localePath(locale, path)
    const current = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    if (wanted !== current) {
      const target = request.nextUrl.clone()
      target.pathname = wanted
      return NextResponse.redirect(target, 308)
    }
  }

  if (isMembersOnly(path) && !getSessionCookie(request)) {
    const loginUrl = new URL(locale ? localePath(locale, '/konto') : '/konto', request.url)
    loginUrl.searchParams.set('login', '1')
    loginUrl.searchParams.set('next', (locale ? localePath(locale, path) : path) + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  const hasUid = Boolean(request.cookies.get(USER_COOKIE)?.value)
  const uid = hasUid ? null : crypto.randomUUID()
  if (uid) request.cookies.set(USER_COOKIE, uid)

  // Never trust a client-supplied locale header; only the URL prefix decides it.
  const forwarded = new Headers(request.headers)
  forwarded.delete(LOCALE_HEADER)
  if (locale) forwarded.set(LOCALE_HEADER, locale)

  let response: NextResponse
  if (locale) {
    const target = request.nextUrl.clone()
    target.pathname = path
    response = NextResponse.rewrite(target, { request: { headers: forwarded } })
  } else {
    response = NextResponse.next({ request: { headers: forwarded } })
  }

  // Danish-only pages served under another locale prefix would be Danish copy on a foreign URL.
  if (locale && (!isIndexed(locale) || DANISH_ONLY_PATHS.some((p) => path === p || path.startsWith(`${p}/`)))) {
    response.headers.set('X-Robots-Tag', 'noindex, follow')
  }

  if (uid) {
    response.cookies.set(USER_COOKIE, uid, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 2,
    })
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|manifest|sw\\.js|api/push/card|.*\\.(?:png|svg|jpg|ico|webmanifest)$).*)'],
}
