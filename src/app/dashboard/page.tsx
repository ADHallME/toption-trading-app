'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import EnhancedOverview from '@/components/dashboard/EnhancedOverview'
import ProfessionalTerminal from '@/components/dashboard/ProfessionalTerminal'

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const [terminalMode, setTerminalMode] = useState<'classic' | 'professional'>('professional')
  
  // Allow toggle via keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T to toggle terminal mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        setTerminalMode(prev => prev === 'classic' ? 'professional' : 'classic')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return terminalMode === 'professional' ? (
    <ProfessionalTerminal />
  ) : (
    <EnhancedOverview user={null} />
  )
}