import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnCheckout = req.nextUrl.pathname.startsWith('/checkout')
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')

  // Protect checkout route
  if (isOnCheckout && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(req.nextUrl.pathname), req.nextUrl))
  }

  // Protect admin route
  if (isOnAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    // @ts-ignore
    if (req.auth?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
