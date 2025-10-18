// AI-Powered Opportunity Finder
// Uses REAL market scanner for best opportunities

import { getMarketScanner } from '@/lib/scanner/market-scanner'

export interface AIOpportunity {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  opportunity: {
    symbol: string
    underlying: string
    strike: number
    expiration: string
    dte: number
    type: 'put' | 'call'
    bid: number
    ask: number
    premium: number
    roi: number
    roiPerDay: number
    roiAnnualized: number
    pop: number
    volume: number
    openInterest: number
    delta: number
    theta: number
    gamma?: number  // Added gamma
    vega?: number   // Added vega
    iv: number
    distance: number
    capital: number
    breakeven: number
    lastUpdated: string
  }
  aiScore: number
  reasons: string[]
  warnings: string[]
  strategy: string
  riskLevel: 'low' | 'medium' | 'high'
  timeToExpiry: string
  expectedReturn: number
  probabilityOfProfit: number
}

class AIOpportunityFinder {
  async findBestOpportunities(
    marketType: 'equity' | 'index' | 'futures' = 'equity',
    limit: number = 15
  ): Promise<AIOpportunity[]> {
    try {
      // Use real market scanner
      const scanner = getMarketScanner()
      const result = await scanner.quickScan({
        minDTE: 7,
        maxDTE: 45,
        minROI: 0.2,  // Lowered from 0.5 to get more results
        minVolume: 10,
        minOpenInterest: 50
      })
      
      // Convert scan results to AI opportunities
      const opportunities: AIOpportunity[] = result.opportunities
        .map(opp => this.convertToAIOpportunity(opp))
        .filter(opp => opp.aiScore >= 40) // Lowered min AI score to show more results
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, limit)
      
      return opportunities
    } catch (error) {
      console.error('AI opportunity finder error:', error)
      return [] // Return empty array, NO FALLBACK DATA
    }
  }
  
  private convertToAIOpportunity(scanResult: any): AIOpportunity {
    const reasons: string[] = []
    const warnings: string[] = []
    let aiScore = 0
    
    // Analyze ROI
    if (scanResult.roi >= 3) {
      reasons.push(`Excellent ROI of ${scanResult.roi.toFixed(1)}%`)
      aiScore += 30
    } else if (scanResult.roi >= 2) {
      reasons.push(`Strong ROI of ${scanResult.roi.toFixed(1)}%`)
      aiScore += 25
    } else if (scanResult.roi >= 1) {
      reasons.push(`Good ROI of ${scanResult.roi.toFixed(1)}%`)
      aiScore += 20
    } else {
      warnings.push(`Low ROI of ${scanResult.roi.toFixed(1)}%`)
      aiScore += 10
    }
    
    // Analyze DTE
    if (scanResult.dte >= 14 && scanResult.dte <= 30) {
      reasons.push(`Optimal DTE of ${scanResult.dte} days for theta decay`)
      aiScore += 25
    } else if (scanResult.dte >= 7 && scanResult.dte <= 45) {
      reasons.push(`Reasonable DTE of ${scanResult.dte} days`)
      aiScore += 20
    } else {
      warnings.push(`Suboptimal DTE of ${scanResult.dte} days`)
      aiScore += 10
    }
    
    // Analyze PoP
    if (scanResult.pop >= 85) {
      reasons.push(`Very high probability of profit (${scanResult.pop.toFixed(0)}%)`)
      aiScore += 25
    } else if (scanResult.pop >= 75) {
      reasons.push(`High probability of profit (${scanResult.pop.toFixed(0)}%)`)
      aiScore += 20
    } else if (scanResult.pop >= 70) {
      reasons.push(`Good probability of profit (${scanResult.pop.toFixed(0)}%)`)
      aiScore += 15
    } else {
      warnings.push(`Lower probability of profit (${scanResult.pop.toFixed(0)}%)`)
      aiScore += 5
    }
    
    // Analyze volume/liquidity
    if (scanResult.volume >= 1000) {
      reasons.push(`Excellent liquidity (${scanResult.volume.toLocaleString()} volume)`)
      aiScore += 15
    } else if (scanResult.volume >= 100) {
      reasons.push(`Good liquidity (${scanResult.volume} volume)`)
      aiScore += 10
    } else {
      warnings.push(`Low liquidity (${scanResult.volume} volume)`)
      aiScore += 5
    }
    
    // Analyze IV
    if (scanResult.iv >= 0.3 && scanResult.iv <= 0.6) {
      reasons.push(`Favorable implied volatility (${(scanResult.iv * 100).toFixed(0)}%)`)
      aiScore += 10
    }
    
    // For covered calls, add dividend analysis
    if (scanResult.type === 'call' && scanResult.dividendYield) {
      const dividendReturn = (scanResult.dividendYield / 365) * scanResult.dte
      reasons.push(`Additional ${dividendReturn.toFixed(2)}% from dividends`)
      aiScore += 5
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'medium'
    if (scanResult.pop >= 80 && scanResult.distance >= 3) {
      riskLevel = 'low'
    } else if (scanResult.pop < 70 || scanResult.distance < 1) {
      riskLevel = 'high'
    }
    
    return {
      id: `${scanResult.symbol}-${scanResult.strike}-${scanResult.expiration}`,
      symbol: scanResult.symbol,
      name: scanResult.name || scanResult.symbol,
      price: scanResult.stockPrice,
      change: 0, // Would need historical data
      changePercent: 0, // Would need historical data
      opportunity: {
        symbol: scanResult.optionSymbol,
        underlying: scanResult.symbol,
        strike: scanResult.strike,
        expiration: scanResult.expiration,
        dte: scanResult.dte,
        type: scanResult.type,
        bid: scanResult.bid,
        ask: scanResult.ask,
        premium: scanResult.premium,
        roi: scanResult.roi,
        roiPerDay: scanResult.roi / scanResult.dte,
        roiAnnualized: scanResult.roiAnnualized,
        pop: scanResult.pop,
        volume: scanResult.volume,
        openInterest: scanResult.openInterest,
        delta: scanResult.delta,
        theta: scanResult.theta,
        iv: scanResult.iv,
        distance: scanResult.distance,
        capital: scanResult.capital,
        breakeven: scanResult.breakeven,
        lastUpdated: new Date().toISOString()
      },
      aiScore,
      reasons,
      warnings,
      strategy: scanResult.type === 'put' ? 'Cash Secured Put' : 'Covered Call',
      riskLevel,
      timeToExpiry: `${scanResult.dte} days`,
      expectedReturn: scanResult.roi,
      probabilityOfProfit: scanResult.pop
    }
  }
}

export const aiOpportunityFinder = new AIOpportunityFinder()
