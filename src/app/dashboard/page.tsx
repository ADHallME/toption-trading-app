'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import EnhancedOverview from '@/components/dashboard/EnhancedOverview'

export default function DashboardPage() {
  const router = useRouter()
  const { isSignedIn, user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isSignedIn, isLoaded, router])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return <EnhancedOverview />
}
