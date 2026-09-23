import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ubah dari 'export function middleware' menjadi 'export function proxy'
export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_user_id')
  const { pathname } = request.nextUrl

  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/transactions')

  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if ((pathname === '/login' || pathname === '/register') && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*', '/login', '/register'],
}