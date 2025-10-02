// Real Polygon Options Data Fetcher
// Uses /v3/snapshot/options endpoint for actual market data

interface PolygonOptionSnapshot {
  underlying_asset: {
    ticker: string
  }
  details: {
    contract_type: string
    exercise_style: string
    expiration_date: string
    strike_price: number
    ticker: string
  }
  greeks?: {
    delta: number
    gamma: number
    theta: number
    vega: number
  }
  implied_volatility?: number
  last_quote: {
    bid: number
    ask: number
    bid_size: number
    ask_size: number
  }
  day: {
    volume: number
    open: number
    high: number
    low: number
    close: number
  }
  open_interest: number
}

interface OptionsOpportunity {
  id: string
  symbol: string
  strategy: string
  strike: number
  expiry: string
  dte: number
  premium: number
  capitalRequired: number
  roi: number
  roiPerDay: number
  pop: number
  risk: 'low' | 'medium' | 'high'
  ivRank: number
  category: 'market-movers' | 'high-iv' | 'conservative' | 'earnings'
  volume: number
  openInterest: number
  
  // Additional real data
  bid: number
  ask: number
  delta?: number
  theta?: number
  gamma?: number
  vega?: number
  stockPrice?: number
}

export class PolygonOptionsService {
  private static instance: PolygonOptionsService
  private apiKey: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheDuration = 5 * 60 * 1000 // 5 minutes
  
  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
  }
  
  static getInstance(): PolygonOptionsService {
    if (!PolygonOptionsService.instance) {
      PolygonOptionsService.instance = new PolygonOptionsService()
    }
    return PolygonOptionsService.instance
  }
  
  /**
   * Calculate days to expiration
   */
  private calculateDTE(expirationDate: string): number {
    const expiry = new Date(expirationDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }
  
  /**
   * Fetch options snapshot for a single ticker
   */
  async fetchOptionsChain(ticker: string): Promise<PolygonOptionSnapshot[]> {
    // Check cache
    const cacheKey = `options_${ticker}`
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data
    }
    
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/snapshot/options/${ticker}?apiKey=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`)
      }
      
      const data = await response.json()
      const results = data.results || []
      
      console.log(`[DEBUG] ${ticker}: Polygon returned ${results.length} options`)
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      })
      
      return results
    } catch (error) {
      console.error(`Error fetching options for ${ticker}:`, error)
      return []
    }
  }
  
  /**
   * Get stock price for calculating distance from strike
   */
  async getStockPrice(ticker: string): Promise<number> {
    const cacheKey = `stock_${ticker}`
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data
    }
    
    try {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock price for ${ticker}`)
      }
      
      const data = await response.json()
      const price = data.results?.[0]?.c || 0
      
      this.cache.set(cacheKey, {
        data: price,
        timestamp: Date.now()
      })
      
      return price
    } catch (error) {
      console.error(`Error fetching stock price for ${ticker}:`, error)
      return 0
    }
  }
  
  /**
   * Convert raw option data to opportunity format
   */
  private async convertToOpportunity(
    option: PolygonOptionSnapshot,
    stockPrice: number,
    category: OptionsOpportunity['category']
  ): Promise<OptionsOpportunity | null> {
    const dte = this.calculateDTE(option.details.expiration_date)
    
    // Skip if expired or too far out
    if (dte <= 0 || dte > 60) {
      return null
    }
    
    // Calculate premium (midpoint of bid/ask)
    const bid = option.last_quote.bid || 0
    const ask = option.last_quote.ask || 0
    
    // Skip if BOTH bid and ask are 0 (but warn about it)
    if (bid === 0 && ask === 0) {
      return null
    }
    
    const premium = (bid + ask) / 2
    
    // For puts: capital = strike * 100
    // For calls: capital = stock price * 100 (covered call)
    const strike = option.details.strike_price
    const isPut = option.details.contract_type === 'put'
    const capitalRequired = isPut ? strike * 100 : stockPrice * 100
    
    // Calculate ROI
    const roi = (premium * 100) / capitalRequired
    const roiPerDay = roi / dte
    
    // No ROI filter - just sort by best ROI later
    
    // Calculate probability of profit (simplified using delta)
    const delta = option.greeks?.delta || 0
    const pop = isPut ? (1 - Math.abs(delta)) * 100 : Math.abs(delta) * 100
    
    // Calculate distance from strike
    const distance = isPut 
      ? ((stockPrice - strike) / stockPrice) * 100
      : ((strike - stockPrice) / stockPrice) * 100
    
    // Determine risk level
    let risk: 'low' | 'medium' | 'high'
    if (Math.abs(distance) > 10) risk = 'low'
    else if (Math.abs(distance) > 5) risk = 'medium'
    else risk = 'high'
    
    return {
      id: `${option.details.ticker}_${Date.now()}`,
      symbol: option.underlying_asset.ticker,
      strategy: isPut ? 'Cash Secured Put' : 'Covered Call',
      strike,
      expiry: option.details.expiration_date,
      dte,
      premium: Number(premium.toFixed(2)),
      capitalRequired,
      roi: Number(roi.toFixed(4)),
      roiPerDay: Number(roiPerDay.toFixed(4)),
      pop: Number(pop.toFixed(1)),
      risk,
      ivRank: option.implied_volatility ? Number((option.implied_volatility * 100).toFixed(1)) : 0,
      category,
      volume: option.day.volume,
      openInterest: option.open_interest,
      bid,
      ask,
      delta: option.greeks?.delta,
      theta: option.greeks?.theta,
      gamma: option.greeks?.gamma,
      vega: option.greeks?.vega,
      stockPrice
    }
  }
  
  /**
   * Get opportunities for multiple tickers
   */
  async getOpportunitiesForTickers(
    tickers: string[],
    filters: {
      minOI?: number
      minDTE?: number
      maxDTE?: number
      minROIPerDay?: number
    } = {},
    onProgress?: (scanned: number, total: number) => void
  ): Promise<OptionsOpportunity[]> {
    const {
      minOI = 10,
      minDTE = 1,
      maxDTE = 60,
      minROIPerDay = 0.01
    } = filters
    
    const allOpportunities: OptionsOpportunity[] = []
    
    console.log(`[DEBUG] Starting scan with filters: minOI=${minOI}, DTE=${minDTE}-${maxDTE}, minROIPerDay=${minROIPerDay}`)
    
    // Fetch options for each ticker
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i]
      let tickerStats = { total: 0, passedOI: 0, passedDTE: 0, passedBidAsk: 0, opportunities: 0 }
      
      try {
        const stockPrice = await this.getStockPrice(ticker)
        if (stockPrice === 0) continue
        
        const options = await this.fetchOptionsChain(ticker)
        tickerStats.total = options.length
        
        for (const option of options) {
          // Filter by open interest
          if (option.open_interest < minOI) continue
          tickerStats.passedOI++
          
          // Determine category based on characteristics
          let category: OptionsOpportunity['category'] = 'conservative'
          
          if (option.day.volume > 1000) {
            category = 'market-movers'
          } else if (option.implied_volatility && option.implied_volatility > 0.5) {
            category = 'high-iv'
          } else if (option.open_interest > 500) {
            category = 'conservative'
          }
          
          const opportunity = await this.convertToOpportunity(option, stockPrice, category)
          
          if (opportunity) {
            tickerStats.opportunities++
            allOpportunities.push(opportunity)
          }
        }
        
        // Log stats if this ticker had any options
        if (tickerStats.total > 0) {
          console.log(`[DEBUG] ${ticker}: ${tickerStats.total} total → ${tickerStats.passedOI} passed OI → ${tickerStats.opportunities} opportunities`)
        }
      } catch (error) {
        console.error(`Error processing ${ticker}:`, error)
        continue
      } finally {
        // Report progress after each ticker
        if (onProgress) {
          onProgress(i + 1, tickers.length)
        }
      }
    }
    
    console.log(`[DEBUG] SCAN COMPLETE: Found ${allOpportunities.length} total opportunities from ${tickers.length} tickers`)
    
    // Sort by ROI per day (highest first)
    return allOpportunities.sort((a, b) => b.roiPerDay - a.roiPerDay)
  }
  
  /**
   * Get opportunities by category
   */
  async getOpportunitiesByCategory(
    tickers: string[],
    category: OptionsOpportunity['category'],
    limit: number = 50
  ): Promise<OptionsOpportunity[]> {
    const allOpportunities = await this.getOpportunitiesForTickers(tickers)
    
    return allOpportunities
      .filter(opp => opp.category === category)
      .slice(0, limit)
  }
}

export default PolygonOptionsService
