// User Preferences Types
// Defines all customizable filters for AI-powered opportunity matching

export interface UserPreferences {
  // Strategy preferences
  strategies: Strategy[]
  
  // ROI preferences (percentage)
  roiMin: number
  roiMax: number
  
  // Days to Expiration preferences
  dteMin: number
  dteMax: number
  
  // Premium preferences (per contract in dollars)
  premiumMin: number
  premiumMax: number
  
  // Underlying stock preferences
  stockPriceMin: number
  stockPriceMax: number
  
  // Liquidity requirements
  minVolume: number
  minOpenInterest: number
  
  // Sector preferences
  preferredSectors: string[]
  excludedSectors: string[]
  
  // Specific ticker preferences
  priorityTickers: string[] // Tickers to prioritize
  excludedTickers: string[] // Tickers to never show
  
  // Risk tolerance
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  
  // Notification preferences
  enableAlerts: boolean
  alertFrequency: 'realtime' | 'hourly' | 'daily'
}

export type Strategy = 
  | 'CSP' // Cash Secured Put
  | 'CC'  // Covered Call
  | 'BPS' // Bull Put Spread
  | 'BCS' // Bear Call Spread
  | 'IC'  // Iron Condor
  | 'Straddle'
  | 'Strangle'
  | 'Calendar'

export const STRATEGY_LABELS: Record<Strategy, string> = {
  'CSP': 'Cash Secured Put',
  'CC': 'Covered Call',
  'BPS': 'Bull Put Spread',
  'BCS': 'Bear Call Spread',
  'IC': 'Iron Condor',
  'Straddle': 'Straddle',
  'Strangle': 'Strangle',
  'Calendar': 'Calendar Spread'
}

export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial',
  'Energy',
  'Consumer Discretionary',
  'Consumer Staples',
  'Industrials',
  'Materials',
  'Utilities',
  'Real Estate',
  'Communication Services'
]

export const RISK_TOLERANCE_PRESETS: Record<UserPreferences['riskTolerance'], Partial<UserPreferences>> = {
  'conservative': {
    roiMin: 0.5,
    roiMax: 3,
    dteMin: 30,
    dteMax: 60,
    minVolume: 100,
    minOpenInterest: 500,
    strategies: ['CSP', 'CC']
  },
  'moderate': {
    roiMin: 1,
    roiMax: 6,
    dteMin: 20,
    dteMax: 45,
    minVolume: 50,
    minOpenInterest: 200,
    strategies: ['CSP', 'CC', 'BPS', 'BCS']
  },
  'aggressive': {
    roiMin: 3,
    roiMax: 15,
    dteMin: 7,
    dteMax: 30,
    minVolume: 20,
    minOpenInterest: 100,
    strategies: ['CSP', 'CC', 'BPS', 'BCS', 'IC', 'Straddle', 'Strangle']
  }
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  strategies: ['CSP', 'CC'],
  roiMin: 1,
  roiMax: 8,
  dteMin: 20,
  dteMax: 45,
  premiumMin: 0.5,
  premiumMax: 10,
  stockPriceMin: 25,
  stockPriceMax: 500,
  minVolume: 50,
  minOpenInterest: 100,
  preferredSectors: [],
  excludedSectors: [],
  priorityTickers: [],
  excludedTickers: [],
  riskTolerance: 'moderate',
  enableAlerts: true,
  alertFrequency: 'hourly'
}
