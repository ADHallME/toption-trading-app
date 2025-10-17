/**
 * PAYWALL BYPASS COMPONENT
 * 
 * Add this to your app to bypass paywalls during testing.
 * 
 * Usage in any component:
 * import { useTestSubscription } from '@/components/test/PaywallBypass'
 * const { isPremium, isTestMode } = useTestSubscription()
 */

'use client'

import { useState, useEffect } from 'react'

export interface TestSubscription {
  tier: 'free' | 'basic' | 'pro' | 'premium'
  status: 'active' | 'inactive' | 'trialing' | 'canceled'
  features: {
    aiOpportunities: boolean
    advancedAnalytics: boolean
    whaleAlerts: boolean
    socialFeed: boolean
    unlimitedScans: boolean
    historicalData: boolean
    customAlerts: boolean
    portfolioTracking: boolean
  }
}

const TEST_SUBSCRIPTION: TestSubscription = {
  tier: 'premium',
  status: 'active',
  features: {
    aiOpportunities: true,
    advancedAnalytics: true,
    whaleAlerts: true,
    socialFeed: true,
    unlimitedScans: true,
    historicalData: true,
    customAlerts: true,
    portfolioTracking: true
  }
}

export function useTestSubscription() {
  const [isTestMode, setIsTestMode] = useState(false)
  const [testSub, setTestSub] = useState<TestSubscription>(TEST_SUBSCRIPTION)

  useEffect(() => {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const testParam = urlParams.get('test')
    
    // Check localStorage
    const localBypass = localStorage.getItem('bypass_paywall')
    
    // Check cookie
    const cookieBypass = document.cookie.includes('test_premium=true')
    
    // Check environment variable
    const envBypass = process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true'
    
    if (testParam === 'true' || localBypass === 'true' || cookieBypass || envBypass) {
      setIsTestMode(true)
      console.log('🧪 TEST MODE ENABLED - Paywall bypassed')
    }

    // Load test subscription from localStorage if exists
    const storedSub = localStorage.getItem('test_subscription')
    if (storedSub) {
      try {
        setTestSub(JSON.parse(storedSub))
      } catch (e) {
        console.error('Failed to parse test subscription:', e)
      }
    }
  }, [])

  return {
    isTestMode,
    isPremium: isTestMode ? true : false,
    isPro: isTestMode ? true : false,
    isBasic: isTestMode ? true : false,
    subscription: isTestMode ? testSub : null,
    hasFeature: (feature: keyof TestSubscription['features']) => 
      isTestMode ? testSub.features[feature] : false
  }
}

// HOC to wrap components that need paywall bypass
export function withTestSubscription<P extends object>(
  Component: React.ComponentType<P>
) {
  return function TestSubscriptionWrapper(props: P) {
    const testSub = useTestSubscription()
    return <Component {...props} testSubscription={testSub} />
  }
}

// Component to display test mode indicator
export function TestModeIndicator() {
  const { isTestMode, subscription } = useTestSubscription()

  if (!isTestMode) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-bold">🧪 TEST MODE</span>
        <span className="text-xs">
          {subscription?.tier.toUpperCase()} - {subscription?.status}
        </span>
      </div>
    </div>
  )
}

export default useTestSubscription
