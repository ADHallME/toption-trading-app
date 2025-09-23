// AI-Powered Opportunity Finder
// Scans market for the best options opportunities of the day

import { unifiedPolygonClient, OptionContract } from '@/lib/polygon/unified-client'

export interface AIOpportunity {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  opportunity: OptionContract
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
  private popularSymbols = [
    'SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'NFLX',
    'AMD', 'INTC', 'CRM', 'ADBE', 'PYPL', 'UBER', 'LYFT', 'ROKU', 'SQ', 'SHOP'
  ]

  async findBestOpportunities(limit: number = 6): Promise<AIOpportunity[]> {
    const opportunities: AIOpportunity[] = []
    
    try {
      // Get options data for popular symbols
      for (const symbol of this.popularSymbols.slice(0, 10)) { // Limit to 10 for performance
        try {
          const options = await unifiedPolygonClient.getOptionsChain(symbol, 'put', 45)
          const stockQuote = await unifiedPolygonClient.getStockQuotes([symbol])
          
          if (options.length > 0 && stockQuote.length > 0) {
            const stock = stockQuote[0]
            
            // Find the best opportunity for this symbol
            const bestOption = this.findBestOptionForSymbol(options, stock)
            if (bestOption) {
              const aiOpportunity = this.analyzeOpportunity(bestOption, stock)
              if (aiOpportunity.aiScore >= 70) { // Only include high-scoring opportunities
                opportunities.push(aiOpportunity)
              }
            }
          }
        } catch (error) {
          console.error(`Failed to analyze ${symbol}:`, error)
          continue
        }
      }
      
      // Sort by AI score and return top opportunities
      return opportunities
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, limit)
        
    } catch (error) {
      console.error('AI opportunity finder error:', error)
      return []
    }
  }

  private findBestOptionForSymbol(options: OptionContract[], stock: any): OptionContract | null {
    if (options.length === 0) return null
    
    // Filter for reasonable opportunities
    const viableOptions = options.filter(option => 
      option.dte >= 7 && 
      option.dte <= 45 && 
      option.roi >= 1.0 && 
      option.roi <= 15.0 &&
      option.premium >= 0.50 &&
      option.volume > 0
    )
    
    if (viableOptions.length === 0) return null
    
    // Score each option based on multiple factors
    const scoredOptions = viableOptions.map(option => {
      let score = 0
      
      // ROI score (higher is better, but not too high)
      if (option.roi >= 2 && option.roi <= 8) score += 30
      else if (option.roi >= 1 && option.roi <= 12) score += 20
      else score += 10
      
      // DTE score (prefer 14-30 days)
      if (option.dte >= 14 && option.dte <= 30) score += 25
      else if (option.dte >= 7 && option.dte <= 45) score += 15
      else score += 5
      
      // Distance from current price (prefer 2-5% OTM)
      const distance = Math.abs(option.distance)
      if (distance >= 2 && distance <= 5) score += 20
      else if (distance >= 1 && distance <= 8) score += 15
      else score += 5
      
      // Volume score (higher volume is better)
      if (option.volume > 1000) score += 15
      else if (option.volume > 100) score += 10
      else score += 5
      
      // Greeks score (if available)
      if (option.delta && option.delta >= -0.3 && option.delta <= -0.1) score += 10
      if (option.iv && option.iv >= 0.2 && option.iv <= 0.5) score += 10
      
      return { option, score }
    })
    
    // Return the highest scoring option
    scoredOptions.sort((a, b) => b.score - a.score)
    return scoredOptions[0]?.option || null
  }

  private analyzeOpportunity(option: OptionContract, stock: any): AIOpportunity {
    const reasons: string[] = []
    const warnings: string[] = []
    let aiScore = 0
    
    // Analyze ROI
    if (option.roi >= 3 && option.roi <= 6) {
      reasons.push(`Strong ROI of ${option.roi.toFixed(1)}%`)
      aiScore += 25
    } else if (option.roi >= 2) {
      reasons.push(`Good ROI of ${option.roi.toFixed(1)}%`)
      aiScore += 20
    } else {
      warnings.push(`Low ROI of ${option.roi.toFixed(1)}%`)
    }
    
    // Analyze DTE
    if (option.dte >= 14 && option.dte <= 30) {
      reasons.push(`Optimal time to expiry (${option.dte} days)`)
      aiScore += 20
    } else if (option.dte >= 7 && option.dte <= 45) {
      reasons.push(`Reasonable time to expiry (${option.dte} days)`)
      aiScore += 15
    } else {
      warnings.push(`Suboptimal time to expiry (${option.dte} days)`)
    }
    
    // Analyze distance from current price
    const distance = Math.abs(option.distance)
    if (distance >= 2 && distance <= 5) {
      reasons.push(`Good distance from current price (${distance.toFixed(1)}%)`)
      aiScore += 20
    } else if (distance >= 1 && distance <= 8) {
      reasons.push(`Reasonable distance from current price (${distance.toFixed(1)}%)`)
      aiScore += 15
    } else {
      warnings.push(`Extreme distance from current price (${distance.toFixed(1)}%)`)
    }
    
    // Analyze volume
    if (option.volume > 1000) {
      reasons.push(`High volume (${option.volume.toLocaleString()})`)
      aiScore += 15
    } else if (option.volume > 100) {
      reasons.push(`Decent volume (${option.volume.toLocaleString()})`)
      aiScore += 10
    } else {
      warnings.push(`Low volume (${option.volume.toLocaleString()})`)
    }
    
    // Analyze Greeks if available
    if (option.delta && option.delta >= -0.3 && option.delta <= -0.1) {
      reasons.push(`Good delta for CSP (${option.delta.toFixed(2)})`)
      aiScore += 10
    }
    
    if (option.iv && option.iv >= 0.2 && option.iv <= 0.5) {
      reasons.push(`Reasonable IV (${(option.iv * 100).toFixed(1)}%)`)
      aiScore += 10
    } else if (option.iv && option.iv > 0.5) {
      warnings.push(`High IV (${(option.iv * 100).toFixed(1)}%)`)
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'medium'
    if (aiScore >= 80 && warnings.length === 0) riskLevel = 'low'
    else if (aiScore < 60 || warnings.length > 2) riskLevel = 'high'
    
    // Determine strategy
    const strategy = option.distance < 0 ? 'CSP' : 'Covered Call'
    
    // Calculate expected return
    const expectedReturn = option.roi * (option.dte / 30) // Monthly return
    
    return {
      id: `${option.underlying}-${option.strike}-${option.expiration}`,
      symbol: option.underlying,
      name: this.getCompanyName(option.underlying),
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      opportunity: option,
      aiScore: Math.min(100, Math.max(0, aiScore)),
      reasons,
      warnings,
      strategy,
      riskLevel,
      timeToExpiry: `${option.dte} days`,
      expectedReturn: Math.round(expectedReturn * 100) / 100,
      probabilityOfProfit: option.pop
    }
  }

  private getCompanyName(symbol: string): string {
    const names: Record<string, string> = {
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corp.',
      'MSFT': 'Microsoft Corp.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms',
      'GOOGL': 'Alphabet Inc.',
      'NFLX': 'Netflix Inc.',
      'AMD': 'Advanced Micro Devices',
      'INTC': 'Intel Corp.',
      'CRM': 'Salesforce Inc.',
      'ADBE': 'Adobe Inc.',
      'PYPL': 'PayPal Holdings',
      'UBER': 'Uber Technologies',
      'LYFT': 'Lyft Inc.',
      'ROKU': 'Roku Inc.',
      'SQ': 'Block Inc.',
      'SHOP': 'Shopify Inc.'
    }
    return names[symbol] || symbol
  }
}

export const aiOpportunityFinder = new AIOpportunityFinder()
