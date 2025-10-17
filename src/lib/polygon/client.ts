// Production Polygon API Client
// Sequential requests, circuit breaker, comprehensive logging
// NO PARALLEL REQUESTS - NO FAKE DATA

interface Request {
  url: string
  id: string
  timestamp: number
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
      const now = Date.now()
      if (this.circuitBreaker.openUntil && now < this.circuitBreaker.openUntil) {
        const waitTime = Math.ceil((this.circuitBreaker.openUntil - now) / 1000)
        throw new Error(`Circuit breaker OPEN - wait ${waitTime}s`)
      } else {
        // Reset circuit breaker
        this.circuitBreaker.isOpen = false
        this.circuitBreaker.failures = 0
        this.circuitBreaker.openUntil = null
        console.log('✅ Circuit breaker RESET')
      }
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const request: Request = {
      url,
      id: requestId,
      timestamp: Date.now()
    }

    // Add to queue
    this.requestQueue.push(request)

    // Start processing if not already processing
    if (!this.isProcessing) {
      this.processQueue()
    }

    // Wait for this specific request to complete
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const log = this.requestLogs.find(l => l.id === requestId)
        if (log) {
          clearInterval(checkInterval)
          if (log.error) {
            reject(new Error(log.error))
          } else {
            resolve((log as any).data)
          }
        }
      }, 50)
    })
  }

  // Process queue sequentially (ONE at a time)
  private async processQueue() {
    if (this.isProcessing) return
    this.isProcessing = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (!request) break

      const startTime = Date.now()
      let status = 0
      let error: string | undefined
      let data: any = null

      try {
        console.log(`🔄 [${request.id}] Fetching: ${request.url}`)
        
        const response = await fetch(request.url)
        status = response.status

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit hit
            this.circuitBreaker.failures++
            this.circuitBreaker.lastFailure = Date.now()
            
            console.error(`❌ [${request.id}] 429 Rate Limit (failure ${this.circuitBreaker.failures}/${this.maxFailures})`)

            if (this.circuitBreaker.failures >= this.maxFailures) {
              // Open circuit breaker
              this.circuitBreaker.isOpen = true
              this.circuitBreaker.openUntil = Date.now() + this.circuitOpenDuration
              console.error(`🚨 CIRCUIT BREAKER OPEN - Stopping for 5 minutes`)
              
              error = 'Circuit breaker open - too many 429 errors'
            } else {
              // Exponential backoff
              const backoffTime = Math.pow(2, this.circuitBreaker.failures) * 5000
              console.log(`⏳ Backing off for ${backoffTime}ms`)
              await this.sleep(backoffTime)
              
              // Re-queue this request
              this.requestQueue.unshift(request)
              continue
            }
          } else {
            error = `HTTP ${response.status}: ${response.statusText}`
          }
        } else {
          // Success!
          data = await response.json()
          this.circuitBreaker.failures = 0 // Reset on success
          console.log(`✅ [${request.id}] Success in ${Date.now() - startTime}ms`)
        }

      } catch (err: any) {
        status = 0
        error = err.message
        console.error(`❌ [${request.id}] Error: ${error}`)
      }

      const duration = Date.now() - startTime

      // Log this request
      this.requestLogs.push({
        id: request.id,
        url: request.url,
        status,
        duration,
        timestamp: startTime,
        error,
        ...(data && { data })
      })

      // Rate limiting delay (respect 5 calls/second)
      if (!error && this.requestQueue.length > 0) {
        await this.sleep(this.minDelayMs)
      }

      // If circuit breaker opened, stop processing
      if (this.circuitBreaker.isOpen) {
        console.error(`🚨 Circuit breaker opened - clearing queue (${this.requestQueue.length} requests dropped)`)
        this.requestQueue = []
        break
      }
    }

    this.isProcessing = false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Public API: Get stock quotes (sequential, one at a time)
  async getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = []
    
    for (const symbol of symbols) {
      try {
        // Get last trade (real-time)
        const lastTradeUrl = `${this.baseUrl}/v2/last/trade/${symbol}?apiKey=${this.apiKey}`
        const lastTradeData = await this.queueRequest(lastTradeUrl)
        
        let price = 0
        let volume = 0
        let timestamp = new Date().toISOString()
        
        if (lastTradeData.results) {
          price = lastTradeData.results.p || 0
          volume = lastTradeData.results.s || 0
          timestamp = lastTradeData.results.t ? new Date(lastTradeData.results.t).toISOString() : timestamp
        }
        
        // Get previous day data for change calculations
        const prevDayUrl = `${this.baseUrl}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${this.apiKey}`
        const prevDayData = await this.queueRequest(prevDayUrl)
        
        let prevClose = price
        let open = price
        let high = price
        let low = price
        let dayVolume = volume
        
        if (prevDayData.results && prevDayData.results.length > 0) {
          const prev = prevDayData.results[0]
          prevClose = prev.c || price
          open = prev.o || price
          high = prev.h || price
          low = prev.l || price
          dayVolume = prev.v || volume
          
          if (price === 0) {
            price = prevClose
          }
        }
        
        const change = price - prevClose
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0
        
        quotes.push({
          symbol,
          price: parseFloat(price.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          prevClose: parseFloat(prevClose.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: dayVolume,
          timestamp,
          source: price > 0 ? 'last_trade' : 'prev_day'
        })
      } catch (error: any) {
        console.error(`Failed to fetch quote for ${symbol}:`, error.message)
        // Don't add to quotes array if failed - NO FAKE DATA
      }
    }
    
    return quotes
  }

  // Public API: Get options chain
  async getOptionsChain(underlying: string, type: 'put' | 'call' = 'put', maxDTE: number = 60): Promise<OptionContract[]> {
    try {
      // Get underlying stock price first
      const stockQuotes = await this.getStockQuotes([underlying])
      if (stockQuotes.length === 0) {
        throw new Error(`No stock quote found for ${underlying}`)
      }
      const stockPrice = stockQuotes[0].price
      
      // Get options contracts
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + maxDTE)
      
      const contractsUrl = `${this.baseUrl}/v3/reference/options/contracts?underlying_ticker=${underlying}&contract_type=${type}&expiration_date.gte=${today.toISOString().split('T')[0]}&expiration_date.lte=${futureDate.toISOString().split('T')[0]}&limit=100&apiKey=${this.apiKey}`
      
      const contractsData = await this.queueRequest(contractsUrl)
      
      // Get snapshot data for real-time quotes
      const snapshotUrl = `${this.baseUrl}/v3/snapshot/options/${underlying}?apiKey=${this.apiKey}`
      const snapshotData = await this.queueRequest(snapshotUrl)
      
      // Create snapshot map
      const snapshotMap = new Map()
      snapshotData.results?.forEach((snapshot: any) => {
        snapshotMap.set(snapshot.details?.ticker, snapshot)
      })
      
      // Process contracts with real data
      const options = contractsData.results?.map((contract: any) => {
        const strike = contract.strike_price
        const expDate = new Date(contract.expiration_date)
        const dte = Math.max(1, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        
        const snapshot = snapshotMap.get(contract.ticker) || {}
        const bid = snapshot.last_quote?.bid || 0
        const ask = snapshot.last_quote?.ask || 0
        const last = snapshot.last_quote?.last || snapshot.day?.close || 0
        const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last
        const premium = mid > 0 ? mid : 0 // NO FALLBACK TO FAKE DATA
        
        if (premium === 0) {
          return null // Skip options with no pricing data
        }
        
        const roi = strike > 0 ? (premium / strike) * 100 : 0
        const roiPerDay = dte > 0 ? roi / dte : 0
        const roiAnnualized = roiPerDay * 365
        const distance = ((stockPrice - strike) / stockPrice) * 100
        
        const greeks = snapshot.greeks || {}
        
        // Calculate PoP based on distance from current price
        let pop = 50
        if (type === 'put') {
          if (strike < stockPrice) {
            pop = Math.min(95, 50 + Math.abs(distance) * 2)
          } else {
            pop = Math.max(5, 50 - Math.abs(distance) * 2)
          }
        }
        
        return {
          symbol: contract.ticker,
          underlying,
          strike,
          expiration: contract.expiration_date,
          dte,
          type: contract.contract_type,
          bid,
          ask,
          last,
          mid,
          premium,
          volume: snapshot.day?.volume || 0,
          openInterest: snapshot.open_interest || 0,
          delta: greeks.delta || null,
          gamma: greeks.gamma || null,
          theta: greeks.theta || null,
          vega: greeks.vega || null,
          iv: snapshot.implied_volatility || greeks.iv || null,
          roi: parseFloat(roi.toFixed(2)),
          roiPerDay: parseFloat(roiPerDay.toFixed(4)),
          roiAnnualized: parseFloat(roiAnnualized.toFixed(2)),
          stockPrice,
          distance: parseFloat(distance.toFixed(2)),
          breakeven: type === 'put' ? strike - premium : strike + premium,
          pop: Math.round(pop),
          capital: strike * 100,
          lastUpdated: snapshot.updated || new Date().toISOString()
        }
      }).filter((opt: any) => opt !== null) || [] // Remove null entries
      
      // Sort by ROI descending
      return options.sort((a: OptionContract, b: OptionContract) => b.roi - a.roi)
      
    } catch (error: any) {
      console.error('Options chain error:', error.message)
      return [] // Return empty array - NO FAKE DATA
    }
  }

  // Get request stats (for debugging)
  getStats() {
    const now = Date.now()
    const last60s = this.requestLogs.filter(l => now - l.timestamp < 60000)
    const successful = last60s.filter(l => l.status === 200)
    const failed = last60s.filter(l => l.status !== 200)
    const avg429Count = last60s.filter(l => l.status === 429).length

    return {
      totalRequests: this.requestLogs.length,
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      circuitBreaker: this.circuitBreaker,
      last60s: {
        total: last60s.length,
        successful: successful.length,
        failed: failed.length,
        rate429: avg429Count,
        avgDuration: successful.length > 0 
          ? Math.round(successful.reduce((sum, l) => sum + l.duration, 0) / successful.length)
          : 0
      }
    }
  }

  // Clear logs (for testing)
  clearLogs() {
    this.requestLogs = []
  }
}

// Export singleton instance
let instance: PolygonClient | null = null

export function getPolygonClient(): PolygonClient {
  if (!instance) {
    instance = new PolygonClient()
  }
  return instance
}

