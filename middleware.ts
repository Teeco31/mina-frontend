import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ACCOUNT_PATHS = ['/account/login', '/account/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/account')) return NextResponse.next()

  // Login and register pages are public
  if (PUBLIC_ACCOUNT_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // All other /account/* routes require the session cookie
  const token = request.cookies.get('mina_member_token')
  if (!token?.value) {
    const loginUrl = new URL('/account/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
