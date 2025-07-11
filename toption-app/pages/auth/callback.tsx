import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during auth callback:', error)
          router.push('/auth?error=callback_error')
          return
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          router.push('/dashboard')
        } else {
          // No session, redirect to auth page
          router.push('/auth')
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        router.push('/auth?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-white">Completing authentication...</p>
      </div>
    </div>
  )
}
