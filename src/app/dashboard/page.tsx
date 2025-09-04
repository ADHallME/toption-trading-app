'use client'

import { useUser } from '@clerk/nextjs'
import EnhancedOverview from '@/components/dashboard/EnhancedOverview'

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser()

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  // If not signed in, show message (don't redirect - let middleware handle it)
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
        <div className="text-center">
          <p className="text-gray-400">Please sign in to access the dashboard</p>
          <a href="/sign-in" className="text-cyan-500 hover:text-cyan-400 mt-4 inline-block">
            Go to Sign In
          </a>
        </div>
      </div>
    )
  }

  // User is signed in, show the dashboard
  return <EnhancedOverview />
}
