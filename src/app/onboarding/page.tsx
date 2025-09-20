'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Skip onboarding for now - go straight to dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
    </div>
  )
}
