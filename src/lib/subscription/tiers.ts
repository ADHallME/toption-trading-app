// Subscription tier definitions and feature gates

export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'premium'

export interface TierFeatures {
  name: string
  price: number
  equityLimit: number
  hasIndexes: boolean
  hasFutures: boolean
  socialFeedLimit: number
  whaleTradesLimit: number
  hasUnusualVolume: boolean
  hasBacktesting: boolean
  canExportCSV: boolean
  hasAdvancedScreener: boolean
  hasEmailAlerts: boolean
  hasHistoricalData: boolean
  historicalDataYears: number
  hasPrioritySupport: boolean
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierFeatures> = {
  free: {
    name: 'Free Trial',
    price: 0,
    equityLimit: 50,
    hasIndexes: false,
    hasFutures: false,
    socialFeedLimit: 0,
    whaleTradesLimit: 0,
    hasUnusualVolume: false,
    hasBacktesting: false,
    canExportCSV: false,
    hasAdvancedScreener: false,
    hasEmailAlerts: false,
    hasHistoricalData: false,
    historicalDataYears: 0,
    hasPrioritySupport: false
  },
  
  basic: {
    name: 'Basic',
    price: 99,
    equityLimit: 500,
    hasIndexes: false,
    hasFutures: false,
    socialFeedLimit: 5,
    whaleTradesLimit: 5,
    hasUnusualVolume: false,
    hasBacktesting: false,
    canExportCSV: false,
    hasAdvancedScreener: true,
    hasEmailAlerts: false,
    hasHistoricalData: false,
    historicalDataYears: 0,
    hasPrioritySupport: false
  },
  
  professional: {
    name: 'Professional',
    price: 249,
    equityLimit: -1, // Unlimited
    hasIndexes: true,
    hasFutures: true,
    socialFeedLimit: -1, // Unlimited
    whaleTradesLimit: 25,
    hasUnusualVolume: true,
    hasBacktesting: false,
    canExportCSV: true,
    hasAdvancedScreener: true,
    hasEmailAlerts: true,
    hasHistoricalData: true,
    historicalDataYears: 1,
    hasPrioritySupport: false
  },
  
  premium: {
    name: 'Premium',
    price: 499,
    equityLimit: -1, // Unlimited
    hasIndexes: true,
    hasFutures: true,
    socialFeedLimit: -1, // Unlimited
    whaleTradesLimit: -1, // Unlimited
    hasUnusualVolume: true,
    hasBacktesting: true,
    canExportCSV: true,
    hasAdvancedScreener: true,
    hasEmailAlerts: true,
    hasHistoricalData: true,
    historicalDataYears: 10,
    hasPrioritySupport: true
  }
}

export function getTierFeatures(tier: SubscriptionTier): TierFeatures {
  return SUBSCRIPTION_TIERS[tier]
}

export function canAccessFeature(userTier: SubscriptionTier, feature: keyof TierFeatures): boolean {
  const tierFeatures = SUBSCRIPTION_TIERS[userTier]
  const value = tierFeatures[feature]
  
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  
  return false
}
