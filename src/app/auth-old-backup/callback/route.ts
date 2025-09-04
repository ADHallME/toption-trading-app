import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Log for debugging
  console.log('Auth callback received:', {
    hasCode: !!code,
    error,
    error_description,
    url: requestUrl.toString()
  })

  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin))
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // Exchange code for session
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        throw sessionError
      }

      console.log('Session established for user:', sessionData.session?.user?.email)
      
      // Get the user to check their profile status
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Get user error:', userError)
        throw userError
      }
      
      if (user) {
        console.log('Checking profile for user:', user.id)
        
        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('id', user.id)  // Fixed: was 'user_id', should be 'id'
          .single()
        
        // If no profile exists (new user), redirect to onboarding
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found - new user
            console.log('New user detected, redirecting to onboarding')
            return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
          } else {
            console.error('Profile query error:', profileError)
            // Still redirect to onboarding if there's an error
            return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
          }
        }
        
        // Redirect based on onboarding status
        console.log('Profile found, onboarding_completed:', profile?.onboarding_completed)
        if (profile?.onboarding_completed) {
          return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
        } else {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent('Authentication failed')}`, requestUrl.origin))
    }
  }

  // No code provided - redirect to login
  console.log('No auth code provided, redirecting to /auth')
  return NextResponse.redirect(new URL('/auth', requestUrl.origin))
}
