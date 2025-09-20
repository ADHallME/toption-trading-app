import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  afterAuth(auth, req) {
    // If user is signed in
    if (auth.userId) {
      // If they're on sign-in, sign-up, or any other non-dashboard route
      if (!req.nextUrl.pathname.startsWith('/dashboard')) {
        // Force redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
