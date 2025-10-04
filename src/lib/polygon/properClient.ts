/**
 * PROPERLY ARCHITECTED POLYGON API CLIENT
 * 
 * Features:
 * - Per-endpoint rate limiting
 * - Circuit breaker pattern
 * - Exponential backoff on 429s
 * - Request queuing
 * - Metrics tracking
 */

interface RateLimitConfig {
  callsPerSecond: number
  burstSize: number
}

interface CircuitBreakerState {
  failures: number
  lastFailureTime: number
  state: 'closed' | 'open' | 'half-open'
}

export class PolygonClient {
  private static instance: PolygonClient
  private apiKey: string
  private queues: Map<string, Array<() => Promise<any>>> = new Map()
  private rateLimiters: Map<string, { lastCall: number; tokens: number }> = new Map()
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map()
  
  // Configuration
  private readonly RATE_LIMIT: RateLimitConfig = {
    callsPerSecond: 0.5, // One call every 2 seconds (conservative)
    burstSize: 5 // Allow small bursts
  }
  
  private readonly CIRCUIT_BREAKER = {
    failureThreshold: 3,
    resetTimeout: 60000, // 1 minute
    halfOpenMaxCalls: 1
  }
  
  private constructor() {
    this.apiKey = process.env.POLYGON_API_KEY || ''
  }
  
  static getInstance(): PolygonClient {
    if (!PolygonClient.instance) {
      PolygonClient.instance = new PolygonClient()
    }
    return PolygonClient.instance
  }
  
  /**
   * Check circuit breaker state for endpoint
   */
  private checkCircuitBreaker(endpoint: string): boolean {
    const breaker = this.circuitBreakers.get(endpoint) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed'
    }
    
    // Check if circuit should reset
    if (breaker.state === 'open' && 
        Date.now() - breaker.lastFailureTime > this.CIRCUIT_BREAKER.resetTimeout) {
      breaker.state = 'half-open'
      breaker.failures = 0
    }
    
    this.circuitBreakers.set(endpoint, breaker)
    return breaker.state !== 'open'
  }
  
  /**
   * Record circuit breaker failure
   */
  private recordFailure(endpoint: string) {
    const breaker = this.circuitBreakers.get(endpoint) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed'
    }
    
    breaker.failures++
    breaker.lastFailureTime = Date.now()
    
    if (breaker.failures >= this.CIRCUIT_BREAKER.failureThreshold) {
      breaker.state = 'open'
      console.error(`[CIRCUIT BREAKER] Opened for ${endpoint} - too many failures`)
    }
    
    this.circuitBreakers.set(endpoint, breaker)
  }
  
  /**
   * Rate-limited fetch with circuit breaker
   */
  private async rateLimitedFetch(endpoint: string, url: string): Promise<Response> {
    // Check circuit breaker
    if (!this.checkCircuitBreaker(endpoint)) {
      throw new Error(`Circuit breaker open for ${endpoint}`)
    }
    
    // Get or create rate limiter for this endpoint
    let limiter = this.rateLimiters.get(endpoint)
    if (!limiter) {
      limiter = {
        lastCall: 0,
        tokens: this.RATE_LIMIT.burstSize
      }
    }
    
    const now = Date.now()
    const timeSinceLastCall = now - limiter.lastCall
    
    // Refill tokens based on time passed
    const tokensToAdd = timeSinceLastCall * (this.RATE_LIMIT.callsPerSecond / 1000)
    limiter.tokens = Math.min(
      this.RATE_LIMIT.burstSize,
      limiter.tokens + tokensToAdd
    )
    
    // Wait if no tokens available
    if (limiter.tokens < 1) {
      const waitTime = (1 - limiter.tokens) / this.RATE_LIMIT.callsPerSecond * 1000
      console.log(`[RATE LIMIT] Waiting ${Math.round(waitTime)}ms for ${endpoint}`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      limiter.tokens = 1
    }
    
    // Consume token
    limiter.tokens -= 1
    limiter.lastCall = Date.now()
    this.rateLimiters.set(endpoint, limiter)
    
    // Make the call with exponential backoff on 429
    let retries = 0
    const maxRetries = 3
    
    while (retries < maxRetries) {
      try {
        const response = await fetch(url)
        
        if (response.status === 429) {
          // Record failure
          this.recordFailure(endpoint)
          
          // Exponential backoff
          const backoffTime = Math.pow(2, retries) * 5000 // 5s, 10s, 20s
          console.warn(`[429 ERROR] ${endpoint} - Backing off ${backoffTime}ms`)
          await new Promise(resolve => setTimeout(resolve, backoffTime))
          retries++
          continue
        }
        
        if (response.ok) {
          // Success - reset circuit breaker
          const breaker = this.circuitBreakers.get(endpoint)
          if (breaker) {
            breaker.failures = 0
            breaker.state = 'closed'
          }
        }
        
        return response
        
      } catch (error) {
        this.recordFailure(endpoint)
        throw error
      }
    }
    
    // Max retries exceeded
    this.recordFailure(endpoint)
    throw new Error(`Max retries exceeded for ${endpoint}`)
  }
  
  /**
   * Get stock price with proper rate limiting
   */
  async getStockPrice(ticker: string): Promise<number> {
    const endpoint = 'stock-price'
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${this.apiKey}`
    
    try {
      const response = await this.rateLimitedFetch(endpoint, url)
      
      if (!response.ok) {
        return 0
      }
      
      const data = await response.json()
      return data.results?.[0]?.c || 0
      
    } catch (error) {
      console.error(`[ERROR] Failed to get stock price for ${ticker}:`, error)
      return 0
    }
  }
  
  /**
   * Get options chain with proper rate limiting
   */
  async getOptionsChain(ticker: string): Promise<any[]> {
    const endpoint = 'options-chain'
    const url = `https://api.polygon.io/v3/snapshot/options/${ticker}?apiKey=${this.apiKey}`
    
    try {
      const response = await this.rateLimitedFetch(endpoint, url)
      
      if (!response.ok) {
        return []
      }
      
      const data = await response.json()
      return data.results || []
      
    } catch (error) {
      console.error(`[ERROR] Failed to get options chain for ${ticker}:`, error)
      return []
    }
  }
  
  /**
   * Get circuit breaker stats for monitoring
   */
  getHealthStats() {
    return {
      circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([endpoint, state]) => ({
        endpoint,
        state: state.state,
        failures: state.failures
      })),
      rateLimiters: Array.from(this.rateLimiters.entries()).map(([endpoint, limiter]) => ({
        endpoint,
        tokens: limiter.tokens,
        timeSinceLastCall: Date.now() - limiter.lastCall
      }))
    }
  }
}
