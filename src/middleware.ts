import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhook',
    '/api/public(.*)'
  ],
  ignoredRoutes: [
    '/api/webhook',
    '/((?!api|trpc))(_next.*|.+\.[\w]+$)',
    '/trpc(.*)'
  ]
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
