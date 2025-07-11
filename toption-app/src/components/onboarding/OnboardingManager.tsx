'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import OnboardingFlow from './OnboardingFlow'
import GuidedTour from './GuidedTour'

interface OnboardingManagerProps {
  children: React.ReactNode
  currentTab?: string
}

const OnboardingManager: React.FC<OnboardingManagerProps> = ({ children, currentTab }) => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('preferences')
        .eq('id', user.id as string)
        .single()

      const isOnboarded = profile?.preferences?.onboarded
      const hasSeenTour = localStorage.getItem(`toption_tour_${user.id}`)

      if (!isOnboarded) {
        setShowOnboarding(true)
      } else if (!hasSeenTour) {
        setShowTour(true)
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setShowTour(true)
  }

  const handleTourComplete = async () => {
    setShowTour(false)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      localStorage.setItem(`toption_tour_${user.id}`, 'completed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {children}
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      {showTour && <GuidedTour onComplete={handleTourComplete} currentTab={currentTab} />}
    </>
  )
}

export default OnboardingManager
