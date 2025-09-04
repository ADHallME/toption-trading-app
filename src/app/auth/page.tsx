'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function AuthRedirect() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to dashboard
        router.push('/dashboard')
      } else {
        // User is not signed in, redirect to sign-in
        router.push('/sign-in')
      }
    }
  }, [isSignedIn, isLoaded, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Redirecting...</p>
      </div>
    </div>
  )
}
