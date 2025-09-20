import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook',
  '/api/public(.*)'
])

export default clerkMiddleware((auth, req) => {
  // If it's not a public route, protect it
  if (!isPublicRoute(req)) {
    auth().protect()
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
