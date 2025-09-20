'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Options Trading Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            <p className="text-gray-400">Real-time market data coming soon...</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
            <p className="text-gray-400">Track your options positions here...</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Alerts</h2>
            <p className="text-gray-400">Price alerts and notifications...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
