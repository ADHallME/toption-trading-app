/**
 * PROPERLY ARCHITECTED ROLLING SCANNER
 * Now supports all 3 asset classes: Equities, Indexes, Futures
 */

import { PolygonClient } from '../polygon/properClient'
import { fetchAllOptionableEquities, INDEX_UNIVERSE, FUTURES_UNIVERSE } from '../polygon/allTickers'

type MarketType = 'equity' | 'index' | 'futures'

interface ScanMetrics {
  totalTickers: number
  successfulScans: number
  failedScans: number
  opportunitiesFound: number
  startTime: number
  endTime?: number
  apiCallsMade: number
  circuitBreakerTrips: number
}

interface CachedData {
  opportunities: any[]
  byStrategy: {
    'Cash Secured Put': any[]
    'Covered Call': any[]
    'Iron Condor': any[]
    'Strangle': any[]
    'Straddle': any[]
  }
  metadata: {
    lastScan: string
    batchNumber: number
    marketType: MarketType
    metrics: ScanMetrics
  }
}

const cache: Record<MarketType, CachedData | null> = {
  equity: null,
  index: null,
  futures: null
}

export class ProperScanner {
  private static instance: ProperScanner
  private client: PolygonClient
  private metrics: ScanMetrics
  
  private constructor() {
    this.client = PolygonClient.getInstance()
    this.metrics = this.initMetrics()
  }
  
  static getInstance(): ProperScanner {
    if (!ProperScanner.instance) {
      ProperScanner.instance = new ProperScanner()
    }
    return ProperScanner.instance
  }
  
  private initMetrics(): ScanMetrics {
    return {
      totalTickers: 0,
      successfulScans: 0,
      failedScans: 0,
      opportunitiesFound: 0,
      startTime: Date.now(),
      apiCallsMade: 0,
      circuitBreakerTrips: 0
    }
  }
  
  /**
   * Scan a single ticker properly
   */
  private async scanTicker(ticker: string, marketType: MarketType): Promise<any[]> {
    const opportunities: any[] = []
    
    try {
      console.log(`[SCAN] ${ticker}: Fetching stock price...`)
      const stockPrice = await this.client.getStockPrice(ticker)
      this.metrics.apiCallsMade++
      
      if (stockPrice === 0) {
        console.log(`[SCAN] ${ticker}: No price data, skipping`)
        this.metrics.failedScans++
        return []
      }
      
      console.log(`[SCAN] ${ticker}: Fetching options chain...`)
      const options = await this.client.getOptionsChain(ticker)
      this.metrics.apiCallsMade++
      
      if (options.length === 0) {
        console.log(`[SCAN] ${ticker}: No options data`)
        this.metrics.failedScans++
        return []
      }
      
      // Process options
      for (const option of options) {
        if (option.open_interest < 10) continue
        
        const opportunity = this.convertToOpportunity(option, stockPrice, marketType)
        if (opportunity) {
          opportunities.push(opportunity)
        }
      }
      
      this.metrics.successfulScans++
      this.metrics.opportunitiesFound += opportunities.length
      console.log(`[SCAN] ${ticker}: Found ${opportunities.length} opportunities`)
      
    } catch (error) {
      this.metrics.failedScans++
      
      if (error instanceof Error && error.message.includes('Circuit breaker')) {
        this.metrics.circuitBreakerTrips++
        console.error(`[SCAN] ${ticker}: Circuit breaker open, stopping scan`)
        throw error
      }
      
      console.error(`[SCAN] ${ticker}: Error -`, error)
    }
    
    return opportunities
  }
  
  /**
   * Scan a batch of tickers
   */
  async scanBatch(
    marketType: MarketType, 
    batchNumber: number,
    tickers: string[]
  ): Promise<CachedData> {
    console.log(`[BATCH ${batchNumber}] Starting ${marketType} scan of ${tickers.length} tickers`)
    
    this.metrics = this.initMetrics()
    this.metrics.totalTickers = tickers.length
    
    const allOpportunities: any[] = []
    
    for (let i = 0; i < tickers.length; i++) {
      try {
        const ticker = tickers[i]
        const tickerOpps = await this.scanTicker(ticker, marketType)
        allOpportunities.push(...tickerOpps)
        
        // Progress logging every 10 tickers
        if ((i + 1) % 10 === 0) {
          console.log(`[BATCH ${batchNumber}] Progress: ${i + 1}/${tickers.length}`)
          console.log(`[METRICS] Success: ${this.metrics.successfulScans}, Failed: ${this.metrics.failedScans}, Opportunities: ${this.metrics.opportunitiesFound}`)
        }
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('Circuit breaker')) {
          console.error(`[BATCH ${batchNumber}] Circuit breaker tripped, stopping batch`)
          break
        }
      }
    }
    
    this.metrics.endTime = Date.now()
    const duration = this.metrics.endTime - this.metrics.startTime
    
    console.log(`[BATCH ${batchNumber}] Complete in ${duration}ms`)
    console.log(`[METRICS]`, this.metrics)
    
    // Categorize by strategy
    const byStrategy = {
      'Cash Secured Put': allOpportunities
        .filter(o => o.strategy === 'Cash Secured Put')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 100),
      'Covered Call': allOpportunities
        .filter(o => o.strategy === 'Covered Call')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 100),
      'Iron Condor': [],
      'Strangle': [],
      'Straddle': []
    }
    
    const cacheData: CachedData = {
      opportunities: allOpportunities.sort((a, b) => b.roiPerDay - a.roiPerDay),
      byStrategy,
      metadata: {
        lastScan: new Date().toISOString(),
        batchNumber,
        marketType,
        metrics: this.metrics
      }
    }
    
    cache[marketType] = cacheData
    return cacheData
  }
  
  getCached(marketType: MarketType): CachedData | null {
    return cache[marketType]
  }
  
  /**
   * Get tickers for a market type
   */
  static async getTickersForMarket(marketType: MarketType): Promise<string[]> {
    const apiKey = process.env.POLYGON_API_KEY || process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
    
    if (marketType === 'equity') {
      return await fetchAllOptionableEquities(apiKey)
    } else if (marketType === 'index') {
      return INDEX_UNIVERSE
    } else {
      return FUTURES_UNIVERSE
    }
  }
  
  private convertToOpportunity(option: any, stockPrice: number, marketType: MarketType): any | null {
    const strike = option.details.strike_price
    const bid = option.last_quote?.bid || 0
    const ask = option.last_quote?.ask || 0
    
    if (bid === 0 && ask === 0) return null
    
    const premium = (bid + ask) / 2
    const isPut = option.details.contract_type === 'put'
    const capital = strike * 100
    const roi = (premium * 100) / capital
    
    const expiry = new Date(option.details.expiration_date)
    const today = new Date()
    const dte = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (dte <= 0 || dte > 60) return null
    
    const roiPerDay = roi / dte
    
    return {
      id: `${option.details.ticker}_${Date.now()}`,
      symbol: option.underlying_asset.ticker,
      strike,
      expiry: option.details.expiration_date,
      dte,
      premium: Number(premium.toFixed(2)),
      roi: Number(roi.toFixed(4)),
      roiPerDay: Number(roiPerDay.toFixed(4)),
      strategy: isPut ? 'Cash Secured Put' : 'Covered Call',
      volume: option.day?.volume || 0,
      openInterest: option.open_interest,
      marketType,
      delta: option.greeks?.delta || 0,
      theta: option.greeks?.theta || 0,
      iv: option.implied_volatility || 0
    }
  }
}
