// Whale Trade Detection
// Flags individual contracts with >10k volume in a single day

interface WhaleTrade {
  symbol: string
  strike: number
  expiry: string
  contractType: 'call' | 'put'
  volume: number
  openInterest: number
  volumeToOI: number // volume / OI ratio
  premium: number
  totalNotionalValue: number // volume × premium × 100
  impliedVolatility?: number
  detectedAt: string
  isLikelyInstitutional: boolean
}

export class WhaleTracker {
  private static instance: WhaleTracker
  private static readonly WHALE_THRESHOLD = 10000 // 10k+ contracts = whale
  private static readonly MEGA_WHALE_THRESHOLD = 50000 // 50k+ = mega whale
  
  private constructor() {}
  
  static getInstance(): WhaleTracker {
    if (!WhaleTracker.instance) {
      WhaleTracker.instance = new WhaleTracker()
    }
    return WhaleTracker.instance
  }
  
  /**
   * Detect whale trades from opportunities
   */
  detectWhaleTrades(opportunities: any[]): WhaleTrade[] {
    const whaleTrades: WhaleTrade[] = []
    
    for (const opp of opportunities) {
      // Skip if volume below threshold
      if (opp.volume < WhaleTracker.WHALE_THRESHOLD) continue
      
      const volumeToOI = opp.openInterest > 0 ? opp.volume / opp.openInterest : 0
      const totalNotionalValue = opp.volume * opp.premium * 100 // Each contract = 100 shares
      
      // Determine if likely institutional based on:
      // 1. Very high volume (>50k)
      // 2. Volume > 50% of OI (suggests new position, not just daytrading)
      // 3. High notional value (>$1M)
      const isLikelyInstitutional = (
        opp.volume >= WhaleTracker.MEGA_WHALE_THRESHOLD ||
        volumeToOI > 0.5 ||
        totalNotionalValue > 1000000
      )
      
      whaleTrades.push({
        symbol: opp.symbol,
        strike: opp.strike,
        expiry: opp.expiry,
        contractType: opp.strategy.includes('Put') ? 'put' : 'call',
        volume: opp.volume,
        openInterest: opp.openInterest,
        volumeToOI,
        premium: opp.premium,
        totalNotionalValue,
        impliedVolatility: opp.ivRank,
        detectedAt: new Date().toISOString(),
        isLikelyInstitutional
      })
    }
    
    // Sort by notional value (biggest bets first)
    return whaleTrades.sort((a, b) => b.totalNotionalValue - a.totalNotionalValue)
  }
  
  /**
   * Get whale trade summary stats
   */
  getWhaleStats(whaleTrades: WhaleTrade[]): {
    totalTrades: number
    institutionalTrades: number
    totalNotional: number
    avgNotional: number
    largestTrade: WhaleTrade | null
  } {
    if (whaleTrades.length === 0) {
      return {
        totalTrades: 0,
        institutionalTrades: 0,
        totalNotional: 0,
        avgNotional: 0,
        largestTrade: null
      }
    }
    
    const totalNotional = whaleTrades.reduce((sum, trade) => sum + trade.totalNotionalValue, 0)
    const institutionalTrades = whaleTrades.filter(t => t.isLikelyInstitutional).length
    
    return {
      totalTrades: whaleTrades.length,
      institutionalTrades,
      totalNotional,
      avgNotional: totalNotional / whaleTrades.length,
      largestTrade: whaleTrades[0] // Already sorted by notional
    }
  }
}
