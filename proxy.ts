import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { MAINTENANCE_BYPASS_COOKIE, getOpensAt, isMaintenanceActive } from '@/lib/maintenance'

export const USER_COOKIE = 'bt_uid'

const MEMBERS_ONLY_PATHS = ['/beregn', '/kilder']

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

  const closed = maintenanceResponse(request)
  if (closed) return closed

  if (isMembersOnly(pathname) && !getSessionCookie(request)) {
    const loginUrl = new URL('/konto', request.url)
    loginUrl.searchParams.set('login', '1')
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  if (request.cookies.get(USER_COOKIE)?.value) return NextResponse.next()

  const uid = crypto.randomUUID()
  request.cookies.set(USER_COOKIE, uid)
  const response = NextResponse.next({ request: { headers: request.headers } })
  response.cookies.set(USER_COOKIE, uid, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 2,
  })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|manifest|.*\\.(?:png|svg|jpg|ico|webmanifest)$).*)'],
}
