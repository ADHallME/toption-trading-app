'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function AuthRedirect() {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()

  useEffect(() => {
    if (!isLoaded) return
    
    // Force redirect based on auth state
    if (isSignedIn && user) {
      console.log('User signed in, redirecting to dashboard')
      window.location.href = '/dashboard'
    } else {
      console.log('No user, redirecting to sign-in')
      window.location.href = '/sign-in'
    }
  }, [isSignedIn, isLoaded, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Completing authentication...</p>
      </div>
    </div>
  )
}
