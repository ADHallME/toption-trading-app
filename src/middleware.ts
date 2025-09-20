import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  afterAuth(auth, req) {
    const url = new URL(req.url)
    
    // If user is signed in and trying to access /auth, redirect to dashboard
    if (auth.userId && url.pathname === '/auth') {
      return Response.redirect(new URL('/dashboard', req.url))
    }
    
    // If user just signed in (on sign-in page), go to dashboard
    if (auth.userId && url.pathname.includes('/sign-in')) {
      return Response.redirect(new URL('/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
