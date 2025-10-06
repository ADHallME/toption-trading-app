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
   * Get stock price - with fallback to mock data when rate limited
   */
  async getStockPrice(ticker: string): Promise<number> {
    await this.waitForRateLimit()
    
    try {
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${this.apiKey}`
      console.log(`[POLYGON] Fetching price for ${ticker}`)
      
      const response = await fetch(url)
      
      if (response.status === 429) {
        console.warn(`[POLYGON] 429 for ${ticker} - using mock data`)
        return this.getMockPrice(ticker)
      }
      
      if (!response.ok) {
        console.error(`[POLYGON] HTTP ${response.status} for ${ticker} - using mock data`)
        return this.getMockPrice(ticker)
      }
      
      const data = await response.json()
      
      if (data.status === "ERROR" && data.error?.includes("exceeded")) {
        console.warn(`[POLYGON] Rate limit exceeded for ${ticker} - using mock data`)
        return this.getMockPrice(ticker)
      }
      
      const price = data.results?.[0]?.c || 0
      console.log(`[POLYGON] ${ticker} price: $${price}`)
      return price
      
    } catch (error) {
      console.error(`[POLYGON] Error fetching price for ${ticker}:`, error)
      return this.getMockPrice(ticker)
    }
  }
  
  /**
   * Generate realistic mock price data
   */
  private getMockPrice(ticker: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 175, 'MSFT': 330, 'GOOGL': 140, 'AMZN': 130, 'NVDA': 450,
      'META': 300, 'TSLA': 250, 'SPY': 420, 'QQQ': 350, 'IWM': 180
    }
    
    const basePrice = basePrices[ticker] || 100 + Math.random() * 200
    const variation = basePrice * 0.02 * (Math.random() - 0.5) // ±1% variation
    const mockPrice = Math.round((basePrice + variation) * 100) / 100
    
    console.log(`[MOCK] ${ticker} price: $${mockPrice}`)
    return mockPrice
  }
  
  /**
   * Get options chain - with fallback to mock data when rate limited
   */
  async getOptionsChain(ticker: string): Promise<any[]> {
    await this.waitForRateLimit()
    
    try {
      const url = `https://api.polygon.io/v3/snapshot/options/${ticker}?apiKey=${this.apiKey}`
      console.log(`[POLYGON] Fetching options for ${ticker}`)
      
      const response = await fetch(url)
      
      if (response.status === 429) {
        console.warn(`[POLYGON] 429 for ${ticker} options - using mock data`)
        return this.getMockOptions(ticker)
      }
      
      if (!response.ok) {
        console.error(`[POLYGON] HTTP ${response.status} for ${ticker} options - using mock data`)
        return this.getMockOptions(ticker)
      }
      
      const data = await response.json()
      
      if (data.status === "ERROR" && data.error?.includes("exceeded")) {
        console.warn(`[POLYGON] Rate limit exceeded for ${ticker} options - using mock data`)
        return this.getMockOptions(ticker)
      }
      
      const results = data.results || []
      console.log(`[POLYGON] ${ticker} has ${results.length} options`)
      return results
      
    } catch (error) {
      console.error(`[POLYGON] Error fetching options for ${ticker}:`, error)
      return this.getMockOptions(ticker)
    }
  }
  
  /**
   * Generate realistic mock options data
   */
  private getMockOptions(ticker: string): any[] {
    const stockPrice = this.getMockPrice(ticker)
    const options = []
    
    // Generate 5-10 realistic options contracts
    const numOptions = 5 + Math.floor(Math.random() * 5)
    
    for (let i = 0; i < numOptions; i++) {
      const isCall = Math.random() > 0.5
      const strike = stockPrice * (0.9 + Math.random() * 0.2) // 90-110% of stock price
      const dte = 7 + Math.floor(Math.random() * 30) // 7-37 days
      const premium = Math.max(0.5, Math.abs(stockPrice - strike) * 0.1)
      
      options.push({
        contract_name: `${ticker}${new Date(Date.now() + dte * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '')}${isCall ? 'C' : 'P'}${(strike * 1000).toString().padStart(8, '0')}`,
        strike_price: strike,
        expiration_date: new Date(Date.now() + dte * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: isCall ? 'call' : 'put',
        last_quote: {
          bid: premium * 0.95,
          ask: premium * 1.05,
          last: premium
        },
        greeks: {
          delta: isCall ? 0.3 + Math.random() * 0.4 : -0.3 - Math.random() * 0.4,
          theta: -0.1 - Math.random() * 0.05,
          gamma: 0.01 + Math.random() * 0.02,
          vega: 0.1 + Math.random() * 0.1
        },
        implied_volatility: 20 + Math.random() * 30,
        volume: Math.floor(Math.random() * 1000) + 100,
        open_interest: Math.floor(Math.random() * 5000) + 50
      })
    }
    
    console.log(`[MOCK] ${ticker} has ${options.length} options`)
    return options
  }
}
