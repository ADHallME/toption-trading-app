// Unusual Volume Detection
// Flags options with volume > 2x their 20-day average

interface VolumeData {
  current: number
  avg20Day: number
  percentAboveAvg: number
}

interface UnusualVolumeOpportunity {
  symbol: string
  strike: number
  expiry: string
  contractType: 'call' | 'put'
  currentVolume: number
  avg20DayVolume: number
  volumeRatio: number // current / average
  percentAboveAvg: number
  openInterest: number
  premium: number
  impliedVolatility?: number
  detectedAt: string
}

export class VolumeAnalyzer {
  private static instance: VolumeAnalyzer
  private volumeHistory: Map<string, number[]> = new Map() // stores last 20 days
  
  private constructor() {}
  
  static getInstance(): VolumeAnalyzer {
    if (!VolumeAnalyzer.instance) {
      VolumeAnalyzer.instance = new VolumeAnalyzer()
    }
    return VolumeAnalyzer.instance
  }
  
  /**
   * Record daily volume for a contract
   */
  recordVolume(contractKey: string, volume: number) {
    const history = this.volumeHistory.get(contractKey) || []
    history.push(volume)
    
    // Keep only last 20 days
    if (history.length > 20) {
      history.shift()
    }
    
    this.volumeHistory.set(contractKey, history)
  }
  
  /**
   * Calculate 20-day average volume
   */
  private getAverage20DayVolume(contractKey: string): number {
    const history = this.volumeHistory.get(contractKey) || []
    if (history.length === 0) return 0
    
    const sum = history.reduce((acc, vol) => acc + vol, 0)
    return sum / history.length
  }
  
  /**
   * Detect unusual volume (>2x average)
   */
  isUnusualVolume(contractKey: string, currentVolume: number): {
    isUnusual: boolean
    avg20Day: number
    percentAboveAvg: number
    volumeRatio: number
  } {
    const avg20Day = this.getAverage20DayVolume(contractKey)
    
    // Need at least 10 days of history to be confident
    const history = this.volumeHistory.get(contractKey) || []
    if (history.length < 10) {
      return { isUnusual: false, avg20Day: 0, percentAboveAvg: 0, volumeRatio: 1 }
    }
    
    const volumeRatio = avg20Day > 0 ? currentVolume / avg20Day : 1
    const percentAboveAvg = ((currentVolume - avg20Day) / avg20Day) * 100
    
    // Flag if volume is 2x or more above average
    const isUnusual = volumeRatio >= 2.0
    
    return { isUnusual, avg20Day, percentAboveAvg, volumeRatio }
  }
  
  /**
   * Scan all opportunities and return those with unusual volume
   */
  detectUnusualVolume(opportunities: any[]): UnusualVolumeOpportunity[] {
    const unusual: UnusualVolumeOpportunity[] = []
    
    for (const opp of opportunities) {
      const contractKey = `${opp.symbol}_${opp.strike}_${opp.expiry}`
      
      // Record this volume for future comparisons
      this.recordVolume(contractKey, opp.volume)
      
      // Check if unusual
      const volumeAnalysis = this.isUnusualVolume(contractKey, opp.volume)
      
      if (volumeAnalysis.isUnusual) {
        unusual.push({
          symbol: opp.symbol,
          strike: opp.strike,
          expiry: opp.expiry,
          contractType: opp.strategy.includes('Put') ? 'put' : 'call',
          currentVolume: opp.volume,
          avg20DayVolume: volumeAnalysis.avg20Day,
          volumeRatio: volumeAnalysis.volumeRatio,
          percentAboveAvg: volumeAnalysis.percentAboveAvg,
          openInterest: opp.openInterest,
          premium: opp.premium,
          impliedVolatility: opp.ivRank,
          detectedAt: new Date().toISOString()
        })
      }
    }
    
    // Sort by volume ratio (highest first)
    return unusual.sort((a, b) => b.volumeRatio - a.volumeRatio)
  }
}
