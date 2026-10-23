import { NextResponse, type NextRequest } from 'next/server'

export const USER_COOKIE = 'bt_uid'

export function proxy(request: NextRequest) {
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
