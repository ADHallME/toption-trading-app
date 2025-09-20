'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  
  useEffect(() => {
    // This should only be hit if someone manually navigates to /auth
    // Immediately redirect to dashboard
    console.log('Auth page hit - redirecting to dashboard')
    router.replace('/dashboard')
  }, [router])

  // Show nothing while redirecting
  return null
}
