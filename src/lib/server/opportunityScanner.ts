// Server-Side Opportunity Scanner - MULTI-MARKET SUPPORT
// Scans ALL optionable US equities, indexes, and futures
// Caches results separately for each market type

import { PolygonOptionsService } from '../polygon/optionsSnapshot'
import { fetchAllOptionableEquities, INDEX_UNIVERSE, FUTURES_UNIVERSE } from '../polygon/allTickers'

type MarketType = 'equity' | 'index' | 'futures'

interface CachedOpportunities {
  opportunities: any[]
  categorized: {
    'market-movers': any[]
    'high-iv': any[]
    'conservative': any[]
    'earnings': any[]
  }
  byStrategy: {
    'CSP': any[]
    'Covered Call': any[]
    'Iron Condor': any[]
    'Strangle': any[]
    'Straddle': any[]
  }
  metadata: {
    lastScan: string
    tickersScanned: number
    totalOpportunities: number
    scanDurationMs: number
    marketType: MarketType
  }
}

// In-memory cache for each market type
const cacheStore: Record<MarketType, CachedOpportunities | null> = {
  equity: null,
  index: null,
  futures: null
}

const lastScanTimes: Record<MarketType, number> = {
  equity: 0,
  index: 0,
  futures: 0
}

let isScanningStore: Record<MarketType, boolean> = {
  equity: false,
  index: false,
  futures: false
}

export class ServerOpportunityScanner {
  private static instance: ServerOpportunityScanner
  private polygonService: PolygonOptionsService
  
  private constructor() {
    this.polygonService = PolygonOptionsService.getInstance()
  }
  
  static getInstance(): ServerOpportunityScanner {
    if (!ServerOpportunityScanner.instance) {
      ServerOpportunityScanner.instance = new ServerOpportunityScanner()
    }
    return ServerOpportunityScanner.instance
  }
  
  /**
   * Get cached opportunities for a specific market type (instant)
   */
  getCachedOpportunities(marketType: MarketType): CachedOpportunities | null {
    return cacheStore[marketType]
  }
  
  /**
   * Check if cache is stale for a specific market (older than 5 minutes)
   */
  isCacheStale(marketType: MarketType): boolean {
    if (!cacheStore[marketType]) return true
    const fiveMinutesMs = 5 * 60 * 1000
    return Date.now() - lastScanTimes[marketType] > fiveMinutesMs
  }
  
  /**
   * Force a new scan for specific market type
   */
  async forceScan(marketType: MarketType): Promise<void> {
    console.log(`[SERVER SCAN] Force scan requested for ${marketType}`)
    await this.scanMarket(marketType)
  }
  
  /**
   * Scan ALL market types (called by cron job)
   */
  async scanAllMarkets(): Promise<Record<MarketType, CachedOpportunities>> {
    console.log('[SERVER SCAN] Starting FULL MARKET SCAN (all 3 types)...')
    const startTime = Date.now()
    
    // Scan all three markets in parallel
    const results = await Promise.allSettled([
      this.scanMarket('equity'),
      this.scanMarket('index'),
      this.scanMarket('futures')
    ])
    
    const duration = Date.now() - startTime
    console.log(`[SERVER SCAN] FULL MARKET SCAN complete in ${(duration / 1000).toFixed(1)}s`)
    
    // Log results
    results.forEach((result, idx) => {
      const marketType = ['equity', 'index', 'futures'][idx]
      if (result.status === 'fulfilled') {
        const data = result.value
        console.log(`  ✅ ${marketType}: ${data.metadata.totalOpportunities} opportunities from ${data.metadata.tickersScanned} tickers`)
      } else {
        console.error(`  ❌ ${marketType}: ${result.reason}`)
      }
    })
    
    return {
      equity: cacheStore.equity!,
      index: cacheStore.index!,
      futures: cacheStore.futures!
    }
  }
  
  /**
   * Scan a specific market type
   */
  async scanMarket(marketType: MarketType): Promise<CachedOpportunities> {
    // Prevent multiple simultaneous scans of same market
    if (isScanningStore[marketType]) {
      console.log(`[SERVER SCAN] ${marketType} scan already in progress, returning cached data`)
      return cacheStore[marketType] || this.getEmptyCache(marketType)
    }
    
    isScanningStore[marketType] = true
    const startTime = Date.now()
    
    try {
      console.log(`[SERVER SCAN] Starting ${marketType} scan...`)
      
      // Get tickers for this market type
      const tickers = await this.getTickersForMarket(marketType)
      console.log(`[SERVER SCAN] ${marketType}: Found ${tickers.length} tickers to scan`)
      
      // Scan with batching to respect rate limits
      const allOpportunities = await this.scanWithRateLimiting(tickers, marketType)
      
      console.log(`[SERVER SCAN] ${marketType}: Found ${allOpportunities.length} total opportunities`)
      
      // Categorize
      const byStrategy = this.categorizeByStrategy(allOpportunities)
      const categorized = this.categorizeByType(allOpportunities)
      
      const scanDuration = Date.now() - startTime
      
      // Build cache object
      const cacheData: CachedOpportunities = {
        opportunities: allOpportunities,
        categorized,
        byStrategy,
        metadata: {
          lastScan: new Date().toISOString(),
          tickersScanned: tickers.length,
          totalOpportunities: allOpportunities.length,
          scanDurationMs: scanDuration,
          marketType
        }
      }
      
      // Update cache
      cacheStore[marketType] = cacheData
      lastScanTimes[marketType] = Date.now()
      
      console.log(`[SERVER SCAN] ${marketType} complete! Scanned ${tickers.length} tickers in ${(scanDuration / 1000).toFixed(1)}s`)
      console.log(`[SERVER SCAN] ${marketType} breakdown:`)
      console.log(`  - Market Movers: ${categorized['market-movers'].length}`)
      console.log(`  - High IV: ${categorized['high-iv'].length}`)
      console.log(`  - Conservative: ${categorized['conservative'].length}`)
      console.log(`  - Earnings: ${categorized['earnings'].length}`)
      
      return cacheData
      
    } catch (error) {
      console.error(`[SERVER SCAN] Error during ${marketType} scan:`, error)
      throw error
    } finally {
      isScanningStore[marketType] = false
    }
  }
  
  /**
   * Get tickers for a specific market type
   */
  private async getTickersForMarket(marketType: MarketType): Promise<string[]> {
    const apiKey = process.env.POLYGON_API_KEY || process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
    
    switch (marketType) {
      case 'equity':
        // Fetch ALL optionable equities from Polygon
        return await fetchAllOptionableEquities(apiKey)
      
      case 'index':
        // Use predefined index list
        return INDEX_UNIVERSE
      
      case 'futures':
        // Use predefined futures list
        return FUTURES_UNIVERSE
      
      default:
        return []
    }
  }
  
  /**
   * Scan tickers with rate limiting to respect Polygon API limits
   * Batches: 10 tickers at a time, 5 second delay between batches - Conservative but reasonable
   */
  private async scanWithRateLimiting(tickers: string[], marketType: MarketType): Promise<any[]> {
    const BATCH_SIZE = 10 // Increased from 5 to 10
    const DELAY_MS = 5000 // 5 seconds between batches - Conservative but reasonable
    
    const allOpportunities: any[] = []
    const batches = Math.ceil(tickers.length / BATCH_SIZE)
    
    for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
      const batch = tickers.slice(i, i + BATCH_SIZE)
      const batchNum = Math.floor(i / BATCH_SIZE) + 1
      
      console.log(`[SERVER SCAN] ${marketType} batch ${batchNum}/${batches} (${batch.length} tickers)`)
      
      try {
        // Process batch in parallel
        const batchResults = await Promise.all(
          batch.map(ticker => this.scanSingleTicker(ticker))
        )
        
        // Flatten results
        const batchOpportunities = batchResults.flat().filter(Boolean)
        allOpportunities.push(...batchOpportunities)
        
        console.log(`[SERVER SCAN] ${marketType} batch ${batchNum} complete: ${batchOpportunities.length} opportunities`)
        
      } catch (error) {
        console.error(`[SERVER SCAN] Error in ${marketType} batch ${batchNum}:`, error)
        // Continue with next batch even if this one fails
      }
      
      // Delay between batches (except last batch)
      if (i + BATCH_SIZE < tickers.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS))
      }
    }
    
    return allOpportunities
  }
  
  /**
   * Scan a single ticker for opportunities
   */
  private async scanSingleTicker(ticker: string): Promise<any[]> {
    try {
      const stockPrice = await this.polygonService.getStockPrice(ticker)
      if (stockPrice === 0) return []
      
      const options = await this.polygonService.fetchOptionsChain(ticker)
      if (options.length === 0) return []
      
      const opportunities: any[] = []
      
      for (const option of options) {
        // Apply filters
        if (option.open_interest < 10) continue
        
        // Determine category - LOWERED THRESHOLDS
        let category: 'market-movers' | 'high-iv' | 'conservative' | 'earnings' = 'conservative'
        
        // Lower thresholds for better categorization
        if (option.day.volume > 100) { // Was 1000
          category = 'market-movers'
        } else if (option.implied_volatility && option.implied_volatility > 0.3) { // Was 0.5
          category = 'high-iv'
        } else if (option.open_interest > 500) {
          category = 'conservative'
        }
        
        // Convert to opportunity format
        const opportunity = await this.polygonService.convertToOpportunity(option, stockPrice, category)
        
        if (opportunity) {
          opportunities.push(opportunity)
        }
      }
      
      return opportunities
      
    } catch (error) {
      // Silently skip tickers that error
      return []
    }
  }
  
  /**
   * Categorize opportunities by strategy type
   */
  private categorizeByStrategy(opportunities: any[]): CachedOpportunities['byStrategy'] {
    return {
      'CSP': opportunities.filter(o => o.strategy === 'Cash Secured Put').slice(0, 100),
      'Covered Call': opportunities.filter(o => o.strategy === 'Covered Call').slice(0, 100),
      'Iron Condor': [], // TODO: Add Iron Condor detection
      'Strangle': [], // TODO: Add Strangle detection
      'Straddle': [] // TODO: Add Straddle detection
    }
  }
  
  /**
   * Categorize opportunities by type
   */
  private categorizeByType(opportunities: any[]): CachedOpportunities['categorized'] {
    return {
      'market-movers': opportunities
        .filter(o => o.category === 'market-movers')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 100),
      'high-iv': opportunities
        .filter(o => o.category === 'high-iv')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 100),
      'conservative': opportunities
        .filter(o => o.category === 'conservative')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 100),
      'earnings': opportunities
        .filter(o => o.category === 'earnings')
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
        .slice(0, 100)
    }
  }
  
  /**
   * Get empty cache structure
   */
  private getEmptyCache(marketType: MarketType): CachedOpportunities {
    return {
      opportunities: [],
      categorized: {
        'market-movers': [],
        'high-iv': [],
        'conservative': [],
        'earnings': []
      },
      byStrategy: {
        'CSP': [],
        'Covered Call': [],
        'Iron Condor': [],
        'Strangle': [],
        'Straddle': []
      },
      metadata: {
        lastScan: new Date().toISOString(),
        tickersScanned: 0,
        totalOpportunities: 0,
        scanDurationMs: 0,
        marketType
      }
    }
  }
}

export default ServerOpportunityScanner
