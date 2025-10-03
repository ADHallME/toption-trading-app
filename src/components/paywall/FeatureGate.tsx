'use client'

import { useUser } from '@clerk/nextjs'
import { SUBSCRIPTION_TIERS, SubscriptionTier } from '@/lib/subscription/tiers'
import UpgradePrompt from './UpgradePrompt'

interface FeatureGateProps {
  feature: keyof typeof SUBSCRIPTION_TIERS.basic
  requiredTier: 'basic' | 'professional' | 'premium'
  children: React.ReactNode
  fallback?: React.ReactNode
  featureName?: string
  description?: string
}

export default function FeatureGate({ 
  feature, 
  requiredTier, 
  children, 
  fallback,
  featureName,
  description 
}: FeatureGateProps) {
  const { user } = useUser()
  
  // Get user's tier from Clerk metadata
  const userTier = (user?.publicMetadata?.subscriptionTier as SubscriptionTier) || 'free'
  
  // Check if user has access
  const tierHierarchy = { free: 0, basic: 1, professional: 2, premium: 3 }
  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[requiredTier]
  
  if (hasAccess) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  return (
    <UpgradePrompt
      feature={featureName || feature.toString()}
      requiredTier={requiredTier}
      currentTier={userTier}
      description={description}
    />
  )
}
