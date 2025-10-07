/**
 * MINIMAL WORKING SCANNER
 * No complexity - just scan tickers and cache results
 */

import { PolygonClient } from '../polygon/properClient'
import { EQUITY_UNIVERSE, INDEX_UNIVERSE, FUTURES_UNIVERSE } from '../polygon/allTickers'

type MarketType = 'equity' | 'index' | 'futures'

interface Opportunity {
  id: string
  symbol: string
  strategy: string
  strike: number
  expiry: string
  dte: number
  premium: number
  roi: number
  roiPerDay: number
  volume: number
  openInterest: number
  marketType: MarketType
  iv?: number
}

interface CachedData {
  opportunities: Opportunity[]
  byStrategy: {
    'Cash Secured Put': Opportunity[]
    'Covered Call': Opportunity[]
    'Iron Condor': Opportunity[]
    'Strangle': Opportunity[]
    'Straddle': Opportunity[]
  }
  metadata: {
    lastScan: string
    batchNumber: number
    marketType: MarketType
    tickersScanned: number
  }
}

// Simple in-memory cache
const cache: Record<MarketType, CachedData | null> = {
  equity: null,
  index: null,
  futures: null
}

let isScanning: Record<MarketType, boolean> = {
  equity: false,
  index: false,
  futures: false
}

export class ProperScanner {
  private static instance: ProperScanner
  private client: PolygonClient
  
  private constructor() {
    this.client = PolygonClient.getInstance()
  }
  
  static getInstance(): ProperScanner {
    if (!ProperScanner.instance) {
      ProperScanner.instance = new ProperScanner()
    }
    return ProperScanner.instance
  }
  
  /**
   * Get cached data
   */
  getCached(marketType: MarketType): CachedData | null {
    return cache[marketType]
  }
  
  /**
   * Check if currently scanning
   */
  isScanning(marketType: MarketType): boolean {
    return isScanning[marketType]
  }
  
  /**
   * Get tickers for market type
   */
  static async getTickersForMarket(marketType: MarketType): Promise<string[]> {
    if (marketType === 'equity') {
      return EQUITY_UNIVERSE
    } else if (marketType === 'index') {
      return INDEX_UNIVERSE
    } else {
      return FUTURES_UNIVERSE
    }
  }
  
  /**
   * Scan a batch of tickers - SIMPLIFIED
   */
  async scanBatch(
    marketType: MarketType,
    batchNumber: number,
    tickers: string[]
  ): Promise<CachedData> {
    
    if (isScanning[marketType]) {
      console.log(`[SCANNER] Already scanning ${marketType}, skipping`)
      return cache[marketType] || this.emptyCache(marketType)
    }
    
    isScanning[marketType] = true
    console.log(`[SCANNER] Starting ${marketType} scan of ${tickers.length} tickers`)
    console.log(`[SCANNER] This will take approximately ${Math.round(tickers.length * 30 / 60)} minutes`)
    
    const allOpportunities: Opportunity[] = []
    let scannedCount = 0
    
    try {
      for (const ticker of tickers) {
        try {
          console.log(`[SCANNER] [${scannedCount + 1}/${tickers.length}] Scanning ${ticker}...`)
          
          // Get stock price
          const stockPrice = await this.client.getStockPrice(ticker)
          if (stockPrice === 0) {
            console.log(`[SCANNER] ${ticker}: No price data, skipping`)
            scannedCount++
            continue
          }
          
          // Get options chain
          const options = await this.client.getOptionsChain(ticker)
          if (options.length === 0) {
            console.log(`[SCANNER] ${ticker}: No options, skipping`)
            scannedCount++
            continue
          }
          
          // Process options
          for (const option of options) {
            const opp = this.convertToOpportunity(option, stockPrice, ticker, marketType)
            if (opp) {
              allOpportunities.push(opp)
            }
          }
          
          console.log(`[SCANNER] ${ticker}: Found ${allOpportunities.length} total opportunities so far`)
          scannedCount++
          
        } catch (error) {
          console.error(`[SCANNER] Error scanning ${ticker}:`, error)
          scannedCount++
        }
      }
    } finally {
      isScanning[marketType] = false
    }
    
    console.log(`[SCANNER] Scan complete! Found ${allOpportunities.length} opportunities from ${scannedCount} tickers`)
    
    // Categorize by strategy
    const byStrategy = {
      'Cash Secured Put': allOpportunities
        .filter(o => o.strategy === 'Cash Secured Put')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 50),
      'Covered Call': allOpportunities
        .filter(o => o.strategy === 'Covered Call')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 50),
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
        tickersScanned: scannedCount
      }
    }
    
    cache[marketType] = cacheData
    console.log(`[SCANNER] Cached ${allOpportunities.length} opportunities for ${marketType}`)
    
    return cacheData
  }
  
  /**
   * Convert option to opportunity
   */
  private convertToOpportunity(
    option: any,
    stockPrice: number,
    symbol: string,
    marketType: MarketType
  ): Opportunity | null {
    
    try {
      const strike = option.details?.strike_price
      const bid = option.last_quote?.bid || 0
      const ask = option.last_quote?.ask || 0
      
      if (!strike || (bid === 0 && ask === 0)) return null
      
      const premium = (bid + ask) / 2
      if (premium < 0.1) return null // Skip very low premiums
      
      const isPut = option.details?.contract_type === 'put'
      const capital = strike * 100
      const roi = (premium * 100) / capital
      
      const expiry = new Date(option.details?.expiration_date)
      const today = new Date()
      const dte = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dte <= 0 || dte > 60) return null
      
      const roiPerDay = roi / dte
      
      return {
        id: `${option.details?.ticker}_${Date.now()}_${Math.random()}`,
        symbol,
        strike,
        expiry: option.details?.expiration_date,
        dte,
        premium: Number(premium.toFixed(2)),
        roi: Number(roi.toFixed(4)),
        roiPerDay: Number(roiPerDay.toFixed(6)),
        strategy: isPut ? 'Cash Secured Put' : 'Covered Call',
        volume: option.day?.volume || 0,
        openInterest: option.open_interest || 0,
        marketType
      }
    } catch (error) {
      return null
    }
  }
  
  /**
   * Return empty cache structure
   */
  private emptyCache(marketType: MarketType): CachedData {
    return {
      opportunities: [],
      byStrategy: {
        'Cash Secured Put': [],
        'Covered Call': [],
        'Iron Condor': [],
        'Strangle': [],
        'Straddle': []
      },
      metadata: {
        lastScan: new Date().toISOString(),
        batchNumber: 0,
        marketType,
        tickersScanned: 0
      }
    }
  }
}
