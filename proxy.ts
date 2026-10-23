import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export const USER_COOKIE = 'bt_uid'

const PUBLIC_PATHS = ['/konto', '/login']

function isPublic(pathname: string) {
  return pathname.startsWith('/api/auth') || PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isPublic(pathname) && !getSessionCookie(request)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Du skal være logget ind.' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/konto', request.url))
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
