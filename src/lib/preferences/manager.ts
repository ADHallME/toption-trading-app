// User Preferences Manager
// Handles loading, saving, and applying user preferences

import { UserPreferences, DEFAULT_PREFERENCES, RISK_TOLERANCE_PRESETS } from './types'

const STORAGE_KEY = 'toption_user_preferences'

export class PreferencesManager {
  /**
   * Load user preferences from localStorage
   */
  static load(): UserPreferences {
    if (typeof window === 'undefined') {
      return DEFAULT_PREFERENCES
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all fields exist
        return { ...DEFAULT_PREFERENCES, ...parsed }
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
    
    return DEFAULT_PREFERENCES
  }
  
  /**
   * Save user preferences to localStorage
   */
  static save(preferences: UserPreferences): void {
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      console.log('✅ Preferences saved')
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }
  
  /**
   * Apply risk tolerance preset
   */
  static applyRiskPreset(riskTolerance: UserPreferences['riskTolerance']): Partial<UserPreferences> {
    return {
      ...RISK_TOLERANCE_PRESETS[riskTolerance],
      riskTolerance
    }
  }
  
  /**
   * Reset to defaults
   */
  static reset(): UserPreferences {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    return DEFAULT_PREFERENCES
  }
  
  /**
   * Check if opportunity matches user preferences
   */
  static matchesPreferences(opportunity: any, preferences: UserPreferences): {
    matches: boolean
    score: number // 0-100, higher = better match
    reasons: string[]
  } {
    const reasons: string[] = []
    let score = 0
    let totalChecks = 0
    
    // Check strategy type
    totalChecks++
    const strategyMatch = preferences.strategies.length === 0 || 
      preferences.strategies.includes(opportunity.type)
    if (strategyMatch) {
      score++
      reasons.push(`✓ Matches preferred strategy: ${opportunity.type}`)
    } else {
      reasons.push(`✗ Strategy ${opportunity.type} not in preferences`)
    }
    
    // Check ROI
    totalChecks++
    const roiMatch = opportunity.roi >= preferences.roiMin && 
      opportunity.roi <= preferences.roiMax
    if (roiMatch) {
      score++
      const roiDeviation = Math.abs(opportunity.roi - (preferences.roiMin + preferences.roiMax) / 2)
      if (roiDeviation < 1) {
        reasons.push(`✓ ROI ${opportunity.roi.toFixed(2)}% is ideal for your range`)
      } else {
        reasons.push(`✓ ROI ${opportunity.roi.toFixed(2)}% within your ${preferences.roiMin}-${preferences.roiMax}% range`)
      }
    } else {
      reasons.push(`✗ ROI ${opportunity.roi.toFixed(2)}% outside ${preferences.roiMin}-${preferences.roiMax}% range`)
    }
    
    // Check DTE
    totalChecks++
    const dteMatch = opportunity.dte >= preferences.dteMin && 
      opportunity.dte <= preferences.dteMax
    if (dteMatch) {
      score++
      reasons.push(`✓ ${opportunity.dte} DTE within your ${preferences.dteMin}-${preferences.dteMax} day range`)
    } else {
      reasons.push(`✗ ${opportunity.dte} DTE outside ${preferences.dteMin}-${preferences.dteMax} day range`)
    }
    
    // Check Premium
    totalChecks++
    const premiumMatch = opportunity.premium >= preferences.premiumMin && 
      opportunity.premium <= preferences.premiumMax
    if (premiumMatch) {
      score++
      reasons.push(`✓ $${opportunity.premium.toFixed(2)} premium within your range`)
    } else {
      reasons.push(`✗ $${opportunity.premium.toFixed(2)} premium outside your range`)
    }
    
    // Check Volume
    totalChecks++
    const volumeMatch = opportunity.volume >= preferences.minVolume
    if (volumeMatch) {
      score++
      reasons.push(`✓ Volume ${opportunity.volume} meets minimum ${preferences.minVolume}`)
    } else {
      reasons.push(`✗ Volume ${opportunity.volume} below minimum ${preferences.minVolume}`)
    }
    
    // Check Open Interest
    totalChecks++
    const oiMatch = opportunity.openInterest >= preferences.minOpenInterest
    if (oiMatch) {
      score++
      reasons.push(`✓ OI ${opportunity.openInterest} meets minimum ${preferences.minOpenInterest}`)
    } else {
      reasons.push(`✗ OI ${opportunity.openInterest} below minimum ${preferences.minOpenInterest}`)
    }
    
    // Check excluded tickers
    if (preferences.excludedTickers.includes(opportunity.underlying)) {
      score = 0
      reasons.unshift(`✗ ${opportunity.underlying} is in your excluded list`)
      return { matches: false, score: 0, reasons }
    }
    
    // Bonus for priority tickers
    if (preferences.priorityTickers.includes(opportunity.underlying)) {
      score += 2
      reasons.push(`⭐ ${opportunity.underlying} is in your priority list`)
    }
    
    // Calculate final score (0-100)
    const finalScore = Math.round((score / (totalChecks + 2)) * 100) // +2 for potential priority bonus
    
    // Must match at least 70% to be considered a match
    const matches = finalScore >= 70
    
    return {
      matches,
      score: finalScore,
      reasons
    }
  }
  
  /**
   * Find similar opportunities based on a reference opportunity
   */
  static findSimilar(
    reference: any,
    candidates: any[],
    preferences: UserPreferences,
    limit: number = 5
  ): Array<{ opportunity: any; similarity: number; reasons: string[] }> {
    const scored = candidates.map(candidate => {
      if (candidate.underlying === reference.underlying) {
        return null // Skip same underlying
      }
      
      let similarity = 0
      const reasons: string[] = []
      
      // Same strategy type
      if (candidate.type === reference.type) {
        similarity += 30
        reasons.push(`Same strategy: ${candidate.type}`)
      }
      
      // Similar ROI (within 1%)
      const roiDiff = Math.abs(candidate.roi - reference.roi)
      if (roiDiff < 1) {
        similarity += 25
        reasons.push(`Similar ROI: ${candidate.roi.toFixed(2)}% vs ${reference.roi.toFixed(2)}%`)
      } else if (roiDiff < 2) {
        similarity += 15
        reasons.push(`Close ROI: ${candidate.roi.toFixed(2)}% vs ${reference.roi.toFixed(2)}%`)
      }
      
      // Similar DTE (within 5 days)
      const dteDiff = Math.abs(candidate.dte - reference.dte)
      if (dteDiff < 5) {
        similarity += 20
        reasons.push(`Similar expiration: ${candidate.dte} vs ${reference.dte} DTE`)
      } else if (dteDiff < 10) {
        similarity += 10
        reasons.push(`Close expiration: ${candidate.dte} vs ${reference.dte} DTE`)
      }
      
      // Similar premium (within 20%)
      const premiumRatio = candidate.premium / reference.premium
      if (premiumRatio >= 0.8 && premiumRatio <= 1.2) {
        similarity += 15
        reasons.push(`Similar premium: $${candidate.premium.toFixed(2)} vs $${reference.premium.toFixed(2)}`)
      }
      
      // Matches user preferences
      const prefMatch = this.matchesPreferences(candidate, preferences)
      if (prefMatch.matches) {
        similarity += 10
        reasons.push('Matches your preferences')
      }
      
      return {
        opportunity: candidate,
        similarity,
        reasons
      }
    }).filter(Boolean) as Array<{ opportunity: any; similarity: number; reasons: string[] }>
    
    // Sort by similarity and return top N
    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
}
