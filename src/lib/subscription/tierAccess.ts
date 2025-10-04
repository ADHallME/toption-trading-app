/**
 * TIER-BASED ACCESS CONTROL
 * 
 * Defines what each subscription tier can access across asset classes
 */

export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'premium'

export interface TierAccess {
  equities: {
    limit: number // -1 = unlimited
    tickers?: string[] // Specific allowed tickers
  }
  indexes: {
    enabled: boolean
    tickers: string[] // Empty = all allowed
  }
  futures: {
    enabled: boolean
    tickers: string[] // Empty = all allowed
  }
}

export const TIER_ACCESS: Record<SubscriptionTier, TierAccess> = {
  free: {
    equities: {
      limit: 50 // Top 50 most liquid
    },
    indexes: {
      enabled: false,
      tickers: []
    },
    futures: {
      enabled: false,
      tickers: []
    }
  },
  
  basic: {
    equities: {
      limit: 500 // Top 500 most liquid
    },
    indexes: {
      enabled: true,
      tickers: ['SPY'] // Only SPY for Solo Trader
    },
    futures: {
      enabled: true,
      tickers: ['/CL', '/NG', '/GC'] // Crude, Nat Gas, Gold only
    }
  },
  
  professional: {
    equities: {
      limit: -1 // Unlimited - all 3,500+
    },
    indexes: {
      enabled: true,
      tickers: [] // Empty array = all indexes allowed
    },
    futures: {
      enabled: true,
      tickers: [] // Empty array = all futures allowed
    }
  },
  
  premium: {
    equities: {
      limit: -1 // Unlimited - all 3,500+
    },
    indexes: {
      enabled: true,
      tickers: [] // Empty array = all indexes allowed
    },
    futures: {
      enabled: true,
      tickers: [] // Empty array = all futures allowed
    }
  }
}

/**
 * Check if user has access to a specific ticker
 */
export function canAccessTicker(
  tier: SubscriptionTier,
  assetClass: 'equity' | 'index' | 'futures',
  ticker: string
): boolean {
  const access = TIER_ACCESS[tier]
  
  if (assetClass === 'equity') {
    // For equities, access is based on limit (top N most liquid)
    // This check happens in the filtering logic, not here
    return true
  }
  
  if (assetClass === 'index') {
    if (!access.indexes.enabled) return false
    if (access.indexes.tickers.length === 0) return true // All allowed
    return access.indexes.tickers.includes(ticker)
  }
  
  if (assetClass === 'futures') {
    if (!access.futures.enabled) return false
    if (access.futures.tickers.length === 0) return true // All allowed
    return access.futures.tickers.includes(ticker)
  }
  
  return false
}

/**
 * Get allowed tickers for a user's tier
 */
export function getAllowedTickers(
  tier: SubscriptionTier,
  assetClass: 'equity' | 'index' | 'futures',
  allTickers: string[]
): string[] {
  const access = TIER_ACCESS[tier]
  
  if (assetClass === 'equity') {
    if (access.equities.limit === -1) return allTickers
    return allTickers.slice(0, access.equities.limit)
  }
  
  if (assetClass === 'index') {
    if (!access.indexes.enabled) return []
    if (access.indexes.tickers.length === 0) return allTickers
    return access.indexes.tickers
  }
  
  if (assetClass === 'futures') {
    if (!access.futures.enabled) return []
    if (access.futures.tickers.length === 0) return allTickers
    return access.futures.tickers
  }
  
  return []
}
