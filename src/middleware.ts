import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  afterAuth(auth, req) {
    // If signed in and on sign-in page, redirect to dashboard
    if (auth.userId && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/')) {
      const dashboard = new URL('/dashboard', req.url)
      return Response.redirect(dashboard)
    }
    // No redirect to /auth - it doesn't exist
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
