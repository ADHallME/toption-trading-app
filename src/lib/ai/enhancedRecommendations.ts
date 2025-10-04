/**
 * ENHANCED AI RECOMMENDATION ENGINE
 * 
 * Features:
 * - 0-100 scoring system
 * - Risk assessment (Low/Medium/High/Extreme)
 * - Actionable insights
 * - Pattern recognition
 */

export interface OpportunityScore {
  overall: number // 0-100
  breakdown: {
    momentum: number // 0-25 points
    value: number // 0-25 points
    liquidity: number // 0-25 points
    timing: number // 0-25 points
  }
  risk: 'Low' | 'Medium' | 'High' | 'Extreme'
  insights: string[]
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Avoid'
}

export class AIRecommendationEngine {
  
  /**
   * Score an opportunity 0-100
   */
  scoreOpportunity(opportunity: any): OpportunityScore {
    const breakdown = {
      momentum: this.scoreMomentum(opportunity),
      value: this.scoreValue(opportunity),
      liquidity: this.scoreLiquidity(opportunity),
      timing: this.scoreTiming(opportunity)
    }
    
    const overall = Object.values(breakdown).reduce((a, b) => a + b, 0)
    const risk = this.assessRisk(opportunity)
    const insights = this.generateInsights(opportunity, breakdown, risk)
    const recommendation = this.getRecommendation(overall, risk)
    
    return {
      overall: Math.round(overall),
      breakdown,
      risk,
      insights,
      recommendation
    }
  }
  
  /**
   * Score momentum indicators (0-25 points)
   */
  private scoreMomentum(opp: any): number {
    let score = 0
    
    // IV Rank bonus (0-10 points)
    if (opp.ivRank) {
      if (opp.ivRank > 50) score += 10
      else if (opp.ivRank > 30) score += 7
      else if (opp.ivRank > 15) score += 4
    }
    
    // Volume momentum (0-8 points)
    if (opp.volume) {
      if (opp.volume > 1000) score += 8
      else if (opp.volume > 500) score += 6
      else if (opp.volume > 100) score += 3
    }
    
    // Price action (0-7 points)
    if (opp.priceChange) {
      const change = Math.abs(opp.priceChange)
      if (change > 5) score += 7
      else if (change > 2) score += 4
      else if (change > 0) score += 2
    }
    
    return Math.min(score, 25)
  }
  
  /**
   * Score value proposition (0-25 points)
   */
  private scoreValue(opp: any): number {
    let score = 0
    
    // ROI scoring (0-15 points)
    if (opp.roi > 10) score += 15
    else if (opp.roi > 7) score += 12
    else if (opp.roi > 5) score += 9
    else if (opp.roi > 3) score += 6
    else if (opp.roi > 1) score += 3
    
    // Premium quality (0-10 points)
    if (opp.premium) {
      if (opp.premium > 500) score += 10
      else if (opp.premium > 200) score += 7
      else if (opp.premium > 50) score += 4
    }
    
    return Math.min(score, 25)
  }
  
  /**
   * Score liquidity (0-25 points)
   */
  private scoreLiquidity(opp: any): number {
    let score = 0
    
    // Open Interest (0-12 points)
    if (opp.openInterest) {
      if (opp.openInterest > 5000) score += 12
      else if (opp.openInterest > 1000) score += 9
      else if (opp.openInterest > 500) score += 6
      else if (opp.openInterest > 100) score += 3
    }
    
    // Volume (0-8 points)
    if (opp.volume) {
      if (opp.volume > 1000) score += 8
      else if (opp.volume > 500) score += 6
      else if (opp.volume > 100) score += 3
    }
    
    // Bid-Ask Spread (0-5 points)
    if (opp.bid && opp.ask) {
      const spread = ((opp.ask - opp.bid) / opp.ask) * 100
      if (spread < 2) score += 5
      else if (spread < 5) score += 3
      else if (spread < 10) score += 1
    }
    
    return Math.min(score, 25)
  }
  
  /**
   * Score timing (0-25 points)
   */
  private scoreTiming(opp: any): number {
    let score = 0
    
    // DTE optimization (0-15 points)
    if (opp.dte) {
      // Ideal: 30-45 DTE
      if (opp.dte >= 30 && opp.dte <= 45) score += 15
      else if (opp.dte >= 20 && opp.dte <= 60) score += 12
      else if (opp.dte >= 10 && opp.dte <= 90) score += 8
      else score += 4
    }
    
    // Theta decay rate (0-10 points)
    if (opp.theta && opp.premium) {
      const dailyDecay = Math.abs(opp.theta) / opp.premium * 100
      if (dailyDecay > 1.5) score += 10
      else if (dailyDecay > 1.0) score += 7
      else if (dailyDecay > 0.5) score += 4
    }
    
    return Math.min(score, 25)
  }
  
  /**
   * Assess overall risk level
   */
  private assessRisk(opp: any): 'Low' | 'Medium' | 'High' | 'Extreme' {
    let riskPoints = 0
    
    // High IV = higher risk
    if (opp.ivRank > 70) riskPoints += 3
    else if (opp.ivRank > 50) riskPoints += 2
    else if (opp.ivRank > 30) riskPoints += 1
    
    // Low liquidity = higher risk
    if (opp.volume < 50) riskPoints += 2
    if (opp.openInterest < 100) riskPoints += 2
    
    // Wide DTE = higher risk
    if (opp.dte > 90) riskPoints += 2
    else if (opp.dte < 7) riskPoints += 3
    
    // High delta = higher risk
    if (opp.delta && Math.abs(opp.delta) > 0.7) riskPoints += 2
    
    // Earnings nearby = higher risk
    if (opp.daysToEarnings && opp.daysToEarnings < 7) riskPoints += 3
    
    if (riskPoints >= 8) return 'Extreme'
    if (riskPoints >= 5) return 'High'
    if (riskPoints >= 3) return 'Medium'
    return 'Low'
  }
  
  /**
   * Generate actionable insights
   */
  private generateInsights(
    opp: any,
    breakdown: any,
    risk: string
  ): string[] {
    const insights: string[] = []
    
    // Momentum insights
    if (breakdown.momentum > 20) {
      insights.push(`Strong momentum with ${opp.ivRank}% IV rank`)
    } else if (breakdown.momentum < 10) {
      insights.push('Low momentum - consider waiting for better entry')
    }
    
    // Value insights
    if (breakdown.value > 20) {
      insights.push(`Excellent value at ${opp.roi.toFixed(1)}% ROI`)
    } else if (opp.roi > 10) {
      insights.push(`High ROI of ${opp.roi.toFixed(1)}% indicates strong premium`)
    }
    
    // Liquidity insights
    if (breakdown.liquidity < 15) {
      insights.push('⚠️ Low liquidity - may be difficult to close position')
    } else if (opp.volume > 1000) {
      insights.push('High volume provides easy entry/exit')
    }
    
    // Timing insights
    if (opp.dte >= 30 && opp.dte <= 45) {
      insights.push('Ideal DTE range for theta decay optimization')
    } else if (opp.dte < 15) {
      insights.push('⚠️ Short DTE increases gamma risk')
    }
    
    // Risk-specific insights
    if (risk === 'Extreme' || risk === 'High') {
      insights.push(`${risk} risk - only suitable for experienced traders`)
    }
    
    // Earnings warning
    if (opp.daysToEarnings && opp.daysToEarnings < 7) {
      insights.push('⚠️ Earnings within 7 days - expect elevated IV')
    }
    
    // Strategy-specific insights
    if (opp.strategy === 'CSP' && opp.delta && opp.delta < -0.3) {
      insights.push('Delta suggests good probability of profit')
    }
    
    if (opp.strategy === 'Iron Condor' && opp.popShort) {
      insights.push(`Short strikes have ${opp.popShort.toFixed(0)}% PoP`)
    }
    
    return insights.slice(0, 5) // Max 5 insights
  }
  
  /**
   * Get final recommendation
   */
  private getRecommendation(
    score: number,
    risk: string
  ): 'Strong Buy' | 'Buy' | 'Hold' | 'Avoid' {
    // Extreme risk = avoid unless score is exceptional
    if (risk === 'Extreme') {
      return score >= 85 ? 'Buy' : 'Avoid'
    }
    
    // High risk requires higher score
    if (risk === 'High') {
      if (score >= 80) return 'Buy'
      if (score >= 70) return 'Hold'
      return 'Avoid'
    }
    
    // Medium/Low risk - normal scoring
    if (score >= 85) return 'Strong Buy'
    if (score >= 70) return 'Buy'
    if (score >= 55) return 'Hold'
    return 'Avoid'
  }
  
  /**
   * Batch score multiple opportunities
   */
  scoreOpportunities(opportunities: any[]): Array<{ opportunity: any; score: OpportunityScore }> {
    return opportunities
      .map(opp => ({
        opportunity: opp,
        score: this.scoreOpportunity(opp)
      }))
      .sort((a, b) => b.score.overall - a.score.overall)
  }
  
  /**
   * Get top recommendations
   */
  getTopRecommendations(
    opportunities: any[],
    limit: number = 10,
    minScore: number = 70
  ): Array<{ opportunity: any; score: OpportunityScore }> {
    return this.scoreOpportunities(opportunities)
      .filter(item => item.score.overall >= minScore)
      .slice(0, limit)
  }
}

// Singleton instance
export const aiEngine = new AIRecommendationEngine()
