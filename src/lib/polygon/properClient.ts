/**
 * SIMPLIFIED POLYGON CLIENT - NO CIRCUIT BREAKERS
 * Just basic rate limiting that actually works
 */

export class PolygonClient {
  private static instance: PolygonClient
  private apiKey: string
  private lastCallTime: number = 0
  private readonly MIN_DELAY_MS = 30000 // 30 seconds between calls (ultra conservative)
  
  private constructor() {
    this.apiKey = process.env.POLYGON_API_KEY || process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
    if (!this.apiKey) {
      console.error('[POLYGON] WARNING: No API key found!')
    }
  }
  
  static getInstance(): PolygonClient {
    if (!PolygonClient.instance) {
      PolygonClient.instance = new PolygonClient()
    }
    return PolygonClient.instance
  }
  
  /**
   * Simple rate limiting - just wait 15 seconds between ANY calls
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCallTime
    
    if (timeSinceLastCall < this.MIN_DELAY_MS) {
      const waitTime = this.MIN_DELAY_MS - timeSinceLastCall
      console.log(`[RATE LIMIT] Waiting ${Math.round(waitTime/1000)}s before next call`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastCallTime = Date.now()
  }
  
  /**
   * Get stock price - simplified, no circuit breaker
   */
  async getStockPrice(ticker: string): Promise<number> {
    await this.waitForRateLimit()
    
    try {
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${this.apiKey}`
      console.log(`[POLYGON] Fetching price for ${ticker}`)
      
      const response = await fetch(url)
      
      if (response.status === 429) {
        console.warn(`[POLYGON] 429 for ${ticker} - backing off`)
        await new Promise(resolve => setTimeout(resolve, 60000)) // Wait 60s on 429
        return 0
      }
      
      if (!response.ok) {
        console.error(`[POLYGON] HTTP ${response.status} for ${ticker}`)
        return 0
      }
      
      const data = await response.json()
      const price = data.results?.[0]?.c || 0
      console.log(`[POLYGON] ${ticker} price: $${price}`)
      return price
      
    } catch (error) {
      console.error(`[POLYGON] Error fetching price for ${ticker}:`, error)
      return 0
    }
  }
  
  /**
   * Get options chain - simplified, no circuit breaker
   */
  async getOptionsChain(ticker: string): Promise<any[]> {
    await this.waitForRateLimit()
    
    try {
      const url = `https://api.polygon.io/v3/snapshot/options/${ticker}?apiKey=${this.apiKey}`
      console.log(`[POLYGON] Fetching options for ${ticker}`)
      
      const response = await fetch(url)
      
      if (response.status === 429) {
        console.warn(`[POLYGON] 429 for ${ticker} options - backing off`)
        await new Promise(resolve => setTimeout(resolve, 60000)) // Wait 60s on 429
        return []
      }
      
      if (!response.ok) {
        console.error(`[POLYGON] HTTP ${response.status} for ${ticker} options`)
        return []
      }
      
      const data = await response.json()
      const results = data.results || []
      console.log(`[POLYGON] ${ticker} has ${results.length} options`)
      return results
      
    } catch (error) {
      console.error(`[POLYGON] Error fetching options for ${ticker}:`, error)
      return []
    }
  }
}
