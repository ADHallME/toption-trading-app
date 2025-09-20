'use client'

import { useAuth } from '@clerk/nextjs'
import EnhancedOverview from '@/components/dashboard/EnhancedOverview'

export default function DashboardPage() {
  const { isLoaded, isSignedIn, userId } = useAuth()

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  // Pass null for now - we'll update EnhancedOverview to not need the user prop
  return <EnhancedOverview user={null} />
}
