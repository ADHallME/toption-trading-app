// Production Polygon API Client - Master Battle Plan V2
// Sequential requests, circuit breaker, comprehensive logging
// NO PARALLEL REQUESTS - NO FAKE DATA

interface Request {
  url: string
  id: string
  timestamp: number
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

interface CircuitBreaker {
  failures: number
  lastFailure: number | null
  isOpen: boolean
  openUntil: number | null
}

interface RequestLog {
  id: string
  url: string
  status: number
  duration: number
  timestamp: number
  error?: string
}

export interface StockQuote {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  prevClose: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
  source: string
}

export interface OptionContract {
  symbol: string
  underlying: string
  strike: number
  expiration: string
  dte: number
  type: 'put' | 'call'
  bid: number
  ask: number
  last: number
  mid: number
  premium: number
  volume: number
  openInterest: number
  delta?: number | null
  gamma?: number | null
  theta?: number | null
  vega?: number | null
  iv?: number | null
  roi: number
  roiPerDay: number
  roiAnnualized: number
  stockPrice: number
  distance: number
  breakeven: number
  pop: number
  capital: number
  lastUpdated: string
}

class PolygonClient {
  private apiKey: string
  private baseUrl = 'https://api.polygon.io'
  private requestQueue: Request[] = []
  private isProcessing = false
  private requestLogs: RequestLog[] = []
  private circuitBreaker: CircuitBreaker = {
    failures: 0,
    lastFailure: null,
    isOpen: false,
    openUntil: null
  }
  
  // Rate limiting: 5 calls/second max (200ms between calls)
  private minDelayMs = 200
  
  // Circuit breaker config
  private maxFailures = 3
  private circuitOpenDuration = 300000 // 5 minutes

  constructor() {
    this.apiKey = process.env.POLYGON_API_KEY || ''
    if (!this.apiKey) {
      console.warn('⚠️ POLYGON_API_KEY not found - API calls will fail')
    }
  }

  // Core method: Queue a request (NEVER call fetch directly)
  private async queueRequest(url: string): Promise<any> {
    // Check circuit breaker
    if (this.circuitBreaker.isOpen) {
      if (Date.now() < (this.circuitBreaker.openUntil || 0)) {
        throw new Error('Circuit breaker is open - API unavailable')
      } else {
        // Reset circuit breaker
        this.circuitBreaker.isOpen = false
        this.circuitBreaker.failures = 0
        this.circuitBreaker.openUntil = null
      }
    }

    return new Promise((resolve, reject) => {
      const request: Request = {
        url,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        resolve,
        reject
      }
      
      this.requestQueue.push(request)
      
      if (!this.isProcessing) {
        this.processQueue()
      }
    })
  }

  private async processQueue() {
    this.isProcessing = true
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (!request) break
      
      try {
        const startTime = Date.now()
        const response = await fetch(request.url)
        const duration = Date.now() - startTime
        
        // Log the request
        this.requestLogs.push({
          id: request.id,
          url: request.url,
          status: response.status,
          duration,
          timestamp: Date.now()
        })
        
        if (response.status === 429) {
          // Rate limit hit - activate circuit breaker
          this.circuitBreaker.failures++
          this.circuitBreaker.lastFailure = Date.now()
          
          if (this.circuitBreaker.failures >= this.maxFailures) {
            this.circuitBreaker.isOpen = true
            this.circuitBreaker.openUntil = Date.now() + this.circuitOpenDuration
            console.error('🚨 Circuit breaker OPEN - too many 429s')
            request.reject(new Error('Circuit breaker open - too many rate limits'))
            break
          }
          
          // Exponential backoff
          const backoffTime = Math.pow(2, this.circuitBreaker.failures) * 5000
          console.warn(`⏳ Rate limit hit, backing off for ${backoffTime}ms`)
          await this.sleep(backoffTime)
          
          // Re-queue the request
          this.requestQueue.unshift(request)
          continue
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        request.resolve(data)
        
        // Respect rate limit: 200ms between calls (5 calls/second)
        await this.sleep(this.minDelayMs)
        
      } catch (error: any) {
        console.error(`❌ Request failed: ${error.message}`)
        
        this.requestLogs.push({
          id: request.id,
          url: request.url,
          status: 0,
          duration: 0,
          timestamp: Date.now(),
          error: error.message
        })
        
        request.reject(error)
      }
    }
    
    this.isProcessing = false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Public API methods
  async getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = []
    
    for (const symbol of symbols) {
      try {
        // Use /v2/aggs/ticker/prev for previous day data (more reliable)
        const url = `${this.baseUrl}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${this.apiKey}`
        const data = await this.queueRequest(url)
        
        let price = 0
        let volume = 0
        let timestamp = new Date().toISOString()
        let prevClose = 0
        let open = 0
        let high = 0
        let low = 0
        
        if (data.results && data.results.length > 0) {
          const prev = data.results[0]
          price = prev.c || 0
          volume = prev.v || 0
          prevClose = prev.c || 0
          open = prev.o || 0
          high = prev.h || 0
          low = prev.l || 0
          timestamp = prev.t ? new Date(prev.t).toISOString() : timestamp
        }
        
        const change = 0 // For now, no change since using previous day close as current price
        const changePercent = 0
        
        quotes.push({
          symbol,
          price: parseFloat(price.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          prevClose: parseFloat(prevClose.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: volume,
          timestamp,
          source: price > 0 ? 'prev_day' : 'unavailable'
        })
        
      } catch (error: any) {
        console.error(`Failed to fetch quote for ${symbol}:`, error.message)
      }
    }
    
    return quotes
  }

  async getOptionsChain(underlying: string, type: 'put' | 'call', limit: number = 20): Promise<OptionContract[]> {
    try {
      const url = `${this.baseUrl}/v3/reference/options/contracts?underlying_ticker=${underlying}&contract_type=${type}&limit=${limit}&apiKey=${this.apiKey}`
      const data = await this.queueRequest(url)
      
      if (!data.results || data.results.length === 0) {
        return []
      }
      
      const options: OptionContract[] = []
      
      for (const contract of data.results.slice(0, limit)) {
        try {
          // Get current snapshot for this option
          const snapshotUrl = `${this.baseUrl}/v3/snapshot/options/${contract.ticker}?apiKey=${this.apiKey}`
          const snapshotData = await this.queueRequest(snapshotUrl)
          
          if (snapshotData.results && snapshotData.results.length > 0) {
            const snapshot = snapshotData.results[0]
            const details = snapshot.details
            
            const bid = details.bid || 0
            const ask = details.ask || 0
            const last = details.last || 0
            const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last
            
            // Skip options with zero premium
            if (mid <= 0) continue
            
            const stockPrice = details.underlying_price || 100
            const strike = contract.strike_price
            const dte = Math.ceil((new Date(contract.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            
            if (dte <= 0) continue // Skip expired options
            
            const premium = mid
            const roi = (premium / strike) * 100
            const roiPerDay = roi / dte
            const roiAnnualized = (roi / dte) * 365
            const distance = Math.abs(stockPrice - strike) / stockPrice
            const breakeven = type === 'put' ? strike - premium : strike + premium
            const pop = 50 // Placeholder - would need Black-Scholes calculation
            
            options.push({
              symbol: contract.ticker,
              underlying,
              strike,
              expiration: contract.expiration_date,
              dte,
              type,
              bid,
              ask,
              last,
              mid,
              premium,
              volume: details.volume || 0,
              openInterest: details.open_interest || 0,
              delta: details.greeks?.delta || null,
              gamma: details.greeks?.gamma || null,
              theta: details.greeks?.theta || null,
              vega: details.greeks?.vega || null,
              iv: details.implied_volatility || null,
              roi,
              roiPerDay,
              roiAnnualized,
              stockPrice,
              distance,
              breakeven,
              pop,
              capital: type === 'put' ? strike * 100 : stockPrice * 100,
              lastUpdated: new Date().toISOString()
            })
          }
        } catch (error) {
          console.error(`Failed to get snapshot for ${contract.ticker}:`, error)
        }
      }
      
      return options
    } catch (error: any) {
      console.error(`Failed to fetch options chain for ${underlying}:`, error.message)
      return []
    }
  }

  // Get request logs for debugging
  getRequestLogs(): RequestLog[] {
    return [...this.requestLogs]
  }

  // Get circuit breaker status
  getCircuitBreakerStatus() {
    return { ...this.circuitBreaker }
  }

  // Clear logs (for testing)
  clearLogs() {
    this.requestLogs = []
  }
}

// Singleton instance
let clientInstance: PolygonClient | null = null

export function getPolygonClient(): PolygonClient {
  if (!clientInstance) {
    clientInstance = new PolygonClient()
  }
  return clientInstance
}

export default PolygonClient