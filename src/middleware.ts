import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Don't interfere with auth callback or onboarding flow
  if (req.nextUrl.pathname.startsWith('/auth/callback') || 
      req.nextUrl.pathname.startsWith('/onboarding')) {
    return res
  }

  // If no session and trying to access protected routes, redirect to auth
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If session exists and trying to access auth page, check onboarding status
  if (session && req.nextUrl.pathname === '/auth') {
    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single()
    
    if (!profile || !profile.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth', '/auth/callback'],
}
